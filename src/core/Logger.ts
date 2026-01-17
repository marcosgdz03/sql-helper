import * as vscode from 'vscode';

/**
 * Niveles de log soportados
 */
export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

/**
 * Gestor centralizado de logs con niveles configurables
 */
export class Logger {
    private static outputChannel: vscode.OutputChannel | null = null;
    private static logLevel: LogLevel = LogLevel.INFO;

    /**
     * Inicializa el canal de salida
     */
    static initialize(channelName: string = 'SQL Helper'): void {
        if (!this.outputChannel) {
            this.outputChannel = vscode.window.createOutputChannel(channelName);
        }
    }

    /**
     * Establece el nivel de log
     */
    static setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    /**
     * Registra un error
     */
    static error(message: string, error?: Error): void {
        this.log(LogLevel.ERROR, message, error);
    }

    /**
     * Registra una advertencia
     */
    static warn(message: string): void {
        this.log(LogLevel.WARN, message);
    }

    /**
     * Registra información
     */
    static info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    /**
     * Registra información de depuración
     */
    static debug(message: string): void {
        this.log(LogLevel.DEBUG, message);
    }

    /**
     * Método interno para registrar logs
     */
    private static log(level: LogLevel, message: string, error?: Error): void {
        if (!this.shouldLog(level)) {
            return;
        }

        const timestamp = new Date().toLocaleTimeString();
        const fullMessage = `[${timestamp}] [${level}] ${message}`;

        this.outputChannel?.appendLine(fullMessage);

        if (error) {
            this.outputChannel?.appendLine(`Stack: ${error.stack}`);
        }

        // También mostrar en consola para debugging
        if (level === LogLevel.ERROR) {
            console.error(fullMessage, error);
        } else {
            console.log(fullMessage);
        }
    }

    /**
     * Determina si debe registrarse un nivel de log
     */
    private static shouldLog(level: LogLevel): boolean {
        const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
        const currentIndex = levels.indexOf(this.logLevel);
        const targetIndex = levels.indexOf(level);
        return targetIndex <= currentIndex;
    }

    /**
     * Muestra el canal de output
     */
    static show(): void {
        this.outputChannel?.show();
    }
}
