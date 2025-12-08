import * as vscode from 'vscode';

import { showSqlSnippets } from './snippets/sqlSnippets';
import { showJavaSnippets } from './snippets/javaSnippets';
import { showPythonSnippets } from './snippets/pythonSnippets';
import { showJsSnippets } from './snippets/jsSnippets';
import { showProjectGenerator } from './snippets/generatorSnippets';


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

    // =====================================================
    // 🔹 COMANDO: INSERTAR SNIPPET
    // =====================================================
    const insertSnippetCommand = vscode.commands.registerCommand(
        'sql-helper.insertSnippet',
        async () => {
            try {
                const editor = getActiveEditor();
                if (!editor) return;

                let mode = detectLanguage(editor);

                if (!mode) {
                    mode = await pickSnippetType();
                    if (!mode) return;
                }

                logInfo(`Selected snippet type: ${mode}`);

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
                const msg = err instanceof Error ? err.message : String(err);
                logError(`insertSnippet error: ${msg}`);
                showError('Unexpected error. Check the console for details.');
            }
        }
    );

    // =====================================================
    // 🔹 COMANDO: ANALIZAR SQL
    // =====================================================
    const analyzeSqlCommand = vscode.commands.registerCommand(
        'sql-helper.analyzeSql',
        async () => {
            try {
                const editor = getActiveEditor();
                if (!editor) return;

                const valid = ['sql', 'java', 'javascript', 'typescript', 'python'];

                if (!valid.includes(editor.document.languageId)) {
                    showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                    return;
                }

                const choice = await vscode.window.showQuickPick(
                    ['MySQL', 'PostgreSQL'],
                    { placeHolder: 'Select SQL dialect' }
                );
                if (!choice) return;

                logInfo(`Analyzing SQL: ${choice}`);

                const dialect = choice.toLowerCase() as SqlDialect;
                await SqlHelper.analyzeSql(editor, dialect);

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                logError(`analyzeSql error: ${msg}`);
                showError('Error analyzing SQL.');
            }
        }
    );

    // =====================================================
    // 🔹 COMANDO: FORMATEAR SQL
    // =====================================================
    const formatSqlCommand = vscode.commands.registerCommand(
        'sql-helper.formatSql',
        async () => {
            try {
                const editor = getActiveEditor();
                if (!editor) return;

                const valid = ['sql', 'java', 'javascript', 'typescript', 'python'];

                if (!valid.includes(editor.document.languageId)) {
                    showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                    return;
                }

                const choice = await vscode.window.showQuickPick(
                    ['MySQL', 'PostgreSQL'],
                    { placeHolder: 'Select SQL dialect' }
                );
                if (!choice) return;

                logInfo(`Formatting SQL: ${choice}`);

                const dialect = choice.toLowerCase() as SqlDialect;
                await SqlHelper.formatSql(editor, dialect);

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                logError(`formatSql error: ${msg}`);
                showError('Error formatting SQL.');
            }
        }
    );

    // =====================================================
    // 🔹 COMANDO: AUTO-FIX SQL
    // =====================================================
    const autoFixSqlCommand = vscode.commands.registerCommand(
        'sql-helper.autoFix',
        async () => {
            try {
                const editor = getActiveEditor();
                if (!editor) return;

                const valid = ['sql', 'java', 'javascript', 'typescript', 'python'];

                if (!valid.includes(editor.document.languageId)) {
                    showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                    return;
                }

                const choice = await vscode.window.showQuickPick(
                    ['MySQL', 'PostgreSQL'],
                    { placeHolder: 'Select SQL dialect' }
                );
                if (!choice) return;

                logInfo(`Applying auto-fix: ${choice}`);

                const dialect = choice.toLowerCase() as SqlDialect;
                await SqlHelper.applyAutoFix(editor, dialect);

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                logError(`autoFix error: ${msg}`);
                showError('Error applying auto-fix.');
            }
        }
    );

    // =====================================================
    // 🔹 COMANDO: GENERAR PROYECTO COMPLETO
    // =====================================================
    const generateProjectCommand = vscode.commands.registerCommand(
        'sql-helper.generateProject',
        async () => {
            try {
                logInfo('Launching project generator...');
                await showProjectGenerator();

            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                logError(`generateProject error: ${msg}`);
                showError('Error generating project.');
            }
        }
    );

    // =====================================================
    // 🔹 REGISTRO DE COMANDOS
    // =====================================================
    context.subscriptions.push(
        insertSnippetCommand,
        analyzeSqlCommand,
        formatSqlCommand,
        autoFixSqlCommand,
        generateProjectCommand
    );
}

export function deactivate() {
    logInfo(`${EXTENSION_NAME} deactivated`);
}
