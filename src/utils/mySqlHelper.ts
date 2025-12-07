import * as vscode from 'vscode';
import { logInfo, logError } from './helpers';

/**
 * Interfaz para errores SQL detectados
 */
interface SqlError {
    type: string;
    description: string;
    suggestion: string;
    line?: number;
}

/**
 * Analizador de sintaxis SQL para MySQL, PostgreSQL
 * Funciona en archivos .sql, .java, .js, .python
 */
export class MySqlHelper {
    /**
     * Analiza el texto seleccionado o el documento completo buscando errores SQL comunes
     * Extrae strings SQL de código (Java, JavaScript, Python)
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
            vscode.window.showWarningMessage('No se encontraron consultas SQL en el archivo');
            logInfo('Análisis SQL: no se encontraron consultas SQL');
            return;
        }

        const errors = this.detectErrors(text);

        if (errors.length === 0) {
            vscode.window.showInformationMessage('✅ No se detectaron errores SQL comunes');
            logInfo('Análisis SQL: sin errores detectados');
            return;
        }

        // Mostrar errores en una ventana rápida
        const errorItems = errors.map((err, idx) => ({
            label: `$(error) ${err.type}`,
            detail: err.description,
            description: err.suggestion,
            error: err
        }));

        const selected = await vscode.window.showQuickPick(errorItems, {
            placeHolder: `Se encontraron ${errors.length} error(es) en SQL. Selecciona uno para ver la solución`
        });

        if (selected) {
            this.showErrorDetails(selected.error);
        }
    }

    /**
     * Extrae strings SQL de código (Java, JavaScript, Python)
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
     * Detecta errores comunes en SQL
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
                    type: 'Falta punto y coma',
                    description: `Línea ${idx + 1}: "${line.trim()}"`,
                    suggestion: 'Las sentencias SQL deben terminar con ;',
                    line: idx + 1
                });
            }

            // 2. Detectar comillas sin cerrar
            if ((line.match(/'/g) || []).length % 2 !== 0) {
                errors.push({
                    type: 'Comilla sin cerrar',
                    description: `Línea ${idx + 1}: ${line.trim()}`,
                    suggestion: 'Verifica que todas las comillas simples estén balanceadas',
                    line: idx + 1
                });
            }

            // 3. Detectar paréntesis sin cerrar
            const openParen = (line.match(/\(/g) || []).length;
            const closeParen = (line.match(/\)/g) || []).length;
            if (openParen !== closeParen) {
                errors.push({
                    type: 'Paréntesis desbalanceados',
                    description: `Línea ${idx + 1}: ${line.trim()}`,
                    suggestion: `Abre: ${openParen}, Cierra: ${closeParen}. Verifica que estén balanceados`,
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
                            type: 'SELECT sin FROM',
                            description: `Línea ${idx + 1}: ${line.trim()}`,
                            suggestion: 'La mayoría de SELECT requieren una cláusula FROM. Ej: SELECT * FROM tabla',
                            line: idx + 1
                        });
                    }
                }
            }

            // 5. Detectar INSERT sin VALUES
            if (line.toUpperCase().includes('INSERT INTO') && !line.toUpperCase().includes('VALUES')) {
                errors.push({
                    type: 'INSERT sin VALUES',
                    description: `Línea ${idx + 1}: ${line.trim()}`,
                    suggestion: 'INSERT INTO tabla (columnas) VALUES (valores);',
                    line: idx + 1
                });
            }

            // 6. Detectar UPDATE sin WHERE (advertencia)
            if (line.toUpperCase().includes('UPDATE') && !line.toUpperCase().includes('WHERE')) {
                errors.push({
                    type: '⚠️ UPDATE sin WHERE',
                    description: `Línea ${idx + 1}: ${line.trim()}`,
                    suggestion: 'UPDATE sin WHERE afectará TODAS las filas. Ej: UPDATE tabla SET col=val WHERE condicion;',
                    line: idx + 1
                });
            }

            // 7. Detectar DELETE sin WHERE (advertencia crítica)
            if (line.toUpperCase().includes('DELETE FROM') && !line.toUpperCase().includes('WHERE')) {
                errors.push({
                    type: '🔴 DELETE sin WHERE',
                    description: `Línea ${idx + 1}: ${line.trim()}`,
                    suggestion: 'DELETE sin WHERE ELIMINARÁ TODAS LAS FILAS. Ej: DELETE FROM tabla WHERE condicion;',
                    line: idx + 1
                });
            }

            // 8. Detectar reservadas sin escape (palabras clave como nombres de columna)
            const reservedWords = ['select', 'from', 'where', 'order', 'group', 'having', 'limit', 'join', 'on'];
            reservedWords.forEach(word => {
                const regex = new RegExp(`(SELECT|FROM|WHERE|ORDER|GROUP|HAVING|LIMIT|JOIN|ON)\\s+${word}\\b`, 'i');
                if (regex.test(line)) {
                    errors.push({
                        type: 'Palabra reservada como nombre',
                        description: `Línea ${idx + 1}: "${word}" es una palabra reservada de SQL`,
                        suggestion: `Usa backticks para escapar: \`${word}\` o renombra la columna`,
                        line: idx + 1
                    });
                }
            });
        });

        return errors;
    }

    /**
     * Determina si una línea es una sentencia SQL
     */
    private static isQueryLine(line: string): boolean {
        const trimmed = line.trim().toUpperCase();
        return /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)/.test(trimmed);
    }

    /**
     * Muestra detalles del error en una ventana
     */
    private static showErrorDetails(error: SqlError): void {
        const message = `
📋 **${error.type}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${error.description}

💡 **Solución:**
${error.suggestion}

**Más información:**
- Asegúrate de que la sintaxis sea correcta
- Verifica todos los operadores y delimitadores
- Consulta la documentación de MySQL si es necesario
        `.trim();

        vscode.window.showInformationMessage(message, { modal: true });
        logInfo(`Error SQL detectado: ${error.type}`);
    }

    /**
     * Obtiene sugerencias de corrección automática
     */
    static async getAutoFix(editor: vscode.TextEditor, text: string): Promise<string | null> {
        const errors = this.detectErrors(text);
        if (errors.length === 0) {
            return null;
        }

        let fixed = text;

        errors.forEach(error => {
            if (error.type === 'Falta punto y coma') {
                // Agregar punto y coma al final de sentencias
                fixed = fixed.replace(/(\w+)\s*$/, '$1;');
            }
            if (error.type === 'Comilla sin cerrar') {
                // Intenta cerrar comillas
                fixed = fixed.replace(/([^\\])'([^']*)$/, "$1'$2'");
            }
        });

        return fixed !== text ? fixed : null;
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

    logInfo('Consulta SQL formateada');
    vscode.window.showInformationMessage('✅ SQL formateado correctamente');
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
