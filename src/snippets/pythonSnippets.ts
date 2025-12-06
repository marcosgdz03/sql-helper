import * as vscode from 'vscode';

export async function showPythonSnippets(editor: vscode.TextEditor) {
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
for row in rows:
    print(row)`
        },
        {
            label: 'SELECT con WHERE',
            snippet:
`cursor.execute("SELECT * FROM \${1:tabla} WHERE \${2:columna} = ?", (\${3:valor},))
row = cursor.fetchone()`
        },
        {
            label: 'INSERT',
            snippet:
`cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    (\${4:val1}, \${5:val2})
)
conn.commit()`
        },
        {
            label: 'UPDATE',
            snippet:
`cursor.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    (\${3:nuevoValor}, \${4:id})
)
conn.commit()`
        },
        {
            label: 'DELETE',
            snippet:
`cursor.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    (\${2:id},)
)
conn.commit()`
        },
        {
            label: 'CREATE TABLE',
            snippet:
`cursor.execute("""
CREATE TABLE IF NOT EXISTS \${1:tabla} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    \${2:campo} TEXT NOT NULL
)
""")
conn.commit()`
        },
        {
            label: 'Clase DAO Python',
            snippet:
`class \${1:Entidad}DAO:
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
        self.conn.commit()`
        }
    ];

    const pick = await vscode.window.showQuickPick(
        pyItems.map(i => ({ label: i.label, detail: i.snippet })),
        { placeHolder: 'Snippet Python DB' }
    );

    if (!pick) { return; }

    await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
}
