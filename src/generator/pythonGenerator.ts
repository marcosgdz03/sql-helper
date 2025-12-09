import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { chooseDatabase } from "../utils/utils";

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

    const pyVersion = await vscode.window.showQuickPick(
        [{ label: "3.10" }, { label: "3.11" }, { label: "3.12" }],
        { placeHolder: "Choose Python version" }
    );
    if (!pyVersion) return;

    const db = await chooseDatabase();
    if (!db) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, framework.label.toLowerCase());
    fs.mkdirSync(projectPath, { recursive: true });

    await generatePythonProject(projectPath, framework.label, pyVersion.label, db as DbType);

    vscode.window.showInformationMessage(`Python project generated (${framework.label} with Python ${pyVersion.label})`);
}

export async function generatePythonProject(
    projectPath: string,
    framework: string,
    pyVersion: string,
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

    // Crear virtualenv
    exec(`python${pyVersion} -m venv ${path.join(projectPath, "venv")}`);

    // Generación del proyecto base
    if (framework === "Flask") {
        await createFlaskProject(projectPath, framework, db);
    } else if (framework === "FastAPI") {
        await createFastApiProject(projectPath, framework, db);
    }

    // Crear módulo de DB y CRUD
    await createDbModule(projectPath, db, dbName, tables);

    // Crear modelos y CRUD por tabla
    await createModelsAndCrud(projectPath, tables);

    // README
    fs.writeFileSync(
        path.join(projectPath, "README.md"),
        `# ${framework} Project

Python version: ${pyVersion}
Database: ${db} (${dbName})
Tables: ${tables.join(", ")}

## Setup

\`\`\`bash
cd ${projectPath}
source venv/bin/activate  # Activate virtualenv (Linux/Mac)
# .\\venv\\Scripts\\activate for Windows
pip install -r requirements.txt
\`\`\`

## Run

Flask:
\`\`\`bash
python app/app.py
\`\`\`

FastAPI:
\`\`\`bash
uvicorn app.main:app --reload
\`\`\`
`
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
from db.db import init_db
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
from db.db import init_db
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
}

// Crear módulo db.py con conexión y creación de tablas
async function createDbModule(projectPath: string, db: DbType, dbName: string, tables: string[]) {
    const dbFolder = path.join(projectPath, "db");
    fs.mkdirSync(dbFolder, { recursive: true });
    const dbFile = path.join(dbFolder, "db.py");

    let code = `import os\nfrom .config import DB_USER, DB_PASSWORD, DB_HOST\n`;
    if (db === "PostgreSQL") {
        code += `
import psycopg2
from psycopg2 import sql

def init_db():
    try:
        conn = psycopg2.connect(dbname='postgres', user=DB_USER, password=DB_PASSWORD, host=DB_HOST)
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("CREATE DATABASE ${dbName}")
        conn.close()
    except Exception as e:
        print("Database exists or cannot create:", e)

    conn = psycopg2.connect(dbname='${dbName}', user=DB_USER, password=DB_PASSWORD, host=DB_HOST)
    cur = conn.cursor()
    ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id SERIAL PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    conn.commit()
    conn.close()
`;
    } else if (db === "MySQL") {
        code += `
import mysql.connector

def init_db():
    try:
        conn = mysql.connector.connect(user=DB_USER, password=DB_PASSWORD, host=DB_HOST)
        cur = conn.cursor()
        cur.execute("CREATE DATABASE IF NOT EXISTS ${dbName}")
        conn.database = '${dbName}'
        ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
        conn.commit()
        conn.close()
    except Exception as e:
        print("Error creating DB or tables:", e)
`;
    } else {
        // SQLite
        code += `
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

    // Config file
    const configFile = path.join(dbFolder, "config.py");
    fs.writeFileSync(
        configFile,
        `DB_USER = "postgres"\nDB_PASSWORD = "password"\nDB_HOST = "localhost"\n`
    );
}

// Crear modelos y CRUD básicos
async function createModelsAndCrud(projectPath: string, tables: string[]) {
    const modelsFolder = path.join(projectPath, "app", "models");
    const crudFolder = path.join(projectPath, "app", "crud");
    fs.mkdirSync(modelsFolder, { recursive: true });
    fs.mkdirSync(crudFolder, { recursive: true });

    for (const table of tables) {
        const className = table.charAt(0).toUpperCase() + table.slice(1);

        const modelCode = `
class ${className}:
    def __init__(self, id=None, name=None):
        self.id = id
        self.name = name
`;
        fs.writeFileSync(path.join(modelsFolder, `${table}.py`), modelCode);

        const crudCode = `
from db.db import init_db

async def create_${table}(obj):
    await init_db()
    # TODO: Implement insert logic

async def get_all_${table}():
    await init_db()
    # TODO: Implement select logic
`;
        fs.writeFileSync(path.join(crudFolder, `${table}.py`), crudCode);
    }
}
