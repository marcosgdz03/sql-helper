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
            description: 'JDBC connection class'
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
            description: 'Base class for CRUD queries'
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
            description: 'Parameterized query executor'
        },
        {
            label: '📄 Create init.sql',
            snippet: `-- Table creation script
CREATE TABLE IF NOT EXISTS example (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);`,
            description: 'Initialization script'
        },
        {
            label: '🌱 Create seed.sql',
            snippet: `-- Seed insertion script
INSERT INTO example (name) VALUES ('data1'), ('data2');`,
            description: 'Seed data'
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
        }
    ];

    const pick = await vscode.window.showQuickPick(
        javaItems.map((i) => ({
            label: i.label,
            detail: i.description || i.snippet.substring(0, 50) + '...',
            snippet: i.snippet
        })),
        { placeHolder: 'JDBC methods / Create files / Transactions' }
    );

    if (!pick) {
        logInfo('Java snippet selection cancelled');
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
            vscode.window.showErrorMessage('Open a project folder first to create the file.');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        let fileName = '';
        switch (pick.label) {
            case '🗄️ Create DatabaseConnection': {
                fileName = 'DatabaseConnection.java';
                break;
            }
            case '📝 Create BasicQueries': {
                fileName = 'BasicQueries.java';
                break;
            }
            case '⚙️ Create QueryExecutor': {
                fileName = 'QueryExecutor.java';
                break;
            }
            case '📄 Create init.sql': {
                fileName = 'init.sql';
                break;
            }
            case '🌱 Create seed.sql': {
                fileName = 'seed.sql';
                break;
            }
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
        logInfo(`Java snippet inserted: ${pick.label}`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error inserting snippet: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}
