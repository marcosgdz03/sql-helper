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
import { SqlHelper, SqlDialect } from './utils/sqlHelpers';

const EXTENSION_NAME = 'SQL Helper';

export function activate(context: vscode.ExtensionContext) {
    logInfo(`${EXTENSION_NAME} activated`);

    // -------------------------------
    // COMANDO PRINCIPAL: INSERTAR SNIPPET
    // -------------------------------
    const insertSnippetCommand = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) return;

            let mode = detectLanguage(editor);
            if (!mode) {
                mode = await pickSnippetType();
                if (!mode) return;
            }

            logInfo(`Selected mode: ${mode}`);

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
                default:
                    showError(`Unsupported language: ${mode}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error in ${EXTENSION_NAME}: ${errorMessage}`);
            showError(`Unexpected error. Check the console for details.`);
        }
    });

    // -------------------------------
    // COMANDO: ANALIZAR SQL
    // -------------------------------
    const analyzeSqlCommand = vscode.commands.registerCommand('sql-helper.analyzeSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) return;

            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('This command works with: SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            const choice = await vscode.window.showQuickPick(['MySQL', 'PostgreSQL'], { placeHolder: 'Select SQL dialect to analyze' });
            if (!choice) return;

            logInfo(`Analyzing SQL for ${choice}...`);

            const dialect: SqlDialect = choice.toLowerCase() as SqlDialect;
            await SqlHelper.analyzeSql(editor, dialect);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error analyzing SQL: ${errorMessage}`);
            showError('Error analyzing SQL');
        }
    });

    // -------------------------------
    // COMANDO: FORMATEAR SQL
    // -------------------------------
    // -------------------------------
    // COMANDO: FORMATEAR SQL
    // -------------------------------
    const formatSqlCommand = vscode.commands.registerCommand('sql-helper.formatSql', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) return;

            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('This command works with: SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            // Pide dialecto antes de formatear
            const choice = await vscode.window.showQuickPick(['MySQL', 'PostgreSQL'], { placeHolder: 'Select SQL dialect to format' });
            if (!choice) return;

            logInfo(`Formatting SQL for ${choice}...`);

            const dialect: SqlDialect = choice.toLowerCase() as SqlDialect;
            await SqlHelper.formatSql(editor, dialect);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error formatting SQL: ${errorMessage}`);
            showError('Error formatting SQL');
        }
    });


    // -------------------------------
    // COMANDO: AUTO-FIX SQL
    // -------------------------------
    const autoFixSqlCommand = vscode.commands.registerCommand('sql-helper.autoFix', async () => {
        try {
            const editor = getActiveEditor();
            if (!editor) return;

            const langId = editor.document.languageId;
            if (!['sql', 'java', 'javascript', 'typescript', 'python'].includes(langId)) {
                showError('This command works with: SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            const choice = await vscode.window.showQuickPick(['MySQL', 'PostgreSQL'], { placeHolder: 'Select SQL dialect to auto-fix' });
            if (!choice) return;

            logInfo(`Applying auto-fix for ${choice}...`);

            const dialect: SqlDialect = choice.toLowerCase() as SqlDialect;
            await SqlHelper.applyAutoFix(editor, dialect);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            logError(`Error applying auto-fix: ${errorMessage}`);
            showError('Error applying auto-fix');
        }
    });

    // -------------------------------
    // REGISTRAR COMANDOS
    // -------------------------------
    context.subscriptions.push(
        insertSnippetCommand,
        analyzeSqlCommand,
        formatSqlCommand,
        autoFixSqlCommand
    );
}

export function deactivate() {
    logInfo(`${EXTENSION_NAME} deactivated`);
}
