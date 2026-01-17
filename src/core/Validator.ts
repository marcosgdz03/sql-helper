import * as vscode from 'vscode';
import { LanguageMode, SqlDialect } from '../types';

/**
 * Validador centralizado para las acciones de la extensión
 */
export class Validator {
    /**
     * Válida que haya un editor activo
     */
    static requireActiveEditor(): vscode.TextEditor | null {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage(
                'Open a .java, .sql, .py or .js/.ts file to use this extension'
            );
            return null;
        }
        return editor;
    }

    /**
     * Válida que el lenguaje sea soportado para SQL
     */
    static isSqlLanguage(languageId: string): boolean {
        return ['sql', 'java', 'javascript', 'typescript', 'python'].includes(languageId);
    }

    /**
     * Obtiene el dialecto desde un string
     */
    static parseSqlDialect(value: string): SqlDialect | null {
        const normalized = value.toLowerCase();
        if (normalized === 'mysql') {
            return SqlDialect.MYSQL;
        }
        if (normalized === 'postgresql' || normalized === 'postgres') {
            return SqlDialect.POSTGRESQL;
        }
        return null;
    }

    /**
     * Obtiene el modo de lenguaje desde un string
     */
    static parseLanguageMode(value: string): LanguageMode | null {
        const normalized = value.toLowerCase();
        for (const mode of Object.values(LanguageMode)) {
            if (normalized === mode) {
                return mode as LanguageMode;
            }
        }
        return null;
    }

    /**
     * Valida que el documento no esté vacío
     */
    static validateDocumentNotEmpty(text: string): boolean {
        return text.length > 0 && text.trim().length > 0;
    }

    /**
     * Cuenta las apariciones de un carácter
     */
    static countOccurrences(text: string, char: string): number {
        const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        return (text.match(regex) || []).length;
    }

    /**
     * Verifica que los paréntesis estén balanceados
     */
    static areParenthesesBalanced(text: string): boolean {
        const openCount = this.countOccurrences(text, '(');
        const closeCount = this.countOccurrences(text, ')');
        return openCount === closeCount;
    }

    /**
     * Verifica que las comillas estén balanceadas
     */
    static areQuotesBalanced(text: string): boolean {
        const singleQuotes = this.countOccurrences(text, "'");
        return singleQuotes % 2 === 0;
    }

    /**
     * Verifica que el texto sea un comando SQL válido
     */
    static isSqlStatement(text: string): boolean {
        const trimmed = text.trim().toUpperCase();
        const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TRUNCATE'];
        return sqlKeywords.some(keyword => trimmed.startsWith(keyword));
    }
}
