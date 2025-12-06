import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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
            label: 'CREATE VIEW',
            snippet:
`CREATE VIEW \${1:vista} AS
SELECT \${2:columnas}
FROM \${3:tabla}
WHERE \${4:condicion};`
        },
        {
            label: 'CREATE TRIGGER',
            snippet:
`CREATE TRIGGER \${1:trigger_nombre}
AFTER INSERT ON \${2:tabla}
FOR EACH ROW
BEGIN
    -- acciones
END;`
        },
        {
            label: 'CREATE STORED PROCEDURE',
            snippet:
`DELIMITER //
CREATE PROCEDURE \${1:proc_nombre}()
BEGIN
    -- instrucciones
END //
DELIMITER ;`
        },
        { label: 'ALTER TABLE - ADD COLUMN', snippet: 'ALTER TABLE ${1:tabla} ADD COLUMN ${2:nueva_columna} ${3:TIPO};' },
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
        },
        {
            label: 'Crear fichero create_tables.sql',
            snippet:
`-- create_tables.sql
CREATE TABLE IF NOT EXISTS ejemplo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);`
        },
        {
            label: 'Crear fichero seed_data.sql',
            snippet:
`-- seed_data.sql
INSERT INTO ejemplo (nombre) VALUES ('dato1');
INSERT INTO ejemplo (nombre) VALUES ('dato2');`
        },
        {
            label: 'Backup base de datos',
            snippet:
`-- Backup MySQL
mysqldump -u \${1:usuario} -p \${2:database} > backup.sql`
        },
        {
            label: 'Restaurar base de datos',
            snippet:
`-- Restore MySQL
mysql -u \${1:usuario} -p \${2:database} < backup.sql`
        }
    ];

    const pick = await vscode.window.showQuickPick(
        sqlItems.map((i) => ({ label: i.label, detail: i.snippet })),
        { placeHolder: 'Snippet SQL / Crear ficheros' }
    );

    if (!pick) {
        return;
    }

    // Ficheros que se crean en el proyecto
    const filesToCreate = ['Crear fichero create_tables.sql', 'Crear fichero seed_data.sql'];
    if (filesToCreate.includes(pick.label)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case 'Crear fichero create_tables.sql': { fileName = 'create_tables.sql'; break; }
            case 'Crear fichero seed_data.sql': { fileName = 'seed_data.sql'; break; }
        }

        const filePath = path.join(folderPath, fileName);

        if (fs.existsSync(filePath)) {
            vscode.window.showWarningMessage(`${fileName} ya existe.`);
            return;
        }

        fs.writeFileSync(filePath, pick.detail!, 'utf8');
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
        return;
    }

    // Insertar snippet normal en el editor activo
    await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
}
