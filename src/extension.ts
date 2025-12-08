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
    logInfo(`${EXTENSION_NAME} activated`);

    const disposable = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            // Get active editor
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Detect language automatically
            let mode = detectLanguage(editor);

            // If not detected, ask the user
            if (!mode) {
                mode = await pickSnippetType();
                if (!mode) {
                    return;
                }
            }

            logInfo(`Selected mode: ${mode}`);

            // Show snippets by language
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
            logError(`Error in ${EXTENSION_NAME}: ${errorMessage}`);
            showError(`Unexpected error. Check the console for details.`);
        }
    });

    context.subscriptions.push(disposable);

    // Command to analyze SQL issues
    const analyzeSqlCommand = vscode.commands.registerCommand('sql-helper.analyzeSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Verify this is a supported file (SQL, Java, JS, Python)
            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('This command works with: SQL, Java, JavaScript, TypeScript and Python');
                return;
            }
            logInfo('Analyzing SQL for issues...');
            await MySqlHelper.analyzeSql(editor);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error analyzing SQL: ${errorMessage}`);
            showError('Error analyzing SQL');
        }
    });

    // Command to format SQL
    const formatSqlCommand = vscode.commands.registerCommand('sql-helper.formatSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            // Verify this is a supported file (SQL, Java, JS, Python)
            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('This command works with: SQL, Java, JavaScript, TypeScript and Python');
                return;
            }
            logInfo('Formatting SQL...');
            await formatSqlQuery(editor);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error formatting SQL: ${errorMessage}`);
            showError('Error formatting SQL');
        }
    });

    context.subscriptions.push(analyzeSqlCommand);
    context.subscriptions.push(formatSqlCommand);
}

export function deactivate() {
    logInfo(`${EXTENSION_NAME} deactivated`);
}
