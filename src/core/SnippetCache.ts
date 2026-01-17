/**
 * Gestiona el caché de snippets para mejorar rendimiento
 */
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

/**
 * Cache simple con expiración configurada
 */
export class SnippetCache<T> {
    private cache: Map<string, CacheEntry<T>> = new Map();
    private readonly ttl: number; // Time to live en milisegundos

    constructor(ttlMs: number = 5 * 60 * 1000) { // 5 minutos por defecto
        this.ttl = ttlMs;
    }

    /**
     * Obtiene un valor del cache
     */
    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry) {
            return undefined;
        }

        // Verificar si ha expirado
        const isExpired = Date.now() - entry.timestamp > this.ttl;
        if (isExpired) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.data;
    }

    /**
     * Almacena un valor en el cache
     */
    set(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Verifica si una clave existe y es válida
     */
    has(key: string): boolean {
        return this.get(key) !== undefined;
    }

    /**
     * Limpia una entrada del cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Limpia todo el cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Obtiene el tamaño del cache
     */
    size(): number {
        return this.cache.size;
    }
}
