import * as vscode from 'vscode';
import { logInfo, logError } from './helpers';
import { SqlError, SqlDialect, SqlAnalysisResult } from '../types';
import { Validator } from '../core/Validator';

let diagnosticCollection: vscode.DiagnosticCollection | null = null;

export class SqlHelper {

    /**
     * Analiza SQL en busca de errores
     */
    static async analyzeSql(editor: vscode.TextEditor, dialect: SqlDialect): Promise<void> {
        const document = editor.document;
        const text = document.getText();

        if (!Validator.validateDocumentNotEmpty(text)) {
            vscode.window.showWarningMessage('No SQL queries found in the file');
            logInfo(`SQL analysis (${dialect}): no SQL queries found`);
            return;
        }

        const result = this.detectErrors(text, dialect);

        if (result.errors.length === 0 && result.warnings.length === 0) {
            vscode.window.showInformationMessage(`✅ No common SQL issues detected for ${dialect.toUpperCase()}`);
            logInfo(`SQL analysis (${dialect}): no errors detected`);
            this.clearDiagnostics(document.uri);
            return;
        }

        this.publishDiagnostics(document, result, dialect);

        const allIssues = [...result.errors, ...result.warnings];
        const errorItems = allIssues.map(err => ({
            label: `$(error) ${err.type}`,
            detail: err.description,
            description: err.suggestion,
            error: err
        }));

        const selected = await vscode.window.showQuickPick(errorItems, {
            placeHolder: `Found ${allIssues.length} SQL issue(s). Select one to view details`
        });

        if (selected) {
            this.showErrorDetails(selected.error);
        }
    }

