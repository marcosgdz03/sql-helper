import * as fs from "fs";
import * as path from "path";

type DbType = "PostgreSQL" | "MySQL" | "SQLite";

export async function generateFastApiProject(projectPath: string, db: DbType, dbName: string, tables: string[]) {
    fs.mkdirSync(path.join(projectPath, "app", "routers"), { recursive: true });
    fs.mkdirSync(path.join(projectPath, "db"), { recursive: true });

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
    await init_db()

@app.get("/")
async def root():
    return {"message": "FastAPI project working!"}
`;

    fs.writeFileSync(path.join(projectPath, "app", "main.py"), mainPy);
    fs.writeFileSync(path.join(projectPath, "app", "__init__.py"), "");

    // requirements.txt
    fs.writeFileSync(path.join(projectPath, "requirements.txt"),
        `fastapi
uvicorn[standard]
${db === "PostgreSQL" ? "asyncpg" : db === "MySQL" ? "aiomysql" : "aiosqlite"}`
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
import asyncpg
import asyncio

async def init_db():
    conn = await asyncpg.connect(user='postgres', password='password', database='postgres', host='localhost')
    try:
        await conn.execute("CREATE DATABASE ${dbName}")
    except:
        pass
    await conn.close()
    conn = await asyncpg.connect(user='postgres', password='password', database='${dbName}', host='localhost')
    ${tables.map(t => `await conn.execute("CREATE TABLE IF NOT EXISTS ${t} (id SERIAL PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    await conn.close()
`;
    } else if (db === "MySQL") {
        code = `
import aiomysql
import asyncio

async def init_db():
    conn = await aiomysql.connect(user='root', password='password', host='localhost')
    cur = await conn.cursor()
    await cur.execute("CREATE DATABASE IF NOT EXISTS ${dbName}")
    await cur.execute("USE ${dbName}")
    ${tables.map(t => `await cur.execute("CREATE TABLE IF NOT EXISTS ${t} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255));")`).join("\n    ")}
    await conn.commit()
    conn.close()
`;
    } else {
        code = `
import aiosqlite
import asyncio

async def init_db():
    async with aiosqlite.connect("${dbName}.sqlite") as db:
        ${tables.map(t => `await db.execute("CREATE TABLE IF NOT EXISTS ${t} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);")`).join("\n        ")}
        await db.commit()
`;
    }

    fs.writeFileSync(dbFile, code);
}
