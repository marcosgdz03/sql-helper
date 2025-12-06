import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function showJavaSnippets(editor: vscode.TextEditor) {

    const javaItems = [
        {
            label: 'Crear fichero DatabaseConnection',
            snippet:
`import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://\${1:localhost}/\${2:database}";
    private static final String USER = "\${3:root}";
    private static final String PASSWORD = "\${4:password}";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`
        },
        {
            label: 'Crear fichero BasicQueries',
            snippet:
`import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BasicQueries {
    // Métodos CRUD básicos aquí...
}`
        },
        {
            label: 'Crear fichero QueryExecutor',
            snippet:
`import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class QueryExecutor {

    public static void executeUpdate(String sql, Object... params) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) {
                ps.setObject(i + 1, params[i]);
            }
            ps.executeUpdate();
        }
    }

    public static ResultSet executeQuery(String sql, Object... params) throws SQLException {
        Connection conn = DatabaseConnection.getConnection();
        PreparedStatement ps = conn.prepareStatement(sql);
        for (int i = 0; i < params.length; i++) {
            ps.setObject(i + 1, params[i]);
        }
        return ps.executeQuery();
    }
}`
        },
        {
            label: 'Crear fichero init.sql',
            snippet:
`-- Script de creación de tablas
CREATE TABLE IF NOT EXISTS ejemplo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);`
        },
        {
            label: 'Crear fichero seed.sql',
            snippet:
`-- Script de inserción de datos iniciales
INSERT INTO ejemplo (nombre) VALUES ('dato1'), ('dato2');`
        },
        {
            label: 'Transacción (commit/rollback)',
            snippet:
`try (Connection conn = DatabaseConnection.getConnection()) {
    try {
        conn.setAutoCommit(false);
        // ejecutar consultas
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}`
        }
    ];

    const pick = await vscode.window.showQuickPick(
        javaItems.map(i => ({ label: i.label, detail: i.snippet })),
        { placeHolder: 'Método JDBC / Crear ficheros / Transacciones' }
    );

    if (!pick) return;

    // Ficheros que se crean en el proyecto
    const filesToCreate = [
        'Crear fichero DatabaseConnection',
        'Crear fichero BasicQueries',
        'Crear fichero QueryExecutor',
        'Crear fichero init.sql',
        'Crear fichero seed.sql'
    ];

    if (filesToCreate.includes(pick.label)) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case 'Crear fichero DatabaseConnection': fileName = 'DatabaseConnection.java'; break;
            case 'Crear fichero BasicQueries': fileName = 'BasicQueries.java'; break;
            case 'Crear fichero QueryExecutor': fileName = 'QueryExecutor.java'; break;
            case 'Crear fichero init.sql': fileName = 'init.sql'; break;
            case 'Crear fichero seed.sql': fileName = 'seed.sql'; break;
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
