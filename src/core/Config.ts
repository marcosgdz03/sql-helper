import * as vscode from 'vscode';

/**
 * Configuración centralizada de la extensión
 */
export class Config {
    private static config: vscode.WorkspaceConfiguration | null = null;

    /**
     * Obtiene la configuración
     */
    private static getConfig(): vscode.WorkspaceConfiguration {
        if (!this.config) {
            this.config = vscode.workspace.getConfiguration('sqlHelper');
        }
        return this.config;
    }

    /**
     * Valida automáticamente al guardar
     */
    static get autoValidateOnSave(): boolean {
        return this.getConfig().get<boolean>('autoValidateOnSave', false);
    }

    /**
     * Formatear automáticamente al guardar
     */
    static get autoFormatOnSave(): boolean {
        return this.getConfig().get<boolean>('autoFormatOnSave', false);
    }

    /**
     * Dialecto SQL predeterminado
     */
    static get defaultSqlDialect(): string {
        return this.getConfig().get<string>('defaultSqlDialect', 'mysql');
    }

    /**
     * Mostrar diagnósticos en tiempo real
     */
    static get showRealtimeDiagnostics(): boolean {
        return this.getConfig().get<boolean>('showRealtimeDiagnostics', true);
    }

    /**
     * TTL del cache en milisegundos
     */
    static get cacheTtlMs(): number {
        return this.getConfig().get<number>('cacheTtlMs', 5 * 60 * 1000);
    }

    /**
     * Nivel de log
     */
    static get logLevel(): string {
        return this.getConfig().get<string>('logLevel', 'INFO');
    }

    /**
     * Obtiene un valor booleano personalizado
     */
    static getBoolean(key: string, defaultValue: boolean = false): boolean {
        return this.getConfig().get<boolean>(key, defaultValue);
    }

    /**
     * Obtiene un valor string personalizado
     */
    static getString(key: string, defaultValue: string = ''): string {
        return this.getConfig().get<string>(key, defaultValue);
    }

    /**
     * Obtiene un valor numérico personalizado
     */
    static getNumber(key: string, defaultValue: number = 0): number {
        return this.getConfig().get<number>(key, defaultValue);
    }

    /**
     * Recarga la configuración
     */
    static reload(): void {
        this.config = null;
    }
}
