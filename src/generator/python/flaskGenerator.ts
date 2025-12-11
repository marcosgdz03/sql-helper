import * as fs from "fs";
import * as path from "path";

type DbType = "PostgreSQL" | "MySQL" | "SQLite";

export async function generateFlaskProject(projectPath: string, db: DbType, dbName: string, tables: string[]) {
    fs.mkdirSync(path.join(projectPath, "app"), { recursive: true });
    fs.mkdirSync(path.join(projectPath, "db"), { recursive: true });

    // app.py
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
    return "Flask project working!"

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
`;
    fs.writeFileSync(path.join(projectPath, "app", "app.py"), appPy);
    fs.writeFileSync(path.join(projectPath, "app", "__init__.py"), "");

    // requirements.txt
    fs.writeFileSync(path.join(projectPath, "requirements.txt"),
        `flask
${db === "PostgreSQL" ? "psycopg2" : db === "MySQL" ? "mysql-connector-python" : "aiosqlite"}`
    );

    // db module
    await createDbModule(projectPath, db, dbName, tables);
}

async function createDbModule(projectPath: string, db: DbType, dbName: string, tables: string[]) {
    const dbFolder = path.join(projectPath, "db");
    fs.mkdirSync(dbFolder, { recursive: true });
    const dbFile = path.join(dbFolder, "db.py");

    let code = "";
    if (db === "PostgreSQL") {
        code = `
import psycopg2

def init_db():
    conn = psycopg2.connect(dbname='postgres', user='postgres', password='password', host='localhost')
    conn.autocommit = True
    cur = conn.cursor()
    try:
        cur.execute("CREATE DATABASE ${dbName}")
    except:
        pass
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
    conn = mysql.connector.connect(user='root', password='password', host='localhost')
    cur = conn.cursor()
    cur.execute("CREATE DATABASE IF NOT EXISTS ${dbName}")
    conn.database = '${dbName}'
    ${tables.map(t => `cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    conn.commit()
    conn.close()
`;
    } else {
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
    