import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { chooseDatabase, createBaseFolder } from "../utils/utils";

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
    if (framework === "Flask") {
        await createFlaskProject(projectPath, framework, db);
    } else if (framework === "FastAPI") {
        await createFastApiProject(projectPath, framework, db);
    }
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
${dbImports[db]}

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask project '${name}' working!"

if __name__ == "__main__":
    app.run(debug=True)
`;

    fs.writeFileSync(path.join(folder, "app", "app.py"), appPy);
    fs.writeFileSync(path.join(folder, "app", "__init__.py"), "");

    fs.writeFileSync(
        path.join(folder, "requirements.txt"),
        `flask
${db === "PostgreSQL" ? "psycopg2" :
            db === "MySQL" ? "mysql-connector-python" :
                db === "SQLite" ? "" : ""}`
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
${dbImports[db]}

app = FastAPI()

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
