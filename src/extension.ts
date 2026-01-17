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
    logError
} from './utils/helpers';

import { SqlHelper } from './utils/sqlHelpers';
import { CommandManager, Validator, Logger, Config } from './core';
import { SqlDialect } from './types';

const EXTENSION_NAME = 'SQL Helper';

export function activate(context: vscode.ExtensionContext) {
    // Inicializar logger y configuración
    Logger.initialize(EXTENSION_NAME);
    Config.reload();
    Logger.info(`${EXTENSION_NAME} activated`);

    const commandManager = new CommandManager();

    // Comando: Insertar Snippet
    commandManager.registerCommand({
        id: 'sql-helper.insertSnippet',
        title: 'SQL Helper: Insert snippet',
        handler: async () => {
            const editor = getActiveEditor();
            if (!editor) {
                return;
            }

            let mode = detectLanguage(editor);
            if (!mode) {
                mode = await pickSnippetType();
                if (!mode) {
                    return;
                }
            }

            Logger.info(`Selected snippet type: ${mode}`);

            const snippetHandlers: Record<string, (editor: vscode.TextEditor) => Promise<void>> = {
                'sql': showSqlSnippets,
                'java': showJavaSnippets,
                'python': showPythonSnippets,
                'javascript': showJsSnippets
            };

            const handler = snippetHandlers[mode];
            if (handler) {
                await handler(editor);
            } else {
                showError(`Unsupported language: ${mode}`);
            }
        }
    }, context);

    // Comando: Analizar SQL
    commandManager.registerCommand({
        id: 'sql-helper.analyzeSql',
        title: 'SQL Helper: Analyze SQL',
        handler: async () => {
            const editor = Validator.requireActiveEditor();
            if (!editor) {
                return;
            }

            if (!Validator.isSqlLanguage(editor.document.languageId)) {
                showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            const choice = await vscode.window.showQuickPick(
                ['MySQL', 'PostgreSQL'],
                { placeHolder: 'Select SQL dialect' }
            );
            if (!choice) {
                return;
            }

            Logger.info(`Analyzing SQL: ${choice}`);

            const dialect = Validator.parseSqlDialect(choice);
            if (dialect) {
                await SqlHelper.analyzeSql(editor, dialect);
            }
        }
    }, context);

    // Comando: Formatear SQL
    commandManager.registerCommand({
        id: 'sql-helper.formatSql',
        title: 'SQL Helper: Format SQL',
        handler: async () => {
            const editor = Validator.requireActiveEditor();
            if (!editor) {
                return;
            }

            if (!Validator.isSqlLanguage(editor.document.languageId)) {
                showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            const choice = await vscode.window.showQuickPick(
                ['MySQL', 'PostgreSQL'],
                { placeHolder: 'Select SQL dialect' }
            );
            if (!choice) {
                return;
            }

            Logger.info(`Formatting SQL: ${choice}`);

            const dialect = Validator.parseSqlDialect(choice);
            if (dialect) {
                await SqlHelper.formatSql(editor, dialect);
            }
        }
    }, context);

    // Comando: Auto-fix SQL
    commandManager.registerCommand({
        id: 'sql-helper.autoFix',
        title: 'SQL Helper: Auto-fix SQL',
        handler: async () => {
            const editor = Validator.requireActiveEditor();
            if (!editor) {
                return;
            }

            if (!Validator.isSqlLanguage(editor.document.languageId)) {
                showError('Works with SQL, Java, JavaScript, TypeScript and Python');
                return;
            }

            const choice = await vscode.window.showQuickPick(
                ['MySQL', 'PostgreSQL'],
                { placeHolder: 'Select SQL dialect' }
            );
            if (!choice) {
                return;
            }

            Logger.info(`Applying auto-fix: ${choice}`);

            const dialect = Validator.parseSqlDialect(choice);
            if (dialect) {
                await SqlHelper.applyAutoFix(editor, dialect);
            }
        }
    }, context);

    // Comando: Generar Proyecto
    commandManager.registerCommand({
        id: 'sql-helper.generateProject',
        title: 'SQL Helper: Generate project',
        handler: async () => {
            Logger.info('Launching project generator...');
            await showProjectGenerator();
        }
    }, context);
}

export function deactivate() {
    Logger.info(`${EXTENSION_NAME} deactivated`);
}
