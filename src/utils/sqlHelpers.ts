import * as vscode from 'vscode';
import { logInfo, logError } from './helpers';

interface SqlError {
    type: string;
    description: string;
    suggestion: string;
    line?: number;
}

let diagnosticCollection: vscode.DiagnosticCollection | null = null;

export type SqlDialect = 'mysql' | 'postgresql';

export class SqlHelper {

    // -------------------- ANALIZAR SQL --------------------
    static async analyzeSql(editor: vscode.TextEditor, dialect: SqlDialect): Promise<void> {
        const document = editor.document;
        const text = document.getText();

        if (!text || text.trim() === '') {
            vscode.window.showWarningMessage('No SQL queries found in the file');
            logInfo(`SQL analysis (${dialect}): no SQL queries found`);
            return;
        }

        const errors = this.detectErrors(text, dialect);

        if (errors.length === 0) {
            vscode.window.showInformationMessage(`✅ No common SQL issues detected for ${dialect.toUpperCase()}`);
            logInfo(`SQL analysis (${dialect}): no errors detected`);
            this.clearDiagnostics(document.uri);
            return;
        }

        this.publishDiagnostics(document, errors, dialect);

        const errorItems = errors.map(err => ({
            label: `$(error) ${err.type}`,
            detail: err.description,
            description: err.suggestion,
            error: err
        }));

        const selected = await vscode.window.showQuickPick(errorItems, {
            placeHolder: `Found ${errors.length} SQL error(s). Select one to view details`
        });

        if (selected) {
            this.showErrorDetails(selected.error);
        }
    }

