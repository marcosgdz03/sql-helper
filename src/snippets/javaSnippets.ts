import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';

interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
}

export async function showJavaSnippets(editor: vscode.TextEditor) {
    const javaItems: SnippetItem[] = [
        {
            label: '🗄️ Crear DatabaseConnection',
            snippet: `import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://\${1:localhost}/\${2:database}";
    private static final String USER = "\${3:root}";
    private static final String PASSWORD = "\${4:password}";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`,
            description: 'Clase de conexión JDBC'
        },
        {
            label: '📝 Crear BasicQueries',
            snippet: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BasicQueries {
    // Métodos CRUD básicos aquí...
}`,
            description: 'Clase base para consultas CRUD'
        },
        {
            label: '⚙️ Crear QueryExecutor',
            snippet: `import java.sql.Connection;
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
}`,
            description: 'Ejecutor de consultas parametrizadas'
        },
        {
            label: '📄 Crear init.sql',
            snippet: `-- Script de creación de tablas
CREATE TABLE IF NOT EXISTS ejemplo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);`,
            description: 'Script de inicialización'
        },
        {
            label: '🌱 Crear seed.sql',
            snippet: `-- Script de inserción de datos iniciales
INSERT INTO ejemplo (nombre) VALUES ('dato1'), ('dato2');`,
            description: 'Datos de prueba'
        },
        {
            label: '🔄 Transacción (commit/rollback)',
            snippet: `try (Connection conn = DatabaseConnection.getConnection()) {
    try {
        conn.setAutoCommit(false);
        // ejecutar consultas
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}`,
            description: 'Manejo de transacciones'
        }
    ];

    const pick = await vscode.window.showQuickPick(
        javaItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 50) + '...',
            snippet: i.snippet
        })),
        { placeHolder: 'Método JDBC / Crear ficheros / Transacciones' }
    );

    if (!pick) {
        logInfo('Selección de snippet Java cancelada');
        return;
    }

    const filesToCreate = [
        'DatabaseConnection',
        'BasicQueries',
        'QueryExecutor',
        'init.sql',
        'seed.sql'
    ];

    if (filesToCreate.some(f => pick.label.includes(f))) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Abre primero una carpeta de proyecto para crear el fichero.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '🗄️ Crear DatabaseConnection': {
                fileName = 'DatabaseConnection.java';
                break;
            }
            case '📝 Crear BasicQueries': {
                fileName = 'BasicQueries.java';
                break;
            }
            case '⚙️ Crear QueryExecutor': {
                fileName = 'QueryExecutor.java';
                break;
            }
            case '📄 Crear init.sql': {
                fileName = 'init.sql';
                break;
            }
            case '🌱 Crear seed.sql': {
                fileName = 'seed.sql';
                break;
            }
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
        logInfo(`Snippet Java insertado: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error insertando snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
