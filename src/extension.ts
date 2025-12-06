import * as vscode from 'vscode';
import { showSqlSnippets } from './snippets/sqlSnippets';
import { showJavaSnippets } from './snippets/javaSnippets';
import { showPythonSnippets } from './snippets/pythonSnippets';
import { showJsSnippets } from './snippets/jsSnippets';
import { getActiveEditor, detectLanguage, pickSnippetType, showError } from './utils/helpers';

export function activate(context: vscode.ExtensionContext) {
    console.log('SQL Helper activado');

    const disposable = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('Abre un archivo .java, .sql, .py o .js para usar esta extensión');
                return;
            }

            const language = editor.document.languageId;
            let mode: 'sql' | 'java' | 'python' | 'javascript' | undefined;

            if (language === 'sql') { mode = 'sql'; }
            else if (language === 'java') { mode = 'java'; }
            else if (language === 'python') { mode = 'python'; }
            else if (language === 'javascript' || language === 'typescript') { mode = 'javascript'; }
            else {
                const pick = await vscode.window.showQuickPick(
                    [
                        { label: 'Snippets SQL', mode: 'sql' as const },
                        { label: 'Métodos Java JDBC', mode: 'java' as const },
                        { label: 'Snippets Python (DB)', mode: 'python' as const },
                        { label: 'Snippets JavaScript (DB)', mode: 'javascript' as const }
                    ],
                    { placeHolder: 'Selecciona el tipo de snippet' }
                );
                if (!pick) { return; }
                mode = pick.mode;
            }

            if (mode === 'sql') { await showSqlSnippets(editor); }
            else if (mode === 'java') { await showJavaSnippets(editor); }
            else if (mode === 'python') { await showPythonSnippets(editor); }
            else if (mode === 'javascript') { await showJsSnippets(editor); }

        } catch (err) {
            console.error('Error en la extensión:', err);
            vscode.window.showErrorMessage('Error en SQL Helper');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
