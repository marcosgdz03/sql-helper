import * as vscode from 'vscode';

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
            { label: 'Snippets SQL', mode: 'sql' as const },
            { label: 'Métodos Java JDBC', mode: 'java' as const },
            { label: 'Snippets Python (DB)', mode: 'python' as const },
            { label: 'Snippets JavaScript (DB)', mode: 'javascript' as const }
        ],
        { placeHolder: 'Selecciona el tipo de snippet' }
    );

    if (!pick) { 
        return undefined; 
    }
    return pick.mode;
}

/**
 * Muestra un mensaje de error unificado.
 */
export function showError(message: string) {
    vscode.window.showErrorMessage(`SQL Helper: ${message}`);
}

/**
 * Muestra un mensaje de información unificado.
 */
export function showInfo(message: string) {
    vscode.window.showInformationMessage(`SQL Helper: ${message}`);
}
