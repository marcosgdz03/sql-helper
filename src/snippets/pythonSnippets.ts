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
            label: '📦 SQLite Connection',
            snippet: `import sqlite3

def get_connection():
    conn = sqlite3.connect("\${1:database}.db")
    return conn`,
            description: 'Local SQLite database'
        },
        {
            label: '🔵 PostgreSQL Connection',
            snippet: `import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`,
            description: 'PostgreSQL connection'
        },
        {
            label: '🔶 MySQL Connection',
            snippet: `import mysql.connector

def get_connection():
    conn = mysql.connector.connect(
        host="\${1:localhost}",
        database="\${2:database}",
        user="\${3:user}",
        password="\${4:password}"
    )
    return conn`,
            description: 'MySQL connection'
        },
        {
            label: '📄 Create init.sql',
            snippet: `-- Script de inicialización de base de datos
CREATE TABLE IF NOT EXISTS ejemplo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
);`,
            description: 'Create test tables'
        },
        {
            label: '🌱 Create seed.sql',
            snippet: `-- Datos iniciales
INSERT INTO ejemplo (nombre) VALUES ('dato1'), ('dato2');`,
            description: 'Insert test data'
        },
        {
            label: '🏗️ DAO Class',
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
            description: 'Data Access Object pattern'
        },
        {
            label: '🎯 Context Manager',
            snippet: `try:
    with get_connection() as conn:
        cursor = conn.cursor()
        # ejecutar consultas
except Exception as e:
    print("Error:", e)`,
            description: 'Safe connection handling'
        },
        {
            label: '📊 Logging',
            snippet: `import logging

logging.basicConfig(level=logging.INFO)
logging.info("Mensaje informativo")
logging.error("Mensaje de error")`,
            description: 'Logging setup'
        },
        {
            label: '👁️ Simple SELECT',
            snippet: `cursor.execute("SELECT * FROM \${1:tabla}")
rows = cursor.fetchall()
for row in rows:
    print(row)`,
            description: 'SELECT query'
        },
        {
            label: '➕ Simple INSERT',
            snippet: `cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    (\${4:val1}, \${5:val2})
)
conn.commit()`,
            description: 'Insert record'
        },
        {
            label: '✏️ Simple UPDATE',
            snippet: `cursor.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    (\${3:nuevoValor}, \${4:id})
)
conn.commit()`,
            description: 'Update record'
        },
        {
            label: '🗑️ Simple DELETE',
            snippet: `cursor.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    (\${2:id},)
)
conn.commit()`,
            description: 'Delete record'
        },
        {
            label: '🏗️ Generic DAO',
            snippet: `import logging

class \${1:Entity}DAO:
    def __init__(self, conn):
        self.conn = conn
        self.cursor = conn.cursor()

    def find_by_id(self, id):
        try:
            self.cursor.execute("SELECT * FROM \${2:table} WHERE id = %s", (id,))
            return self.cursor.fetchone()
        except Exception as e:
            logging.error("Error in find_by_id: %s", e)
            raise

    def find_all(self):
        try:
            self.cursor.execute("SELECT * FROM \${2:table}")
            return self.cursor.fetchall()
        except Exception as e:
            logging.error("Error in find_all: %s", e)
            raise

    def insert(self, obj):
        try:
            self.cursor.execute(
                "INSERT INTO \${2:table} (\${3:columns}) VALUES (\${4:placeholders})",
                (\${5:values},)
            )
            self.conn.commit()
            return self.cursor.lastrowid
        except Exception as e:
            self.conn.rollback()
            logging.error("Error in insert: %s", e)
            raise

    def update(self, id, obj):
        try:
            self.cursor.execute(
                "UPDATE \${2:table} SET \${3:set_clause} WHERE id = %s",
                (\${4:values}, id)
            )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            logging.error("Error in update: %s", e)
            raise

    def delete(self, id):
        try:
            self.cursor.execute(
                "DELETE FROM \${2:table} WHERE id = %s",
                (id,)
            )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            logging.error("Error in delete: %s", e)
            raise

    # Optional transaction example
    def transaction_example(self, obj):
        try:
            self.conn.begin()
            self.cursor.execute("INSERT INTO \${2:table} (\${3:columns}) VALUES (%s)", (obj.\${4:value},))
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            logging.error("Transaction failed: %s", e)
            raise`,
            description: 'Generic DAO with find_by_id, find_all, insert, update, delete, transaction and error handling'
        }

    ];

    // Mostrar QuickPick con detalle completo
    const pick = await vscode.window.showQuickPick(
        pyItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet,
            snippet: i.snippet
        })),
        { placeHolder: 'Python DB snippets / Create files', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('Python snippet selection cancelled');
        return;
    }

    // Determinar si se va a crear un archivo
    const filesToCreate = [
        'SQLite Connection',
        'PostgreSQL Connection',
        'MySQL Connection',
        'init.sql',
        'seed.sql'
    ];

    if (filesToCreate.some(f => pick.label.includes(f))) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Open a project folder first to create the file.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '📦 SQLite Connection': fileName = 'sqlite_connection.py'; break;
            case '🔵 PostgreSQL Connection': fileName = 'postgres_connection.py'; break;
            case '🔶 MySQL Connection': fileName = 'mysql_connection.py'; break;
            case '📄 Create init.sql': fileName = 'init.sql'; break;
            case '🌱 Create seed.sql': fileName = 'seed.sql'; break;
            default: fileName = 'snippet.py';
        }

        const filePath = path.join(folderPath, fileName);

        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${fileName} already exists.`);
            return;
        }

        try {
            fs.writeFileSync(filePath, pick.snippet, 'utf8');
            const doc = await vscode.workspace.openTextDocument(filePath);
            await vscode.window.showTextDocument(doc);
            logInfo(`File ${fileName} created`);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            logError(`Error creating file: ${errorMsg}`);
            vscode.window.showErrorMessage(`Error: ${errorMsg}`);
        }
        return;
    }

    // Insertar snippet en editor
    try {
        await editor.insertSnippet(new vscode.SnippetString(pick.snippet));
        logInfo(`Python snippet inserted: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error inserting snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
