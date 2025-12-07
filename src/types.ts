/**
 * Tipos compartidos para SQL Helper
 */

export interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
}

export interface SnippetPickItem {
    label: string;
    detail: string;
    snippet: string;
}

export type LanguageMode = 'sql' | 'java' | 'python' | 'javascript';
