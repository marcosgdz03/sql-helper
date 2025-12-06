import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('SQL-Java Helper activado');

    const disposable = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('Abre un archivo .java, .sql, .py o .js para usar esta extensión');
                return;
            }

            const language = editor.document.languageId;
            let mode: 'sql' | 'java' | 'python' | 'javascript' | undefined;

            if (language === 'sql') { mode = 'sql'; }
            else if (language === 'java') { mode = 'java'; }
            else if (language === 'python') { mode = 'python'; }
            else if (language === 'javascript' || language === 'typescript') { mode = 'javascript'; }
            else {
                const pick = await vscode.window.showQuickPick(
                    [
                        { label: 'Snippets SQL', mode: 'sql' as const },
                        { label: 'Métodos Java JDBC', mode: 'java' as const },
                        { label: 'Snippets Python (DB)', mode: 'python' as const },
                        { label: 'Snippets JavaScript (DB)', mode: 'javascript' as const }
                    ],
                    { placeHolder: 'Selecciona el tipo de snippet' }
                );
                if (!pick) { return; }
                mode = pick.mode;
            }

            /* ────────────────────────────
               SNIPPETS SQL
            ──────────────────────────── */
            if (mode === 'sql') {
                const sqlItems = [
                    { label: 'SELECT', snippet: 'SELECT * FROM ${1:tabla};' },
                    { label: 'SELECT WHERE', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:condicion};' },
                    { label: 'INSERT', snippet: 'INSERT INTO ${1:tabla} (${2:col}) VALUES (${3:val});' },
                    {
                        label: 'CREATE TABLE (completo)',
                        snippet:
`CREATE TABLE \${1:tabla} (
    \${2:id} INT PRIMARY KEY AUTO_INCREMENT,
    \${3:nombre} VARCHAR(100) NOT NULL,
    \${4:activo} BOOLEAN DEFAULT TRUE,
    \${5:fecha_creacion} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
                    },
                    {
                        label: 'CREATE TABLE si no existe',
                        snippet:
`CREATE TABLE IF NOT EXISTS \${1:tabla} (
    \${2:id} INT PRIMARY KEY,
    \${3:nombre} VARCHAR(50)
);`
                    },
                    {
                        label: 'CREATE TABLE con FOREIGN KEY',
                        snippet:
`CREATE TABLE \${1:tabla} (
    \${2:id} INT PRIMARY KEY,
    \${3:nombre} VARCHAR(50),
    \${4:fk_usuario} INT,
    FOREIGN KEY (\${4:fk_usuario}) REFERENCES \${5:usuario}(id)
);`
                    },
                    { label: 'ALTER TABLE - ADD COLUMN', snippet: 'ALTER TABLE ${1:tabla} ADD COLUMN ${2:nueva_columna} ${3:TIPO};' },
                    {
                        label: 'ALTER TABLE - ADD FOREIGN KEY',
                        snippet:
`ALTER TABLE \${1:tabla}
ADD CONSTRAINT \${2:fk_nombre}
FOREIGN KEY (\${3:columna})
REFERENCES \${4:tabla_ref}(\${5:id});`
                    },
                    { label: 'ALTER TABLE - DROP COLUMN', snippet: 'ALTER TABLE ${1:tabla} DROP COLUMN ${2:columna};' },
                    { label: 'CREATE INDEX', snippet: 'CREATE INDEX ${1:idx_nombre} ON ${2:tabla} (${3:columna});' },
                    { label: 'CREATE UNIQUE INDEX', snippet: 'CREATE UNIQUE INDEX ${1:idx_nombre} ON ${2:tabla} (${3:columna});' },
                    {
                        label: 'INSERT MULTIPLE VALUES',
                        snippet:
`INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2})
VALUES
(\${4:val1}, \${5:val2}),
(\${6:val1}, \${7:val2}),
(\${8:val1}, \${9:val2});`
                    }
                ];

                const pick = await vscode.window.showQuickPick(
                    sqlItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Snippet SQL' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               MÉTODOS JAVA JDBC
            ──────────────────────────── */
            if (mode === 'java') {
                const javaItems = [
                    {
                        label: 'SELECT (List)',
                        snippet:
`public List<\${1:Entidad}> getAll\${1:Entidad}() throws SQLException {
    List<\${1:Entidad}> list = new ArrayList<>();
    String sql = "SELECT * FROM \${2:tabla}";

    try (Connection conn = dataSource.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {

        while (rs.next()) {
            \${1:Entidad} obj = new \${1:Entidad}();
            // mapear campos
            list.add(obj);
        }
    }
    return list;
}`
                    },
                    {
                        label: 'INSERT',
                        snippet:
`public int insert\${1:Entidad}(\${1:Entidad} obj) throws SQLException {
    String sql = "INSERT INTO \${2:tabla} (\${3:col1}) VALUES (?)";
    try (Connection conn = dataSource.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${4:TipoSQL}(1, obj.\${5:getCol1}());
        return ps.executeUpdate();
    }
}`
                    },
                    {
                        label: 'DELETE',
                        snippet:
`public int delete\${1:Entidad}(\${2:Tipo} id) throws SQLException {
    String sql = "DELETE FROM \${3:tabla} WHERE \${4:id} = ?";
    try (Connection conn = dataSource.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${5:TipoSQL}(1, id);
        return ps.executeUpdate();
    }
}`
                    }
                ];

                const pick = await vscode.window.showQuickPick(
                    javaItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Método JDBC' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               SNIPPETS PYTHON
            ──────────────────────────── */
            if (mode === 'python') {
                const pyItems = [
                    {
                        label: 'Conexión SQLite',
                        snippet:
`import sqlite3

conn = sqlite3.connect("\${1:database}.db")
cursor = conn.cursor()`
                    },
                    {
                        label: 'SELECT *',
                        snippet:
`cursor.execute("SELECT * FROM \${1:tabla}")
rows = cursor.fetchall()
for row in rows {
    print(row)
}`
                    },
                    {
                        label: 'INSERT',
                        snippet:
`cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    (\${4:val1}, \${5:val2})
)
conn.commit()`
                    }
                ];

                const pick = await vscode.window.showQuickPick(
                    pyItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Snippet Python DB' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               SNIPPETS JAVASCRIPT
            ──────────────────────────── */
            if (mode === 'javascript') {
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
                return;
            }

        } catch (err) {
            console.error('Error en la extensión:', err);
            vscode.window.showErrorMessage('Error en SQL Helper');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
