import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { logInfo, logError } from '../utils/helpers';

interface SnippetItem {
    label: string;
    snippet: string;
    description?: string;
    fileName?: string; // Nombre del archivo opcional
}

export async function showJavaSnippets(editor: vscode.TextEditor) {
    const javaItems: SnippetItem[] = [
        {
            label: '🗄️ Create DatabaseConnection',
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
            description: 'JDBC connection class',
            fileName: 'DatabaseConnection.java'
        },
        {
            label: '📝 Create BasicQueries',
            snippet: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BasicQueries {
    // Basic CRUD methods here...
}`,
            description: 'Base class for CRUD queries',
            fileName: 'BasicQueries.java'
        },
        {
            label: '⚙️ Create QueryExecutor',
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
            description: 'Parameterized query executor',
            fileName: 'QueryExecutor.java'
        },
        {
            label: '📄 Create init.sql',
            snippet: `-- Table creation script
CREATE TABLE IF NOT EXISTS example (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);`,
            description: 'Initialization script',
            fileName: 'init.sql'
        },
        {
            label: '🌱 Create seed.sql',
            snippet: `-- Seed insertion script
INSERT INTO example (name) VALUES ('data1'), ('data2');`,
            description: 'Seed data',
            fileName: 'seed.sql'
        },
        {
            label: '🔄 Transaction (commit/rollback)',
            snippet: `try (Connection conn = DatabaseConnection.getConnection()) {
    try {
        conn.setAutoCommit(false);
        // execute queries
        conn.commit();
    } catch (SQLException e) {
        conn.rollback();
        throw e;
    }
}`,
            description: 'Transaction handling'
        }, {
            label: '🏗️ Create GenericDAO',
            snippet: `import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class \${1:Entity}DAO<T> {

    private static final Logger LOGGER = Logger.getLogger(\${1:Entity}DAO.class.getName());
    private final Connection conn;

    public \${1:Entity}DAO(Connection conn) {
        this.conn = conn;
    }

    public Optional<T> findById(int id) {
        String sql = "SELECT * FROM \${2:table} WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                // Mapear ResultSet a objeto T
                return Optional.of(mapResultSet(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in findById", e);
        }
        return Optional.empty();
    }

    public List<T> findAll() {
        List<T> results = new ArrayList<>();
        String sql = "SELECT * FROM \${2:table}";
        try (PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                results.add(mapResultSet(rs));
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in findAll", e);
        }
        return results;
    }

    public boolean insert(T entity) {
        String sql = "INSERT INTO \${2:table} (\${3:columns}) VALUES (\${4:valuesPlaceholders})";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindParams(ps, entity);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in insert", e);
        }
        return false;
    }

    public boolean update(int id, T entity) {
        String sql = "UPDATE \${2:table} SET \${3:setClause} WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            bindParams(ps, entity);
            ps.setInt(\${4:paramIndex}, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in update", e);
        }
        return false;
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM \${2:table} WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error in delete", e);
        }
        return false;
    }

    // Métodos auxiliares
    private T mapResultSet(ResultSet rs) {
        // TODO: Mapear ResultSet a objeto T
        return null;
    }

    private void bindParams(PreparedStatement ps, T entity) throws SQLException {
        // TODO: Asignar valores de entity a PreparedStatement
    }
}`,
            description: 'Generic DAO with findById, findAll, insert, update, delete, logging',
            fileName: 'GenericDAO.java'
        }

    ];

    const pick = await vscode.window.showQuickPick(
        javaItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 50) + '...',
            snippet: i.snippet,
            fileName: i.fileName
        })),
        { placeHolder: 'JDBC methods / Create files / Transactions' }
    );

    if (!pick) {
        logInfo('Java snippet selection cancelled');
        return;
    }

    // Si tiene un fileName definido, creamos el archivo
    if (pick.fileName) {
        await createFileFromSnippet(pick.fileName, pick.snippet);
        return;
    }

    // Insertar snippet directamente en editor
    try {
        await editor.insertSnippet(new vscode.SnippetString(pick.snippet));
        logInfo(`Java snippet inserted: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error inserting snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error inserting snippet: ${errorMsg}`);
    }
}

async function createFileFromSnippet(fileName: string, content: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('Open a project folder first to create the file.');
        return;
    }

    let folderPath: string;

    if (workspaceFolders.length === 1) {
        folderPath = workspaceFolders[0].uri.fsPath;
    } else {
        // Si hay varias carpetas, dejar que el usuario elija
        const pick = await vscode.window.showQuickPick(
            workspaceFolders.map(f => ({ label: f.name, path: f.uri.fsPath })),
            { placeHolder: 'Select the folder to create the file in' }
        );
        if (!pick) {
            vscode.window.showInformationMessage('File creation cancelled.');
            return;
        }
        folderPath = pick.path;
    }

    const filePath = path.join(folderPath, fileName);

    if (fs.existsSync(filePath)) {
        vscode.window.showWarningMessage(`${fileName} already exists in ${folderPath}.`);
        return;
    }

    try {
        fs.writeFileSync(filePath, content, 'utf8');
        const doc = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(doc);
        logInfo(`File ${fileName} created successfully in ${folderPath}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error creating file ${fileName}: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error creating file: ${errorMsg}`);
    }
}

