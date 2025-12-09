import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { chooseDatabase } from "../utils/utils";
import { exec } from "child_process";

type DbType = "PostgreSQL" | "MySQL" | "SQLite";

export async function choosePythonFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Flask" },
        { label: "FastAPI" }
    ];

    const framework = await vscode.window.showQuickPick(frameworks, {
        placeHolder: "Choose a Python framework"
    });
    if (!framework) return;

    const db = await chooseDatabase();
    if (!db) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, framework.label.toLowerCase());
    fs.mkdirSync(projectPath, { recursive: true });

    await generatePythonProject(projectPath, framework.label, db as DbType);

    vscode.window.showInformationMessage(`Python project generated (${framework.label})`);
}

export async function generatePythonProject(
    projectPath: string,
    framework: string,
    db: DbType
): Promise<void> {
    const dbName = await vscode.window.showInputBox({
        placeHolder: "Enter database name",
        value: "mydb"
    });
    if (!dbName) return;

    const tablesInput = await vscode.window.showInputBox({
        placeHolder: "Enter table names separated by commas",
        value: "users,products"
    });
    if (!tablesInput) return;

    const tables = tablesInput.split(",").map(t => t.trim());

    // Generación del proyecto base
    if (framework === "Flask") {
        await createFlaskProject(projectPath, framework, db);
    } else if (framework === "FastAPI") {
        await createFastApiProject(projectPath, framework, db);
    }

    // Crear módulo de DB
    await createDbModule(projectPath, db, dbName, tables);

    vscode.window.showInformationMessage(
        `Python project ready with database ${dbName} and tables: ${tables.join(", ")}`
    );
}

async function createFlaskProject(folder: string, name: string, db: DbType) {
    fs.mkdirSync(path.join(folder, "app"), { recursive: true });

    const dbImports: Record<DbType, string> = {
        PostgreSQL: "import psycopg2",
        MySQL: "import mysql.connector",
        SQLite: "import sqlite3"
    };

    const appPy = `
from flask import Flask
from db import init_db
${dbImports[db]}

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask project '${name}' working!"

if __name__ == "__main__":
    init_db()  # Crea DB y tablas al iniciar
    app.run(debug=True)
`;

    fs.writeFileSync(path.join(folder, "app", "app.py"), appPy);
    fs.writeFileSync(path.join(folder, "app", "__init__.py"), "");

    fs.writeFileSync(
        path.join(folder, "requirements.txt"),
        `flask
${db === "PostgreSQL" ? "psycopg2" :
            db === "MySQL" ? "mysql-connector-python" :
                db === "SQLite" ? "aiosqlite" : ""}`
    );

    fs.writeFileSync(
        path.join(folder, "README.md"),
        `# Flask Project\n\nRun:\n\n\`\`\`bash\npip install -r requirements.txt\npython app/app.py\n\`\`\``
    );
}

async function createFastApiProject(folder: string, name: string, db: DbType) {
    fs.mkdirSync(path.join(folder, "app", "routers"), { recursive: true });

    const dbImports: Record<DbType, string> = {
        PostgreSQL: "import asyncpg",
        MySQL: "import aiomysql",
        SQLite: "import aiosqlite"
    };

    const mainPy = `
from fastapi import FastAPI
from db import init_db
${dbImports[db]}

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()  # Crea DB y tablas al iniciar

@app.get("/")
async def root():
    return {"message": "FastAPI project '${name}' working!"}
`;

    fs.writeFileSync(path.join(folder, "app", "main.py"), mainPy);
    fs.writeFileSync(path.join(folder, "app", "__init__.py"), "");

    fs.writeFileSync(
        path.join(folder, "requirements.txt"),
        `fastapi
uvicorn[standard]
${db === "PostgreSQL" ? "asyncpg" :
            db === "MySQL" ? "aiomysql" :
                db === "SQLite" ? "aiosqlite" : ""}`
    );

    fs.writeFileSync(
        path.join(folder, "README.md"),
        `# FastAPI Project

Run:

\`\`\`bash
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`
`
    );
}

// Crear módulo db.py con conexión y creación de tablas
async function createDbModule(projectPath: string, db: DbType, dbName: string, tables: string[]) {
    const dbFile = path.join(projectPath, "db.py");

    let code = "";
    if (db === "PostgreSQL") {
        code = `
import psycopg2
from psycopg2 import sql

def init_db():
    conn = psycopg2.connect(dbname='postgres', user='postgres', password='password', host='localhost')
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("CREATE DATABASE ${dbName}")
    conn.close()

    conn = psycopg2.connect(dbname='${dbName}', user='postgres', password='password', host='localhost')
    cur = conn.cursor()
    ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id SERIAL PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    conn.commit()
    conn.close()
`;
    } else if (db === "MySQL") {
        code = `
import mysql.connector

def init_db():
    conn = mysql.connector.connect(user='root', password='password', host='127.0.0.1')
    cur = conn.cursor()
    cur.execute("CREATE DATABASE IF NOT EXISTS ${dbName}")
    conn.database = '${dbName}'
    ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    conn.commit()
    conn.close()
`;
    } else {
        // SQLite
        code = `
import sqlite3

def init_db():
    conn = sqlite3.connect("${dbName}.sqlite")
    cur = conn.cursor()
    ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")`).join("\n    ")}
    conn.commit()
    conn.close()
`;
    }

    fs.writeFileSync(dbFile, code);
}
