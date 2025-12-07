import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';
import { SnippetItem } from '../types';

export async function showSqlSnippets(editor: vscode.TextEditor) {
    const sqlItems: SnippetItem[] = [
        // ========== SELECT ==========
        { label: '📖 SELECT', snippet: 'SELECT * FROM ${1:tabla};', description: 'Consulta básica' },
        { label: '📖 SELECT WHERE', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:condicion};', description: 'Con condición' },
        { label: '📖 SELECT LIMIT', snippet: 'SELECT * FROM ${1:tabla} LIMIT ${2:10};', description: 'Limitar resultados' },
        { label: '📖 SELECT ORDER BY', snippet: 'SELECT * FROM ${1:tabla} ORDER BY ${2:columna} ${3:ASC|DESC};', description: 'Ordenar' },
        { label: '📖 SELECT DISTINCT', snippet: 'SELECT DISTINCT ${1:columna} FROM ${2:tabla};', description: 'Valores únicos' },

        // ========== AGGREGATIONS ==========
        { label: '⚙️ COUNT', snippet: 'SELECT COUNT(*) as cantidad FROM ${1:tabla};', description: 'Contar registros' },
        { label: '⚙️ SUM', snippet: 'SELECT SUM(${1:columna}) as total FROM ${2:tabla};', description: 'Suma' },
        { label: '⚙️ AVG', snippet: 'SELECT AVG(${1:columna}) as promedio FROM ${2:tabla};', description: 'Promedio' },

        // ========== INSERT/UPDATE/DELETE ==========
        { label: '✏️ INSERT', snippet: 'INSERT INTO ${1:tabla} (${2:col}) VALUES (${3:val});', description: 'Insertar registro' },
        { label: '✏️ UPDATE', snippet: 'UPDATE ${1:tabla} SET ${2:columna} = ${3:valor} WHERE ${4:condicion};', description: 'Actualizar' },
        { label: '✏️ DELETE', snippet: 'DELETE FROM ${1:tabla} WHERE ${2:condicion};', description: 'Eliminar' },

        // ========== CREATE TABLE ==========
        { label: '🏗️ CREATE TABLE', snippet: 'CREATE TABLE ${1:tabla} (\n    ${2:id} INT PRIMARY KEY AUTO_INCREMENT,\n    ${3:nombre} VARCHAR(100) NOT NULL\n);', description: 'Tabla estándar' },
        { label: '🏗️ CREATE TABLE IF NOT', snippet: 'CREATE TABLE IF NOT EXISTS ${1:tabla} (${2:id} INT PRIMARY KEY, ${3:nombre} VARCHAR(50));', description: 'Crear si no existe' },

        // ========== ALTER TABLE ==========
        { label: '🔧 ALTER ADD COLUMN', snippet: 'ALTER TABLE ${1:tabla} ADD COLUMN ${2:nueva_columna} ${3:TIPO};', description: 'Agregar columna' },
        { label: '🔧 ALTER DROP COLUMN', snippet: 'ALTER TABLE ${1:tabla} DROP COLUMN ${2:columna};', description: 'Eliminar columna' },

        // ========== INDEXES ==========
        { label: '🗂️ CREATE INDEX', snippet: 'CREATE INDEX ${1:idx_nombre} ON ${2:tabla} (${3:columna});', description: 'Índice normal' },

        // ========== JOINS & ADVANCED ==========
        { label: '⭐ LEFT JOIN', snippet: 'SELECT * FROM ${1:tabla1} LEFT JOIN ${2:tabla2} ON ${1:tabla1}.${3:id} = ${2:tabla2}.${4:id};', description: 'Unión izquierda' },
        { label: '⭐ UNION', snippet: 'SELECT ${1:columna} FROM ${2:tabla1} UNION SELECT ${3:columna} FROM ${4:tabla2};', description: 'Combinar consultas' },
        { label: '⭐ CASE WHEN', snippet: 'SELECT ${1:columna}, CASE WHEN ${2:condicion} THEN ${3:val1} ELSE ${4:val2} END FROM ${5:tabla};', description: 'Condicional' },

        // ========== FUNCTIONS ==========
        { label: '🔤 CONCAT', snippet: 'SELECT CONCAT(${1:col1}, \' \', ${2:col2}) FROM ${3:tabla};', description: 'Concatenar strings' },
        { label: '🔤 UPPER/LOWER', snippet: 'SELECT UPPER(${1:columna}) FROM ${2:tabla};', description: 'Convertir casos' },
        { label: '📅 NOW()', snippet: 'SELECT NOW() as fecha_actual;', description: 'Fecha actual' },
        { label: '📅 DATEDIFF', snippet: 'SELECT DATEDIFF(${1:fecha1}, ${2:fecha2}) as diferencia FROM ${3:tabla};', description: 'Diferencia de fechas' },

        // ========== UTILITY ==========
        { label: '📄 create_tables.sql', snippet: '-- create_tables.sql\nCREATE TABLE IF NOT EXISTS ejemplo (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    nombre VARCHAR(100) NOT NULL\n);', description: 'Crear archivo SQL' },
        { label: '📄 seed_data.sql', snippet: '-- seed_data.sql\nINSERT INTO ejemplo (nombre) VALUES (\'dato1\');\nINSERT INTO ejemplo (nombre) VALUES (\'dato2\');', description: 'Datos de prueba' },
    ];

    const pick = await vscode.window.showQuickPick(
        sqlItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 60) + '...',
            snippet: i.snippet
        })),
        { placeHolder: 'Selecciona un snippet SQL', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('Selección de snippet SQL cancelada');
        return;
    }

    // Ficheros que se crean
    const filesToCreate = ['📄 create_tables.sql', '📄 seed_data.sql'];
    if (filesToCreate.includes(pick.label)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '📄 create_tables.sql': { fileName = 'create_tables.sql'; break; }
            case '📄 seed_data.sql': { fileName = 'seed_data.sql'; break; }
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

    // Insertar snippet
    try {
        await editor.insertSnippet(new vscode.SnippetString(pick.snippet));
        logInfo(`Snippet SQL insertado: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error insertando snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
