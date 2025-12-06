import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function showPythonSnippets(editor: vscode.TextEditor) {
    const pyItems = [
        {
            label: 'Crear fichero conexión SQLite',
            snippet:
`import sqlite3

def get_connection():
    conn = sqlite3.connect("\${1:database}.db")
    return conn`
        },
        {
            label: 'Crear fichero conexión PostgreSQL',
            snippet:
`import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`
        },
        {
            label: 'Crear fichero conexión MySQL',
            snippet:
`import mysql.connector

def get_connection():
    conn = mysql.connector.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`
        },
        {
            label: 'Script init.sql',
            snippet:
`-- Script de inicialización de base de datos
CREATE TABLE IF NOT EXISTS ejemplo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);`
        },
        {
            label: 'Script seed.sql',
            snippet:
`-- Datos iniciales
INSERT INTO ejemplo (nombre) VALUES ('dato1'), ('dato2');`
        },
        {
            label: 'Clase DAO Python',
            snippet:
`class \${1:Entidad}DAO:
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
        self.conn.commit()`
        },
        {
            label: 'Context manager + manejo de errores',
            snippet:
`try:
    with get_connection() as conn:
        cursor = conn.cursor()
        # ejecutar consultas
except Exception as e:
    print("Error:", e)`
        },
        {
            label: 'Logging básico',
            snippet:
`import logging

logging.basicConfig(level=logging.INFO)
logging.info("Mensaje informativo")
logging.error("Mensaje de error")`
        },
        {
            label: 'SELECT simple',
            snippet:
`cursor.execute("SELECT * FROM \${1:tabla}")
rows = cursor.fetchall()
for row in rows:
    print(row)`
        },
        {
            label: 'INSERT simple',
            snippet:
`cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    (\${4:val1}, \${5:val2})
)
conn.commit()`
        },
        {
            label: 'UPDATE simple',
            snippet:
`cursor.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    (\${3:nuevoValor}, \${4:id})
)
conn.commit()`
        },
        {
            label: 'DELETE simple',
            snippet:
`cursor.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    (\${2:id},)
)
conn.commit()`
        }
    ];

    const pick = await vscode.window.showQuickPick(
        pyItems.map(i => ({ label: i.label, detail: i.snippet })),
        { placeHolder: 'Snippet Python DB / Crear ficheros' }
    );

    if (!pick) return;

    // Ficheros que se crean en el proyecto
    const filesToCreate = [
        'Crear fichero conexión SQLite',
        'Crear fichero conexión PostgreSQL',
        'Crear fichero conexión MySQL',
        'Script init.sql',
        'Script seed.sql'
    ];

    if (filesToCreate.includes(pick.label)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case 'Crear fichero conexión SQLite': fileName = 'sqlite_connection.py'; break;
            case 'Crear fichero conexión PostgreSQL': fileName = 'postgres_connection.py'; break;
            case 'Crear fichero conexión MySQL': fileName = 'mysql_connection.py'; break;
            case 'Script init.sql': fileName = 'init.sql'; break;
            case 'Script seed.sql': fileName = 'seed.sql'; break;
        }

        const filePath = path.join(folderPath, fileName);

        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${fileName} ya existe.`);
            return;
        }

        fs.writeFileSync(filePath, pick.detail!, 'utf8');
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
        return;
    }

    // Insertar snippet normal en el editor activo
    await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
}
