import * as vscode from 'vscode';

export async function showJavaSnippets(editor: vscode.TextEditor) {
    const javaItems = [
        {
            label: 'Conexión JDBC',
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
            label: 'SELECT (List)',
            snippet:
`public List<\${1:Entidad}> getAll\${1:Entidad}() throws SQLException {
    List<\${1:Entidad}> list = new ArrayList<>();
    String sql = "SELECT * FROM \${2:tabla}";

    try (Connection conn = DatabaseConnection.getConnection();
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
    try (Connection conn = DatabaseConnection.getConnection();
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
    try (Connection conn = DatabaseConnection.getConnection();
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
}
