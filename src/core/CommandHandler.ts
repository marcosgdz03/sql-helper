import * as vscode from 'vscode';
import { logInfo, logError, showError } from '../utils/helpers';

/**
 * Tipo para handler de comando
 */
export type CommandHandler = () => Promise<void>;

/**
 * Configuración de un comando
 */
export interface CommandConfig {
    id: string;
    title: string;
    handler: CommandHandler;
}

/**
 * Clase base para manejar comandos de forma centralizada
 * Elimina duplicación de try-catch y logging
 */
export class CommandManager {
    private commands: Map<string, vscode.Disposable> = new Map();

    /**
     * Registra un comando con manejo automático de errores
     */
    registerCommand(config: CommandConfig, context: vscode.ExtensionContext): void {
        const wrappedHandler = this.wrapHandler(config.id, config.handler);
        const disposable = vscode.commands.registerCommand(config.id, wrappedHandler);
        this.commands.set(config.id, disposable);
        context.subscriptions.push(disposable);
        logInfo(`Registered command: ${config.id}`);
    }

    /**
     * Envuelve un handler con manejo de errores y logging
     */
    private wrapHandler(commandId: string, handler: CommandHandler): CommandHandler {
        return async () => {
            try {
                logInfo(`Executing command: ${commandId}`);
                await handler();
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                logError(`${commandId} error: ${message}`);
                showError(`Error executing ${commandId}. Check the console for details.`);
            }
        };
    }

    /**
     * Obtiene un comando registrado
     */
    getCommand(id: string): vscode.Disposable | undefined {
        return this.commands.get(id);
    }

    /**
     * Limpia todos los comandos registrados
     */
    disposeAll(): void {
        this.commands.forEach(disposable => disposable.dispose());
        this.commands.clear();
    }
}