    // -------------------- DETECCIÓN DE ERRORES --------------------
    private static detectErrors(text: string, dialect: SqlDialect): SqlError[] {
        const errors: SqlError[] = [];
        const cleanText = text.replace(/--.*$/gm, '');
        const statements = cleanText.split(';');
        let lineOffset = 0;

        statements.forEach(stmt => {
            const trimmedStmt = stmt.trim();
            if (!trimmedStmt) {
                lineOffset += (stmt.match(/\n/g) || []).length;
                return;
            }

            const startLine = lineOffset + 1;
            const upperStmt = trimmedStmt.toUpperCase();

            // SELECT sin FROM
            if (upperStmt.includes('SELECT') && !upperStmt.includes('FROM')) {
                errors.push({
                    type: 'SELECT without FROM',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'Most SELECT queries require a FROM clause',
                    line: startLine
                });
            }

            // INSERT sin VALUES
            if (upperStmt.includes('INSERT INTO') && !upperStmt.includes('VALUES')) {
                errors.push({
                    type: 'INSERT without VALUES',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'INSERT INTO table (columns) VALUES (values);',
                    line: startLine
                });
            }

            // UPDATE sin WHERE
            if (upperStmt.includes('UPDATE') && !upperStmt.includes('WHERE')) {
                errors.push({
                    type: '⚠️ UPDATE without WHERE',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'UPDATE without WHERE will affect ALL rows',
                    line: startLine
                });
            }

            // DELETE sin WHERE
            if (upperStmt.includes('DELETE FROM') && !upperStmt.includes('WHERE')) {
                errors.push({
                    type: '🔴 DELETE without WHERE',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'DELETE without WHERE will remove all rows',
                    line: startLine
                });
            }

            // Paréntesis balanceados
            const openParen = (trimmedStmt.match(/\(/g) || []).length;
            const closeParen = (trimmedStmt.match(/\)/g) || []).length;
            if (openParen !== closeParen) {
                errors.push({
                    type: 'Unbalanced parentheses',
                    description: `Statement starting at line ${startLine}: Open: ${openParen}, Close: ${closeParen}`,
                    suggestion: 'Ensure all parentheses are balanced',
                    line: startLine
                });
            }

            // Comillas simples balanceadas
            const singleQuotes = (trimmedStmt.match(/'/g) || []).length;
            if (singleQuotes % 2 !== 0) {
                errors.push({
                    type: 'Unclosed quote',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'Ensure all single quotes are balanced',
                    line: startLine
                });
            }

            // Punto y coma final
            if (!text.includes(trimmedStmt + ';')) {
                errors.push({
                    type: 'Missing semicolon',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt}`,
                    suggestion: 'SQL statements should end with ;',
                    line: startLine
                });
            }

            lineOffset += (stmt.match(/\n/g) || []).length + 1;
        });

        return errors;
    }

    // -------------------- FORMATEO --------------------
    static async formatSql(editor: vscode.TextEditor, dialect?: SqlDialect): Promise<void> {
    const document = editor.document;
    const selection = editor.selection;
    const text = selection.isEmpty ? document.getText() : document.getText(selection);

    // Palabras clave por defecto
    let keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'ORDER BY', 'GROUP BY',
        'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];

    // Añadir keywords específicas por dialecto
    if (dialect === 'mysql') {
        keywords.push('AUTO_INCREMENT', 'ENGINE', 'CHARSET');
    } else if (dialect === 'postgresql') {
        keywords.push('SERIAL', 'BIGSERIAL', 'RETURNING');
    }

    let formatted = text;
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
    });

    formatted = formatted
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

    const range = selection.isEmpty
        ? new vscode.Range(document.positionAt(0), document.positionAt(text.length))
        : selection;

    await editor.edit(editBuilder => {
        editBuilder.replace(range, formatted);
    });

    vscode.window.showInformationMessage(`✅ ${dialect ? dialect.toUpperCase() : 'SQL'} formatted successfully`);
}


    // -------------------- AUTO-FIX GENERAL --------------------
    static async getAutoFix(editor: vscode.TextEditor, text: string, dialect: SqlDialect): Promise<string | null> {
        const statements = text.split(';');
        let newText = '';

        statements.forEach(stmt => {
            let trimmedStmt = stmt.trim();
            if (!trimmedStmt) {
                newText += '\n';
                return;
            }

            // Comillas desbalanceadas
            const singleQuotes = (trimmedStmt.match(/'/g) || []).length;
            if (singleQuotes % 2 !== 0) trimmedStmt += "'";

            // Paréntesis desbalanceados
            const openParen = (trimmedStmt.match(/\(/g) || []).length;
            const closeParen = (trimmedStmt.match(/\)/g) || []).length;
            if (openParen > closeParen) trimmedStmt += ')'.repeat(openParen - closeParen);

            // Punto y coma
            if (!trimmedStmt.endsWith(';')) trimmedStmt += ';';

            // Reglas de dialecto
            if (/CREATE\s+TABLE/i.test(trimmedStmt)) {
                if (dialect === 'postgresql') {
                    trimmedStmt = trimmedStmt.replace(
                        /(\b\w+\b)\s+(serial|primary|key|integer|int|varchar|text)?/gi,
                        (_, colName, type) => {
                            let finalType = type?.toUpperCase() || 'INTEGER';
                            if (/SERIAL/i.test(finalType)) finalType = 'SERIAL';
                            if (/PRIMARY/i.test(finalType)) finalType = 'INTEGER PRIMARY KEY';
                            if (/INTGER/i.test(finalType) || /INT/i.test(finalType)) finalType = 'INTEGER';
                            if (/VARCHAR/i.test(finalType)) finalType = 'VARCHAR(255)';
                            if (/TEXT/i.test(finalType)) finalType = 'TEXT';
                            return `${colName} ${finalType}`;
                        }
                    );
                } else if (dialect === 'mysql') {
                    trimmedStmt = trimmedStmt.replace(
                        /(\b\w+\b)\s+(int|integer|varchar|text|primary)?/gi,
                        (_, colName, type) => {
                            let finalType = type?.toUpperCase() || 'INT';
                            if (/PRIMARY/i.test(finalType)) finalType = 'INT PRIMARY KEY';
                            if (/INT/i.test(finalType)) finalType = 'INT';
                            if (/VARCHAR/i.test(finalType)) finalType = 'VARCHAR(255)';
                            if (/TEXT/i.test(finalType)) finalType = 'TEXT';
                            return `${colName} ${finalType}`;
                        }
                    );
                }
            }

            newText += trimmedStmt + '\n';
        });

        return newText !== text ? newText : null;
    }

    static async applyAutoFix(editor: vscode.TextEditor, dialect: SqlDialect): Promise<void> {
        const document = editor.document;
        const text = document.getText();
        const fixed = await this.getAutoFix(editor, text, dialect);

        if (!fixed) {
            vscode.window.showInformationMessage('✅ No fixes needed. SQL is already correct.');
            return;
        }

        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(text.length));

        await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, fixed);
        });

        vscode.window.showInformationMessage(`✅ All ${dialect.toUpperCase()} SQL issues have been auto-fixed!`);
        logInfo(`Applied auto-fix to ${dialect.toUpperCase()} SQL in editor.`);
    }

    private static showErrorDetails(error: SqlError): void {
        const message = `
📋 **${error.type}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${error.description}

💡 **Fix:**
${error.suggestion}
        `.trim();
        vscode.window.showInformationMessage(message, { modal: true });
        logInfo(`Detected SQL error: ${error.type}`);
    }

    private static publishDiagnostics(document: vscode.TextDocument, errors: SqlError[], dialect: SqlDialect): void {
        if (!diagnosticCollection) {
            diagnosticCollection = vscode.languages.createDiagnosticCollection('sql-helper');
        }

        const diagnostics: vscode.Diagnostic[] = errors.map(error => {
            const lineNum = (error.line ?? 1) - 1;
            const line = document.lineAt(Math.min(lineNum, document.lineCount - 1));
            const range = new vscode.Range(
                new vscode.Position(line.lineNumber, 0),
                new vscode.Position(line.lineNumber, line.text.length)
            );

            const diagnostic = new vscode.Diagnostic(
                range,
                `[${dialect.toUpperCase()}] ${error.type}: ${error.description}`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = 'sql-helper';
            diagnostic.source = 'SQL Helper';
            return diagnostic;
        });

        diagnosticCollection.set(document.uri, diagnostics);
        logInfo(`Published ${diagnostics.length} ${dialect.toUpperCase()} SQL issues to the Problems panel`);
    }

    private static clearDiagnostics(uri: vscode.Uri): void {
        if (diagnosticCollection) diagnosticCollection.delete(uri);
    }
}
