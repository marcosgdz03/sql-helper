import * as vscode from 'vscode';

const OUTPUT_CHANNEL = vscode.window.createOutputChannel('SQL Helper');

/**
 * Registra un mensaje de información en el canal de salida.
 */
export function logInfo(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    OUTPUT_CHANNEL.appendLine(`[${timestamp}] INFO: ${message}`);
}

/**
 * Registra un mensaje de error en el canal de salida.
 */
export function logError(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    OUTPUT_CHANNEL.appendLine(`[${timestamp}] ERROR: ${message}`);
}

/**
 * Obtiene el editor activo o muestra un mensaje si no hay ninguno abierto.
 */
export function getActiveEditor(): vscode.TextEditor | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage(
            'Abre un archivo .java, .sql, .py o .js/.ts para usar esta extensión'
        );
        return undefined;
    }
    return editor;
}

/**
 * Detecta el tipo de snippet según el lenguaje del archivo.
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
 * Muestra un selector de snippet si no se pudo detectar automáticamente el lenguaje.
 */
export async function pickSnippetType(): Promise<'sql' | 'java' | 'python' | 'javascript' | undefined> {
    const pick = await vscode.window.showQuickPick(
        [
            { label: '📊 Snippets SQL', mode: 'sql' as const, detail: 'SELECT, INSERT, CREATE TABLE, etc.' },
            { label: '☕ Métodos Java JDBC', mode: 'java' as const, detail: 'Conexión, CRUD, Transacciones' },
            { label: '🐍 Snippets Python (DB)', mode: 'python' as const, detail: 'SQLite, MySQL, SQLAlchemy' },
            { label: '📜 Snippets JavaScript (DB)', mode: 'javascript' as const, detail: 'MySQL, PostgreSQL, Sequelize' }
        ],
        { 
            placeHolder: 'Selecciona el tipo de snippet',
            matchOnDetail: true
        }
    );

    if (!pick) {
        return undefined;
    }
    return pick.mode;
}

/**
 * Muestra un mensaje de error unificado.
 */
export function showError(message: string): void {
    vscode.window.showErrorMessage(`SQL Helper: ${message}`);
}

/**
 * Muestra un mensaje de información unificado.
 */
export function showInfo(message: string): void {
    vscode.window.showInformationMessage(`SQL Helper: ${message}`);
}

/**
 * Obtiene el lenguaje de un editor y lo devuelve en formato legible.
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
