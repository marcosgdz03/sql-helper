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
            label: '🔗 Crear conexión MySQL',
            snippet: `import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "\${1:localhost}",
    user: "\${2:root}",
    password: "\${3:password}",
    database: "\${4:database}"
});`,
            description: 'Pool mysql2/promise'
        },
        {
            label: '🔗 Crear conexión PostgreSQL',
            snippet: `import { Pool } from "pg";

export const pool = new Pool({
    host: "\${1:localhost}",
    user: "\${2:user}",
    password: "\${3:password}",
    database: "\${4:database}",
    port: \${5:5432}
});`,
            description: 'Pool pg'
        },
        {
            label: '🧭 Crear Sequelize',
            snippet: `import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("\${1:database}", "\${2:user}", "\${3:password}", {
    host: "\${4:localhost}",
    dialect: "mysql" // o 'postgres'
});`,
            description: 'Instancia Sequelize'
        },
        {
            label: '⚙️ Servicio DB con CRUD',
            snippet: `import { pool } from "./dbConnection";

export class \${1:Entidad}Repository {
    async getAll() {
        const [rows] = await pool.query("SELECT * FROM \${2:tabla}");
        return rows;
    }

    async insert(obj) {
        const [result] = await pool.execute(
            "INSERT INTO \${2:tabla} (\${3:col1}) VALUES (?)",
            [obj.\${4:campo}]
        );
        return result.insertId;
    }

    async update(id, obj) {
        await pool.execute(
            "UPDATE \${2:tabla} SET \${3:columna} = ? WHERE id = ?",
            [obj.\${4:valor}, id]
        );
    }

    async delete(id) {
        await pool.execute(
            "DELETE FROM \${2:tabla} WHERE id = ?",
            [id]
        );
    }
}`,
            description: 'Repositorio con operaciones básicas'
        },
        {
            label: '📄 Script init.sql',
            snippet: `-- Script de inicialización de base de datos
CREATE TABLE IF NOT EXISTS ejemplo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);`,
            description: 'Crear tablas'
        },
        {
            label: '🌱 Script seed.js',
            snippet: `import { pool } from "./dbConnection";

async function seed() {
    await pool.execute("INSERT INTO ejemplo (nombre) VALUES (?)", ["dato1"]);
    await pool.execute("INSERT INTO ejemplo (nombre) VALUES (?)", ["dato2"]);
    console.log("Seed completado");
}

seed();`,
            description: 'Script de semillas'
        },
        {
            label: '🔒 Transacción MySQL',
            snippet: `const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    await conn.execute("INSERT INTO \${1:tabla} (\${2:columna}) VALUES (?)", [\${3:valor}]);
    await conn.commit();
} catch (err) {
    await conn.rollback();
    throw err;
} finally {
    conn.release();
}`,
            description: 'Patrón transaccional'
        },
        {
            label: '🔍 JOIN complejo',
            snippet: `const [rows] = await pool.query(` + "`" + `
SELECT a.*, b.\${1:columna}
FROM \${2:tablaA} a
JOIN \${3:tablaB} b ON a.\${4:id} = b.\${5:id}
WHERE a.\${6:condicion} = ?
` + "`" + `, [\${7:valor}]);
console.log(rows);`,
            description: 'Consulta con JOINs'
        }
    ];

    const pick = await vscode.window.showQuickPick(
        jsItems.map((i) => ({ label: i.label, detail: i.description || i.snippet.substring(0, 60) + '...', snippet: i.snippet })),
        { placeHolder: 'Snippet JavaScript/TypeScript DB / Crear ficheros', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('Selección de snippet JS cancelada');
        return;
    }

    const filesToCreate = ['Crear conexión MySQL', 'Crear conexión PostgreSQL', 'Crear Sequelize', 'Script init.sql', 'Script seed.js'];

    if (filesToCreate.some(f => pick.label.includes(f.split(' ')[0]) || pick.label.includes(f.split(' ')[1] || ''))) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '🔗 Crear conexión MySQL': { fileName = 'dbConnection.js'; break; }
            case '🔗 Crear conexión PostgreSQL': { fileName = 'pgConnection.js'; break; }
            case '🧭 Crear Sequelize': { fileName = 'sequelize.js'; break; }
            case '📄 Script init.sql': { fileName = 'init.sql'; break; }
            case '🌱 Script seed.js': { fileName = 'seed.js'; break; }
            default: fileName = 'snippet.txt';
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
        logInfo(`Snippet JS insertado: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error insertando snippet JS: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
