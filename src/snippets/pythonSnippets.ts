import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';

interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
}

export async function showPythonSnippets(editor: vscode.TextEditor) {
    const pyItems: SnippetItem[] = [
        {
            label: '📦 Conexión SQLite',
            snippet: `import sqlite3

def get_connection():
    conn = sqlite3.connect("\${1:database}.db")
    return conn`,
            description: 'Base de datos SQLite local'
        },
        {
            label: '🔵 Conexión PostgreSQL',
            snippet: `import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`,
            description: 'Conexión PostgreSQL'
        },
        {
            label: '🔶 Conexión MySQL',
            snippet: `import mysql.connector

def get_connection():
    conn = mysql.connector.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`,
            description: 'Conexión MySQL'
        },
        {
            label: '📄 Crear init.sql',
            snippet: `-- Script de inicialización de base de datos
CREATE TABLE IF NOT EXISTS ejemplo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);`,
            description: 'Crear tablas de prueba'
        },
        {
            label: '🌱 Crear seed.sql',
            snippet: `-- Datos iniciales
INSERT INTO ejemplo (nombre) VALUES ('dato1'), ('dato2');`,
            description: 'Insertar datos de prueba'
        },
        {
            label: '🏗️ Clase DAO',
            snippet: `class \${1:Entidad}DAO:
    def __init__(self, conn):
        self.conn = conn
        self.cursor = conn.cursor()

    def get_all(self):
        self.cursor.execute("SELECT * FROM \${2:tabla}")
        return self.cursor.fetchall()

    def insert(self, obj):
        self.cursor.execute(
            "INSERT INTO \${2:tabla} (\${3:col1}) VALUES (?)",
            (obj.\${4:campo},)
        )
        self.conn.commit()`,
            description: 'Patrón Data Access Object'
        },
        {
            label: '🎯 Context Manager',
            snippet: `try:
    with get_connection() as conn:
        cursor = conn.cursor()
        # ejecutar consultas
except Exception as e:
    print("Error:", e)`,
            description: 'Manejo seguro de conexiones'
        },
        {
            label: '📊 Logging',
            snippet: `import logging

logging.basicConfig(level=logging.INFO)
logging.info("Mensaje informativo")
logging.error("Mensaje de error")`,
            description: 'Sistema de logging'
        },
        {
            label: '👁️ SELECT simple',
            snippet: `cursor.execute("SELECT * FROM \${1:tabla}")
rows = cursor.fetchall()
for row in rows:
    print(row)`,
            description: 'Consulta SELECT'
        },
        {
            label: '➕ INSERT simple',
            snippet: `cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    (\${4:val1}, \${5:val2})
)
conn.commit()`,
            description: 'Insertar registro'
        },
        {
            label: '✏️ UPDATE simple',
            snippet: `cursor.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    (\${3:nuevoValor}, \${4:id})
)
conn.commit()`,
            description: 'Actualizar registro'
        },
        {
            label: '🗑️ DELETE simple',
            snippet: `cursor.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    (\${2:id},)
)
conn.commit()`,
            description: 'Eliminar registro'
        }
    ];

    const pick = await vscode.window.showQuickPick(
        pyItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 50) + '...',
            snippet: i.snippet
        })),
        { placeHolder: 'Snippet Python DB / Crear ficheros', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('Selección de snippet Python cancelada');
        return;
    }

    const filesToCreate = [
        'Conexión SQLite',
        'Conexión PostgreSQL',
        'Conexión MySQL',
        'init.sql',
        'seed.sql'
    ];

    if (filesToCreate.some(f => pick.label.includes(f))) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '📦 Conexión SQLite': { fileName = 'sqlite_connection.py'; break; }
            case '🔵 Conexión PostgreSQL': { fileName = 'postgres_connection.py'; break; }
            case '🔶 Conexión MySQL': { fileName = 'mysql_connection.py'; break; }
            case '📄 Crear init.sql': { fileName = 'init.sql'; break; }
            case '🌱 Crear seed.sql': { fileName = 'seed.sql'; break; }
            default: fileName = 'snippet.py';
        }

        const filePath = path.join(folderPath, fileName);

        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${fileName} ya existe.`);
            return;
        }

        try {
            fs.writeFileSync(filePath, pick.snippet, 'utf8');
            const doc = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(doc);
            logInfo(`Archivo ${fileName} creado`);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            logError(`Error creando archivo: ${errorMsg}`);
            vscode.window.showErrorMessage(`Error: ${errorMsg}`);
        }
        return;
    }

    try {
        await editor.insertSnippet(new vscode.SnippetString(pick.snippet));
        logInfo(`Snippet Python insertado: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error insertando snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}

