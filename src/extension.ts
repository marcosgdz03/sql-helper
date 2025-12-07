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
}

export function deactivate() {
    logInfo(`${EXTENSION_NAME} desactivado`);
}
