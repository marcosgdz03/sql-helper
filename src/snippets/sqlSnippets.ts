import * as vscode from 'vscode';

export async function showSqlSnippets(editor: vscode.TextEditor) {
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
}
