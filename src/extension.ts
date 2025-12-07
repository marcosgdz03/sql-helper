import * as vscode from 'vscode';
import { showSqlSnippets } from './snippets/sqlSnippets';
import { showJavaSnippets } from './snippets/javaSnippets';
import { showPythonSnippets } from './snippets/pythonSnippets';
import { showJsSnippets } from './snippets/jsSnippets';
import { 
    getActiveEditor, 
    detectLanguage, 
    pickSnippetType, 
    showError, 
    showInfo,
    logInfo,
    logError 
} from './utils/helpers';
import { MySqlHelper, formatSqlQuery } from './utils/mySqlHelper';

const EXTENSION_NAME = 'SQL Helper';

export function activate(context: vscode.ExtensionContext) {
    logInfo(`${EXTENSION_NAME} activado correctamente`);

    const disposable = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            // Obtener editor activo
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Detectar lenguaje automáticamente
            let mode = detectLanguage(editor);

            // Si no se detecta, preguntar al usuario
            if (!mode) {
                mode = await pickSnippetType();
                if (!mode) {
                    return;
                }
            }

            logInfo(`Modo seleccionado: ${mode}`);

            // Mostrar snippets según el lenguaje
            switch (mode) {
                case 'sql':
                    await showSqlSnippets(editor);
                    break;
                case 'java':
                    await showJavaSnippets(editor);
                    break;
                case 'python':
                    await showPythonSnippets(editor);
                    break;
                case 'javascript':
                    await showJsSnippets(editor);
                    break;
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error en ${EXTENSION_NAME}: ${errorMessage}`);
            showError(`Error inesperado. Revisa la consola para más detalles.`);
        }
    });

    context.subscriptions.push(disposable);

    // Comando para analizar errores SQL
    const analyzeSqlCommand = vscode.commands.registerCommand('sql-helper.analyzeSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Verificar que sea un archivo compatible (SQL, Java, JS, Python)
            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('Este comando funciona con: SQL, Java, JavaScript, TypeScript y Python');
                return;
            }

            logInfo('Analizando SQL para errores...');
            await MySqlHelper.analyzeSql(editor);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error analizando SQL: ${errorMessage}`);
            showError('Error al analizar SQL');
        }
    });

    // Comando para formatear SQL
    const formatSqlCommand = vscode.commands.registerCommand('sql-helper.formatSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Verificar que sea un archivo compatible (SQL, Java, JS, Python)
            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('Este comando funciona con: SQL, Java, JavaScript, TypeScript y Python');
                return;
            }

            logInfo('Formateando SQL...');
            await formatSqlQuery(editor);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error formateando SQL: ${errorMessage}`);
            showError('Error al formatear SQL');
        }
    });

    context.subscriptions.push(analyzeSqlCommand);
    context.subscriptions.push(formatSqlCommand);
}

export function deactivate() {
    logInfo(`${EXTENSION_NAME} desactivado`);
}
