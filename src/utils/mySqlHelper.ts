import * as vscode from 'vscode';
import { logInfo, logError } from './helpers';

/**
 * Interface for detected SQL errors
 */
interface SqlError {
    type: string;
    description: string;
    suggestion: string;
    line?: number;
}

// DiagnosticCollection to show issues in the Problems panel
let diagnosticCollection: vscode.DiagnosticCollection | null = null;

/**
 * SQL syntax analyzer for MySQL/PostgreSQL
 * Works on .sql, .java, .js, .py files
 */
export class MySqlHelper {
    /**
     * Analyzes selected text or the entire document for common SQL issues
     * Extracts SQL strings from code (Java, JavaScript, Python)
     */
    static async analyzeSql(editor: vscode.TextEditor): Promise<void> {
        const document = editor.document;
        const langId = document.languageId;
        let text = document.getText();

        // Extraer SQL de strings en código
        if (langId === 'java' || langId === 'javascript' || langId === 'typescript' || langId === 'python') {
            text = this.extractSqlFromCode(text, langId);
        }

        if (!text || text.trim().length === 0) {
            vscode.window.showWarningMessage('No SQL queries found in the file');
            logInfo('SQL analysis: no SQL queries found');
            return;
        }

        const errors = this.detectErrors(text);

        if (errors.length === 0) {
            vscode.window.showInformationMessage('✅ No common SQL issues detected');
            logInfo('SQL analysis: no errors detected');
            // Limpiar diagnosticos previos
            this.clearDiagnostics(document.uri);
            return;
        }

        // Mostrar errores en el panel Problems (Diagnostics)
        this.publishDiagnostics(document, errors);

        // También mostrar errores en una ventana rápida
        const errorItems = errors.map((err, idx) => ({
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

    /**
     * Extracts SQL strings from code (Java, JavaScript, Python)
     */
    private static extractSqlFromCode(code: string, language: string): string {
        const sqlQueries: string[] = [];

        if (language === 'java') {
            // Buscar strings entre comillas en Java
            // Soporta: String sql = "SELECT ..."
            // y: "SELECT..."
            const javaStringRegex = /["']([^"']*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)[^"']*)['"]/gi;
            let match;
            while ((match = javaStringRegex.exec(code)) !== null) {
                sqlQueries.push(match[1]);
            }
        } else if (language === 'javascript' || language === 'typescript') {
            // Buscar template literals y strings en JavaScript
            // Soporta: `SELECT ...`, 'SELECT ...', "SELECT ..."
            const jsStringRegex = /[`'"]([^`'"]*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)[^`'"]*)[`'"]/gi;
            let match;
            while ((match = jsStringRegex.exec(code)) !== null) {
                sqlQueries.push(match[1]);
            }
        } else if (language === 'python') {
            // Buscar strings en Python
            // Soporta: """SELECT ...""", 'SELECT ...', "SELECT ..."
            const pythonStringRegex = /['"]{1,3}([^'"]*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)[^'"]*)['"]{1,3}/gi;
            let match;
            while ((match = pythonStringRegex.exec(code)) !== null) {
                sqlQueries.push(match[1]);
            }
        }

        // Combinar todas las consultas encontradas
        return sqlQueries.join('\n');
    }

    /**
     * Detects common SQL errors
     */
    private static detectErrors(text: string): SqlError[] {
        const errors: SqlError[] = [];
        const lines = text.split('\n');

        lines.forEach((line, idx) => {
            // Saltar comentarios y líneas vacías
            if (line.trim().startsWith('--') || line.trim() === '') {
                return;
            }

            // 1. Detectar falta de punto y coma al final
            if (this.isQueryLine(line) && !line.trim().endsWith(';') && !line.trim().endsWith(',')) {
                errors.push({
                    type: 'Missing semicolon',
                    description: `Line ${idx + 1}: "${line.trim()}"`,
                    suggestion: 'SQL statements should end with ;',
                    line: idx + 1
                });
            }

            // 2. Detectar comillas sin cerrar
            if ((line.match(/'/g) || []).length % 2 !== 0) {
                errors.push({
                    type: 'Unclosed quote',
                    description: `Line ${idx + 1}: ${line.trim()}`,
                    suggestion: 'Ensure all single quotes are balanced',
                    line: idx + 1
                });
            }

            // 3. Detectar paréntesis sin cerrar
            const openParen = (line.match(/\(/g) || []).length;
            const closeParen = (line.match(/\)/g) || []).length;
            if (openParen !== closeParen) {
                errors.push({
                    type: 'Unbalanced parentheses',
                    description: `Line ${idx + 1}: ${line.trim()}`,
                    suggestion: `Open: ${openParen}, Close: ${closeParen}. Ensure parentheses are balanced`,
                    line: idx + 1
                });
            }

            // 4. Detectar SELECT sin FROM (en la mayoría de casos)
            if (line.toUpperCase().includes('SELECT') && 
                !line.toUpperCase().includes('FROM') && 
                !line.trim().startsWith('--')) {
                const selectMatch = line.match(/SELECT\s+/i);
                if (selectMatch) {
                    const afterSelect = line.substring(selectMatch.index! + selectMatch[0].length).trim();
                    // Permitir SELECT COUNT(*), NOW(), etc. sin FROM
                    if (!afterSelect.match(/COUNT\s*\(|NOW\s*\(|CURDATE\s*\(/i)) {
                        errors.push({
                            type: 'SELECT without FROM',
                            description: `Line ${idx + 1}: ${line.trim()}`,
                            suggestion: 'Most SELECT queries require a FROM clause. E.g.: SELECT * FROM table',
                            line: idx + 1
                        });
                    }
                }
            }

            // 5. Detectar INSERT sin VALUES
            if (line.toUpperCase().includes('INSERT INTO') && !line.toUpperCase().includes('VALUES')) {
                errors.push({
                    type: 'INSERT without VALUES',
                    description: `Line ${idx + 1}: ${line.trim()}`,
                    suggestion: 'INSERT INTO table (columns) VALUES (values);',
                    line: idx + 1
                });
            }

            // 6. Detectar UPDATE sin WHERE (advertencia)
            if (line.toUpperCase().includes('UPDATE') && !line.toUpperCase().includes('WHERE')) {
                errors.push({
                    type: '⚠️ UPDATE without WHERE',
                    description: `Line ${idx + 1}: ${line.trim()}`,
                    suggestion: 'UPDATE without WHERE will affect ALL rows. E.g.: UPDATE table SET col=val WHERE condition;',
                    line: idx + 1
                });
            }

            // 7. Detectar DELETE sin WHERE (advertencia crítica)
            if (line.toUpperCase().includes('DELETE FROM') && !line.toUpperCase().includes('WHERE')) {
                errors.push({
                    type: '🔴 DELETE without WHERE',
                    description: `Line ${idx + 1}: ${line.trim()}`,
                    suggestion: 'DELETE without WHERE will REMOVE ALL ROWS. E.g.: DELETE FROM table WHERE condition;',
                    line: idx + 1
                });
            }

            // 8. Detectar reservadas sin escape (palabras clave como nombres de columna)
            const reservedWords = ['select', 'from', 'where', 'order', 'group', 'having', 'limit', 'join', 'on'];
            reservedWords.forEach(word => {
                const regex = new RegExp(`(SELECT|FROM|WHERE|ORDER|GROUP|HAVING|LIMIT|JOIN|ON)\\s+${word}\\b`, 'i');
                if (regex.test(line)) {
                    errors.push({
                        type: 'Reserved word used as name',
                        description: `Line ${idx + 1}: "${word}" is a reserved SQL word`,
                        suggestion: `Use backticks to escape: \`${word}\` or rename the column`,
                        line: idx + 1
                    });
                }
            });
        });

        return errors;
    }

    /**
     * Determines if a line is an SQL statement
     */
    private static isQueryLine(line: string): boolean {
        const trimmed = line.trim().toUpperCase();
        return /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)/.test(trimmed);
    }

    /**
     * Shows error details in a modal window
     */
    private static showErrorDetails(error: SqlError): void {
        const message = `
📋 **${error.type}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${error.description}

💡 **Fix:**
${error.suggestion}

**More information:**
- Ensure the syntax is correct
- Verify all operators and delimiters
- Consult your DB documentation if needed
        `.trim();

        vscode.window.showInformationMessage(message, { modal: true });
        logInfo(`Detected SQL error: ${error.type}`);
    }

    /**
     * Returns an automatic fix suggestion for detected errors
     */
    static async getAutoFix(editor: vscode.TextEditor, text: string): Promise<string | null> {
        const errors = this.detectErrors(text);
        if (errors.length === 0) {
            return null;
        }

        let fixed = text;

        errors.forEach(error => {
            if (error.type === 'Missing semicolon') {
                // Add semicolon at the end of statements
                fixed = fixed.replace(/(\w+)\s*$/, '$1;');
            }
            if (error.type === 'Unclosed quote') {
                // Try to close quotes
                fixed = fixed.replace(/([^\\])'([^']*)$/, "$1'$2'");
            }
        });

        return fixed !== text ? fixed : null;
    }

    /**
     * Publishes diagnostics to the Problems panel
     */
    private static publishDiagnostics(document: vscode.TextDocument, errors: SqlError[]): void {
        // Inicializar DiagnosticCollection si no existe
        if (!diagnosticCollection) {
            diagnosticCollection = vscode.languages.createDiagnosticCollection('sql-helper');
        }

        const diagnostics: vscode.Diagnostic[] = errors.map(error => {
            // Encontrar la línea del error (si se especifica) o usar línea 0
            const lineNum = (error.line ?? 1) - 1;
            const line = document.lineAt(Math.min(lineNum, document.lineCount - 1));
            const range = new vscode.Range(
                new vscode.Position(line.lineNumber, 0),
                new vscode.Position(line.lineNumber, line.text.length)
            );

            const diagnostic = new vscode.Diagnostic(
                range,
                `[SQL] ${error.type}: ${error.description}`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = 'sql-helper';
            diagnostic.source = 'SQL Helper';

            return diagnostic;
        });

        diagnosticCollection.set(document.uri, diagnostics);
        logInfo(`Published ${diagnostics.length} SQL issues to the Problems panel`);
    }

    /**
     * Clears diagnostics for a document
     */
    private static clearDiagnostics(uri: vscode.Uri): void {
        if (diagnosticCollection) {
            diagnosticCollection.delete(uri);
        }
    }
}

/**
 * Formatea una consulta SQL para mejorar legibilidad
 */
export async function formatSqlQuery(editor: vscode.TextEditor): Promise<void> {
    const document = editor.document;
    const selection = editor.selection;
    const text = selection.isEmpty ? document.getText() : document.getText(selection);

    const formatted = formatSql(text);

    if (selection.isEmpty) {
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, formatted);
        });
    } else {
        await editor.edit(editBuilder => {
            editBuilder.replace(selection, formatted);
        });
    }

    logInfo('SQL query formatted');
    vscode.window.showInformationMessage('✅ SQL formatted successfully');
}

/**
 * Función auxiliar para formatear SQL
 */
function formatSql(sql: string): string {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];
    
    let formatted = sql;
    keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Limpiar espacios excesivos
    formatted = formatted
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

    return formatted;
}