    /**
     * Detecta errores en sentencias SQL
     */
    private static detectErrors(text: string, dialect: SqlDialect): SqlAnalysisResult {
        const errors: SqlError[] = [];
        const warnings: SqlError[] = [];

        const cleanText = text.replace(/--.*$/gm, ''); // Remover comentarios
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
                    description: `Statement starting at line ${startLine}: ${trimmedStmt.substring(0, 50)}...`,
                    suggestion: 'Most SELECT queries require a FROM clause',
                    line: startLine,
                    severity: 'error'
                });
            }

            // INSERT sin VALUES
            if (upperStmt.includes('INSERT INTO') && !upperStmt.includes('VALUES')) {
                errors.push({
                    type: 'INSERT without VALUES',
                    description: `Statement starting at line ${startLine}`,
                    suggestion: 'INSERT INTO table (columns) VALUES (values);',
                    line: startLine,
                    severity: 'error'
                });
            }

            // UPDATE sin WHERE - CRÍTICO
            if (upperStmt.includes('UPDATE') && !upperStmt.includes('WHERE')) {
                errors.push({
                    type: '⚠️ UPDATE without WHERE',
                    description: `Statement starting at line ${startLine}: ${trimmedStmt.substring(0, 50)}...`,
                    suggestion: 'UPDATE without WHERE will affect ALL rows - DANGEROUS!',
                    line: startLine,
                    severity: 'error'
                });
            }

            // DELETE sin WHERE - CRÍTICO
            if (upperStmt.includes('DELETE FROM') && !upperStmt.includes('WHERE')) {
                errors.push({
                    type: '🔴 DELETE without WHERE',
                    description: `Statement starting at line ${startLine}`,
                    suggestion: 'DELETE without WHERE will remove all rows - DANGEROUS!',
                    line: startLine,
                    severity: 'error'
                });
            }

            // Paréntesis balanceados
            if (!Validator.areParenthesesBalanced(trimmedStmt)) {
                const openParen = Validator.countOccurrences(trimmedStmt, '(');
                const closeParen = Validator.countOccurrences(trimmedStmt, ')');
                warnings.push({
                    type: 'Unbalanced parentheses',
                    description: `Line ${startLine}: Open: ${openParen}, Close: ${closeParen}`,
                    suggestion: 'Ensure all parentheses are balanced',
                    line: startLine,
                    severity: 'warning'
                });
            }

            // Comillas balanceadas
            if (!Validator.areQuotesBalanced(trimmedStmt)) {
                warnings.push({
                    type: 'Unclosed quote',
                    description: `Statement starting at line ${startLine}`,
                    suggestion: 'Ensure all single quotes are balanced',
                    line: startLine,
                    severity: 'warning'
                });
            }

            // Punto y coma final
            if (!text.substring(0, text.indexOf(trimmedStmt) + trimmedStmt.length).endsWith(';')) {
                warnings.push({
                    type: 'Missing semicolon',
                    description: `Statement starting at line ${startLine}`,
                    suggestion: 'SQL statements should end with ;',
                    line: startLine,
                    severity: 'warning'
                });
            }

            lineOffset += (stmt.match(/\n/g) || []).length + 1;
        });

        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }

    /**
     * Formatea SQL con saltos de línea apropiados
     */
    static async formatSql(editor: vscode.TextEditor, dialect?: SqlDialect): Promise<void> {
        const document = editor.document;
        const selection = editor.selection;
        const text = selection.isEmpty ? document.getText() : document.getText(selection);

        const keywords = this.getKeywordsForDialect(dialect);
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

    /**
     * Obtiene las palabras clave para formatear según el dialecto
     */
    private static getKeywordsForDialect(dialect?: SqlDialect): string[] {
        const baseKeywords = [
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'ORDER BY', 'GROUP BY',
            'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
            'CREATE', 'DROP', 'ALTER', 'AND', 'OR', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'
        ];

        if (dialect === SqlDialect.MYSQL) {
            baseKeywords.push('AUTO_INCREMENT', 'ENGINE', 'CHARSET', 'COLLATE');
        } else if (dialect === SqlDialect.POSTGRESQL) {
            baseKeywords.push('SERIAL', 'BIGSERIAL', 'RETURNING', 'LANGUAGE');
        }

        return baseKeywords;
    }

    /**
     * Aplica correcciones automáticas al SQL
     */
    static async applyAutoFix(editor: vscode.TextEditor, dialect: SqlDialect): Promise<void> {
        const document = editor.document;
        const text = document.getText();
        const fixed = this.getAutoFixedText(text, dialect);

        if (!fixed || fixed === text) {
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

    /**
     * Genera el texto corregido automáticamente
     */
    private static getAutoFixedText(text: string, dialect: SqlDialect): string {
        const statements = text.split(';');
        let newText = '';

        statements.forEach(stmt => {
            let trimmedStmt = stmt.trim();
            if (!trimmedStmt) {
                newText += '\n';
                return;
            }

            // Corregir comillas desbalanceadas
            if (!Validator.areQuotesBalanced(trimmedStmt)) {
                const singleQuotes = Validator.countOccurrences(trimmedStmt, "'");
                if (singleQuotes % 2 !== 0) {
                    trimmedStmt += "'";
                }
            }

            // Corregir paréntesis desbalanceados
            if (!Validator.areParenthesesBalanced(trimmedStmt)) {
                const openParen = Validator.countOccurrences(trimmedStmt, '(');
                const closeParen = Validator.countOccurrences(trimmedStmt, ')');
                if (openParen > closeParen) {
                    trimmedStmt += ')'.repeat(openParen - closeParen);
                }
            }

            // Agregar punto y coma si falta
            if (!trimmedStmt.endsWith(';')) {
                trimmedStmt += ';';
            }

            // Normalizar tipos según dialecto
            if (/CREATE\s+TABLE/i.test(trimmedStmt)) {
                trimmedStmt = this.normalizeDataTypes(trimmedStmt, dialect);
            }

            newText += trimmedStmt + '\n';
        });

        return newText;
    }

    /**
     * Normaliza los tipos de datos según el dialecto SQL
     */
    private static normalizeDataTypes(stmt: string, dialect: SqlDialect): string {
        if (dialect === SqlDialect.POSTGRESQL) {
            return stmt
                .replace(/\bINTEGER\s+AUTO_INCREMENT\b/gi, 'SERIAL')
                .replace(/\bINT\s+AUTO_INCREMENT\b/gi, 'SERIAL')
                .replace(/\bVARCHAR\b(?!\s*\()/gi, 'VARCHAR(255)');
        } else if (dialect === SqlDialect.MYSQL) {
            return stmt
                .replace(/\bSERIAL\b/gi, 'INT AUTO_INCREMENT')
                .replace(/\bBIGSERIAL\b/gi, 'BIGINT AUTO_INCREMENT')
                .replace(/\bVARCHAR\b(?!\s*\()/gi, 'VARCHAR(255)');
        }
        return stmt;
    }

    /**
     * Muestra los detalles de un error detectado
     */
    private static showErrorDetails(error: SqlError): void {
        const message = `
📋 ${error.type}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${error.description}

💡 Suggested fix:
${error.suggestion}
        `.trim();
        vscode.window.showInformationMessage(message, { modal: true });
        logInfo(`Detected SQL error: ${error.type}`);
    }

    /**
     * Publica diagnósticos en el panel de problemas
     */
    private static publishDiagnostics(document: vscode.TextDocument, result: SqlAnalysisResult, dialect: SqlDialect): void {
        if (!diagnosticCollection) {
            diagnosticCollection = vscode.languages.createDiagnosticCollection('sql-helper');
        }

        const allIssues = [...result.errors, ...result.warnings];
        const diagnostics: vscode.Diagnostic[] = allIssues.map(error => {
            const lineNum = (error.line ?? 1) - 1;
            const line = document.lineAt(Math.min(lineNum, document.lineCount - 1));
            const range = new vscode.Range(
                new vscode.Position(line.lineNumber, 0),
                new vscode.Position(line.lineNumber, line.text.length)
            );

            const severity = error.severity === 'error' ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
            const diagnostic = new vscode.Diagnostic(
                range,
                `[${dialect.toUpperCase()}] ${error.type}: ${error.description}`,
                severity
            );
            diagnostic.code = 'sql-helper';
            diagnostic.source = 'SQL Helper';
            return diagnostic;
        });

        diagnosticCollection.set(document.uri, diagnostics);
        logInfo(`Published ${diagnostics.length} ${dialect.toUpperCase()} SQL issues to the Problems panel`);
    }

    /**
     * Limpia los diagnósticos de un archivo
     */
    private static clearDiagnostics(uri: vscode.Uri): void {
        if (diagnosticCollection) {
            diagnosticCollection.delete(uri);
        }
    }
}
