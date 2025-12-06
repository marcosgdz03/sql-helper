import * as vscode from 'vscode';

export async function showJsSnippets(editor: vscode.TextEditor) {
    const jsItems = [
        {
            label: 'Conexión MySQL (mysql2/promise)',
            snippet:
`import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "\${1:localhost}",
    user: "\${2:root}",
    password: "\${3:password}",
    database: "\${4:database}"
});

export default pool;`
        },
        {
            label: 'SELECT (async/await)',
            snippet:
`const [rows] = await pool.query("SELECT * FROM \${1:tabla}");
console.log(rows);`
        },
        {
            label: 'INSERT',
            snippet:
`const [result] = await pool.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    [\${4:val1}, \${5:val2}]
);
console.log("Insert ID:", result.insertId);`
        },
        {
            label: 'UPDATE',
            snippet:
`await pool.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    [\${3:valor}, \${4:id}]
);`
        },
        {
            label: 'DELETE',
            snippet:
`await pool.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    [\${2:id}]
);`
        },
        {
            label: 'CREATE TABLE',
            snippet:
`await pool.execute(\`
CREATE TABLE IF NOT EXISTS \${1:tabla} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    \${2:campo} VARCHAR(100) NOT NULL
)\`
);`
        }
    ];

    const pick = await vscode.window.showQuickPick(
        jsItems.map(i => ({ label: i.label, detail: i.snippet })),
        { placeHolder: 'Snippet JavaScript DB' }
    );

    if (!pick) { return; }

    await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
}
