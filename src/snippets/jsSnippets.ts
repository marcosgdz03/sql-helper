import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';

interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
}

export async function showJsSnippets(editor: vscode.TextEditor) {
    const jsItems: SnippetItem[] = [
        {
            label: '🔗 Create MySQL connection',
            snippet: `import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "\${1:localhost}",
    user: "\${2:root}",
    password: "\${3:password}",
    database: "\${4:database}"
});`,
            description: 'mysql2/promise pool'
        },
        {
            label: '🔗 Create PostgreSQL connection',
            snippet: `import { Pool } from "pg";

export const pool = new Pool({
    host: "\${1:localhost}",
    user: "\${2:user}",
    password: "\${3:password}",
    database: "\${4:database}",
    port: \${5:5432}
});`,
            description: 'pg pool'
        },
        {
            label: '🧭 Create Sequelize',
            snippet: `import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("\${1:database}", "\${2:user}", "\${3:password}", {
    host: "\${4:localhost}",
    dialect: "mysql" // o 'postgres'
});`,
            description: 'Sequelize instance'
        },
        {
            label: '⚙️ DB Service with CRUD',
            snippet: `import { pool } from "./dbConnection";

export class \${1:Entity}Repository {
    async getAll() {
        const [rows] = await pool.query("SELECT * FROM \${2:table}");
        return rows;
    }

    async insert(obj) {
        const [result] = await pool.execute(
            "INSERT INTO \${2:table} (\${3:col1}) VALUES (?)",
            [obj.\${4:field}]
        );
        return result.insertId;
    }

    async update(id, obj) {
        await pool.execute(
            "UPDATE \${2:table} SET \${3:column} = ? WHERE id = ?",
            [obj.\${4:value}, id]
        );
    }

    async delete(id) {
        await pool.execute(
            "DELETE FROM \${2:table} WHERE id = ?",
            [id]
        );
    }
}`,
            description: 'Repository with basic operations'
        },
        {
            label: '📄 Script init.sql',
            snippet: `-- Database initialization script
CREATE TABLE IF NOT EXISTS example (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);`,
            description: 'Create tables'
        },
        {
            label: '🌱 Script seed.js',
            snippet: `import { pool } from "./dbConnection";

async function seed() {
    await pool.execute("INSERT INTO example (name) VALUES (?)", ["data1"]);
    await pool.execute("INSERT INTO example (name) VALUES (?)", ["data2"]);
    console.log("Seed completed");
}

seed();`,
            description: 'Seed script'
        },
        {
            label: '🔒 MySQL Transaction',
            snippet: `const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    await conn.execute("INSERT INTO \${1:table} (\${2:column}) VALUES (?)", [\${3:value}]);
    await conn.commit();
} catch (err) {
    await conn.rollback();
    throw err;
} finally {
    conn.release();
}`,
            description: 'Transactional pattern'
        },
        {
            label: '🔍 Complex JOIN',
            snippet: `const [rows] = await pool.query(\`SELECT a.*, b.\${1:column}
FROM \${2:tableA} a
JOIN \${3:tableB} b ON a.\${4:id} = b.\${5:id}
WHERE a.\${6:condition} = ?\`, [\${7:value}]);
console.log(rows);`,
            description: 'Query with JOINs'
        }, {
            label: '🏗️ Create GenericRepository',
            snippet: `import { pool } from "./dbConnection";

export class \${1:Entity}Repository {
    
    async findById(id) {
        try {
            const [rows] = await pool.query("SELECT * FROM \${2:table} WHERE id = ?", [id]);
            return rows[0] || null;
        } catch (err) {
            console.error("Error in findById:", err);
            throw err;
        }
    }

    async findAll() {
        try {
            const [rows] = await pool.query("SELECT * FROM \${2:table}");
            return rows;
        } catch (err) {
            console.error("Error in findAll:", err);
            throw err;
        }
    }

    async insert(obj) {
        try {
            const [result] = await pool.execute(
                "INSERT INTO \${2:table} (\${3:columns}) VALUES (\${4:placeholders})",
                [\${5:values}]
            );
            return result.insertId;
        } catch (err) {
            console.error("Error in insert:", err);
            throw err;
        }
    }

    async update(id, obj) {
        try {
            await pool.execute(
                "UPDATE \${2:table} SET \${3:setClause} WHERE id = ?",
                [\${4:values}, id]
            );
        } catch (err) {
            console.error("Error in update:", err);
            throw err;
        }
    }

    async delete(id) {
        try {
            await pool.execute(
                "DELETE FROM \${2:table} WHERE id = ?",
                [id]
            );
        } catch (err) {
            console.error("Error in delete:", err);
            throw err;
        }
    }

    // Optional transaction example
    async transactionExample(obj) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            await conn.execute("INSERT INTO \${2:table} (\${3:columns}) VALUES (?)", [obj.\${4:value}]);
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            console.error("Transaction failed:", err);
            throw err;
        } finally {
            conn.release();
        }
    }
}`,
            description: 'Generic Repository with findById, findAll, insert, update, delete, transaction and error handling'
        }

    ];

    // Mostrar QuickPick completo con detalle completo
    const pick = await vscode.window.showQuickPick(
        jsItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet,
            snippet: i.snippet
        })),
        { placeHolder: 'JavaScript/TypeScript DB snippets / Create files', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('JS snippet selection cancelled');
        return;
    }

    // Determinar si se va a crear un archivo
    const filesToCreate = [
        'Create MySQL connection',
        'Create PostgreSQL connection',
        'Create Sequelize',
        'Script init.sql',
        'Script seed.js'
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
            case '🔗 Create MySQL connection': fileName = 'dbConnection.js'; break;
            case '🔗 Create PostgreSQL connection': fileName = 'pgConnection.js'; break;
            case '🧭 Create Sequelize': fileName = 'sequelize.js'; break;
            case '📄 Script init.sql': fileName = 'init.sql'; break;
            case '🌱 Script seed.js': fileName = 'seed.js'; break;
            default: fileName = 'snippet.txt';
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
        logInfo(`JS snippet inserted: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error inserting JS snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
