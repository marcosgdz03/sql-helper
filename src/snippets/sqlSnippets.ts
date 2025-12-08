import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';
import { SnippetItem } from '../types';

export async function showSqlSnippets(editor: vscode.TextEditor) {
    const sqlItems: SnippetItem[] = [
        // ========== SELECT ==========
        { label: '📖 SELECT', snippet: 'SELECT * FROM ${1:table};', description: 'Basic query' },
        { label: '📖 SELECT WHERE', snippet: 'SELECT * FROM ${1:table} WHERE ${2:condition};', description: 'With condition' },
        { label: '📖 SELECT LIMIT', snippet: 'SELECT * FROM ${1:table} LIMIT ${2:10};', description: 'Limit results' },
        { label: '📖 SELECT ORDER BY', snippet: 'SELECT * FROM ${1:table} ORDER BY ${2:column} ${3:ASC|DESC};', description: 'Order results' },
        { label: '📖 SELECT DISTINCT', snippet: 'SELECT DISTINCT ${1:column} FROM ${2:table};', description: 'Unique values' },

        // ========== AGGREGATIONS ==========
        { label: '⚙️ COUNT', snippet: 'SELECT COUNT(*) as count FROM ${1:table};', description: 'Count records' },
        { label: '⚙️ SUM', snippet: 'SELECT SUM(${1:column}) as total FROM ${2:table};', description: 'Sum' },
        { label: '⚙️ AVG', snippet: 'SELECT AVG(${1:column}) as avg FROM ${2:table};', description: 'Average' },

        // ========== INSERT/UPDATE/DELETE ==========
        { label: '✏️ INSERT', snippet: 'INSERT INTO ${1:table} (${2:col}) VALUES (${3:val});', description: 'Insert record' },
        { label: '✏️ UPDATE', snippet: 'UPDATE ${1:table} SET ${2:column} = ${3:value} WHERE ${4:condition};', description: 'Update' },
        { label: '✏️ DELETE', snippet: 'DELETE FROM ${1:table} WHERE ${2:condition};', description: 'Delete' },

        // ========== CREATE TABLE ==========
        { label: '🏗️ CREATE TABLE', snippet: 'CREATE TABLE ${1:table} (\n    ${2:id} INT PRIMARY KEY AUTO_INCREMENT,\n    ${3:name} VARCHAR(100) NOT NULL\n);', description: 'Standard table' },
        { label: '🏗️ CREATE TABLE IF NOT', snippet: 'CREATE TABLE IF NOT EXISTS ${1:table} (${2:id} INT PRIMARY KEY, ${3:name} VARCHAR(50));', description: 'Create if not exists' },

        // ========== ALTER TABLE ==========
        { label: '🔧 ALTER ADD COLUMN', snippet: 'ALTER TABLE ${1:table} ADD COLUMN ${2:new_column} ${3:TYPE};', description: 'Add column' },
        { label: '🔧 ALTER DROP COLUMN', snippet: 'ALTER TABLE ${1:table} DROP COLUMN ${2:column};', description: 'Drop column' },

        // ========== INDEXES ==========
        { label: '🗂️ CREATE INDEX', snippet: 'CREATE INDEX ${1:idx_name} ON ${2:table} (${3:column});', description: 'Normal index' },

        // ========== JOINS & ADVANCED ==========
        { label: '⭐ LEFT JOIN', snippet: 'SELECT * FROM ${1:table1} LEFT JOIN ${2:table2} ON ${1:table1}.${3:id} = ${2:table2}.${4:id};', description: 'Left join' },
        { label: '⭐ UNION', snippet: 'SELECT ${1:column} FROM ${2:table1} UNION SELECT ${3:column} FROM ${4:table2};', description: 'Combine queries' },
        { label: '⭐ CASE WHEN', snippet: 'SELECT ${1:column}, CASE WHEN ${2:condition} THEN ${3:val1} ELSE ${4:val2} END FROM ${5:table};', description: 'Conditional' },

        // ========== FUNCTIONS ==========
        { label: '🔤 CONCAT', snippet: 'SELECT CONCAT(${1:col1}, \' \' , ${2:col2}) FROM ${3:table};', description: 'Concatenate strings' },
        { label: '🔤 UPPER/LOWER', snippet: 'SELECT UPPER(${1:column}) FROM ${2:table};', description: 'Change case' },
        { label: '📅 NOW()', snippet: 'SELECT NOW() as current_date;', description: 'Current date' },
        { label: '📅 DATEDIFF', snippet: 'SELECT DATEDIFF(${1:date1}, ${2:date2}) as diff FROM ${3:table};', description: 'Date difference' },

        // ========== UTILITY ==========
        { label: '📄 create_tables.sql', snippet: '-- create_tables.sql\nCREATE TABLE IF NOT EXISTS example (\n    id INT PRIMARY KEY AUTO_INCREMENT,\n    name VARCHAR(100) NOT NULL\n);', description: 'Create SQL file' },
        { label: '📄 seed_data.sql', snippet: '-- seed_data.sql\nINSERT INTO example (name) VALUES (\'data1\');\nINSERT INTO example (name) VALUES (\'data2\');', description: 'Seed data' },
    ];

    const pick = await vscode.window.showQuickPick(
        sqlItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 60) + '...',
            snippet: i.snippet
        })),
        { placeHolder: 'Select a SQL snippet', matchOnDetail: true }
    );

    if (!pick) {
        logInfo('SQL snippet selection cancelled');
        return;
    }

    // Ficheros que se crean
    const filesToCreate = ['📄 create_tables.sql', '📄 seed_data.sql'];
    if (filesToCreate.includes(pick.label)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Open a project folder first');
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

    // Insertar snippet
    try {
        await editor.insertSnippet(new vscode.SnippetString(pick.snippet));
        logInfo(`SQL snippet inserted: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error inserting snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
