import * as vscode from 'vscode';

const OUTPUT_CHANNEL = vscode.window.createOutputChannel('SQL Helper');

/**
 * Logs an informational message to the output channel.
 */
export function logInfo(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    OUTPUT_CHANNEL.appendLine(`[${timestamp}] INFO: ${message}`);
}

/**
 * Logs an error message to the output channel.
 */
export function logError(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    OUTPUT_CHANNEL.appendLine(`[${timestamp}] ERROR: ${message}`);
}

/**
 * Returns the active editor or shows a message if none is open.
 */
export function getActiveEditor(): vscode.TextEditor | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage(
            'Open a .java, .sql, .py or .js/.ts file to use this extension'
        );
        return undefined;
    }
    return editor;
}

/**
 * Detects the snippet type according to the file language.
 */
export function detectLanguage(editor: vscode.TextEditor): 'sql' | 'java' | 'python' | 'javascript' | undefined {
    const language = editor.document.languageId;
    if (language === 'sql') { return 'sql'; }
    if (language === 'java') { return 'java'; }
    if (language === 'python') { return 'python'; }
    if (language === 'javascript' || language === 'typescript') { return 'javascript'; }
    return undefined;
}

/**
 * Shows a snippet type picker if the language couldn't be detected automatically.
 */
export async function pickSnippetType(): Promise<'sql' | 'java' | 'python' | 'javascript' | undefined> {
    const pick = await vscode.window.showQuickPick(
        [
            { label: '📊 SQL Snippets', mode: 'sql' as const, detail: 'SELECT, INSERT, CREATE TABLE, etc.' },
            { label: '☕ Java JDBC Methods', mode: 'java' as const, detail: 'Connection, CRUD, Transactions' },
            { label: '🐍 Python Snippets (DB)', mode: 'python' as const, detail: 'SQLite, MySQL, SQLAlchemy' },
            { label: '📜 JavaScript Snippets (DB)', mode: 'javascript' as const, detail: 'MySQL, PostgreSQL, Sequelize' }
        ],
        {
            placeHolder: 'Select snippet type',
            matchOnDetail: true
        }
    );

    if (!pick) {
        return undefined;
    }
    return pick.mode;
}

/**
 * Shows a unified error message.
 */
export function showError(message: string): void {
    vscode.window.showErrorMessage(`SQL Helper: ${message}`);
}

/**
 * Shows a unified information message.
 */
export function showInfo(message: string): void {
    vscode.window.showInformationMessage(`SQL Helper: ${message}`);
}

/**
 * Returns a human-friendly name for a language identifier.
 */
export function getLanguageName(language: string): string {
    const languageMap: { [key: string]: string } = {
        'sql': 'SQL',
        'java': 'Java',
        'python': 'Python',
        'javascript': 'JavaScript',
        'typescript': 'TypeScript'
    };
    return languageMap[language] || language;
}
