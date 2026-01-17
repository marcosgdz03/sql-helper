/**
 * Tipos compartidos para SQL Helper
 */

/**
 * Idiomas soportados por la extensión
 */
export enum LanguageMode {
    SQL = 'sql',
    JAVA = 'java',
    PYTHON = 'python',
    JAVASCRIPT = 'javascript',
    TYPESCRIPT = 'typescript'
}

/**
 * Dialecto de SQL soportados
 */
export enum SqlDialect {
    MYSQL = 'mysql',
    POSTGRESQL = 'postgresql'
}

/**
 * Item de snippet básico
 */
export interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
    category?: string;
}

/**
 * Item de snippet para QuickPick
 */
export interface SnippetPickItem {
    label: string;
    detail: string;
    snippet: string;
    category?: string;
}

/**
 * Error detectado en SQL
 */
export interface SqlError {
    type: string;
    description: string;
    suggestion: string;
    line?: number;
    severity?: 'error' | 'warning' | 'info';
}

/**
 * Resultado de análisis de SQL
 */
export interface SqlAnalysisResult {
    errors: SqlError[];
    warnings: SqlError[];
    isValid: boolean;
}
