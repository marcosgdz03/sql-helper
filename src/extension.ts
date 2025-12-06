import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('SQL Helper activado');

    const disposable = vscode.commands.registerCommand('sql-helper.insertSnippet', async () => {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('Abre un archivo .java, .sql, .py o .js para usar esta extensión');
                return;
            }

            const language = editor.document.languageId;
            let mode: 'sql' | 'java' | 'python' | 'javascript' | undefined;

            if (language === 'sql') { mode = 'sql'; }
            else if (language === 'java') { mode = 'java'; }
            else if (language === 'python') { mode = 'python'; }
            else if (language === 'javascript' || language === 'typescript') { mode = 'javascript'; }
            else {
                const pick = await vscode.window.showQuickPick(
                    [
                        { label: 'Snippets SQL', mode: 'sql' as const },
                        { label: 'Métodos Java JDBC', mode: 'java' as const },
                        { label: 'Snippets Python (DB)', mode: 'python' as const },
                        { label: 'Snippets JavaScript (DB)', mode: 'javascript' as const }
                    ],
                    { placeHolder: 'Selecciona el tipo de snippet' }
                );
                if (!pick) { return; }
                mode = pick.mode;
            }

            /* ────────────────────────────
               SNIPPETS SQL
            ──────────────────────────── */
            if (mode === 'sql') {
                const sqlItems = [
                    { label: 'SELECT', snippet: 'SELECT * FROM ${1:tabla};' },
                    { label: 'SELECT WHERE', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:condicion};' },
                    { label: 'SELECT con JOIN', snippet: 'SELECT * FROM ${1:tabla1} JOIN ${2:tabla2} ON ${1:tabla1}.${3:id} = ${2:tabla2}.${4:id};' },
                    { label: 'SELECT con LIMIT', snippet: 'SELECT * FROM ${1:tabla} LIMIT ${2:10};' },
                    { label: 'SELECT con OFFSET', snippet: 'SELECT * FROM ${1:tabla} LIMIT ${2:10} OFFSET ${3:0};' },
                    { label: 'SELECT con ORDER BY', snippet: 'SELECT * FROM ${1:tabla} ORDER BY ${2:columna} ${3:ASC|DESC};' },
                    { label: 'SELECT COUNT', snippet: 'SELECT COUNT(*) as cantidad FROM ${1:tabla};' },
                    { label: 'SELECT SUM', snippet: 'SELECT SUM(${1:columna}) as total FROM ${2:tabla};' },
                    { label: 'SELECT AVG', snippet: 'SELECT AVG(${1:columna}) as promedio FROM ${2:tabla};' },
                    { label: 'SELECT MIN/MAX', snippet: 'SELECT MIN(${1:columna}) as minimo, MAX(${1:columna}) as maximo FROM ${2:tabla};' },
                    { label: 'SELECT GROUP BY', snippet: 'SELECT ${1:columna}, COUNT(*) FROM ${2:tabla} GROUP BY ${1:columna};' },
                    { label: 'SELECT DISTINCT', snippet: 'SELECT DISTINCT ${1:columna} FROM ${2:tabla};' },
                    { label: 'INSERT', snippet: 'INSERT INTO ${1:tabla} (${2:col}) VALUES (${3:val});' },
                    {
                        label: 'INSERT MULTIPLE VALUES',
                        snippet:
`INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2})
VALUES
(\${4:val1}, \${5:val2}),
(\${6:val1}, \${7:val2}),
(\${8:val1}, \${9:val2});`
                    },
                    { label: 'UPDATE', snippet: 'UPDATE ${1:tabla} SET ${2:columna} = ${3:valor} WHERE ${4:condicion};' },
                    { label: 'UPDATE múltiples columnas', snippet: 'UPDATE ${1:tabla} SET ${2:col1} = ${3:val1}, ${4:col2} = ${5:val2} WHERE ${6:condicion};' },
                    { label: 'DELETE', snippet: 'DELETE FROM ${1:tabla} WHERE ${2:condicion};' },
                    { label: 'DELETE ALL (cuidado)', snippet: 'DELETE FROM ${1:tabla};' },
                    {
                        label: 'CREATE TABLE (completo)',
                        snippet:
`CREATE TABLE \${1:tabla} (
    \${2:id} INT PRIMARY KEY AUTO_INCREMENT,
    \${3:nombre} VARCHAR(100) NOT NULL,
    \${4:email} VARCHAR(100) UNIQUE,
    \${5:activo} BOOLEAN DEFAULT TRUE,
    \${6:fecha_creacion} TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \${7:fecha_actualizacion} TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    \${2:id} INT PRIMARY KEY AUTO_INCREMENT,
    \${3:nombre} VARCHAR(50),
    \${4:fk_usuario} INT NOT NULL,
    FOREIGN KEY (\${4:fk_usuario}) REFERENCES \${5:usuario}(id) ON DELETE CASCADE
);`
                    },
                    { label: 'ALTER TABLE - ADD COLUMN', snippet: 'ALTER TABLE ${1:tabla} ADD COLUMN ${2:nueva_columna} ${3:TIPO};' },
                    { label: 'ALTER TABLE - MODIFY COLUMN', snippet: 'ALTER TABLE ${1:tabla} MODIFY COLUMN ${2:columna} ${3:TIPO};' },
                    { label: 'ALTER TABLE - CHANGE COLUMN', snippet: 'ALTER TABLE ${1:tabla} CHANGE COLUMN ${2:columna_vieja} ${3:columna_nueva} ${4:TIPO};' },
                    {
                        label: 'ALTER TABLE - ADD FOREIGN KEY',
                        snippet:
`ALTER TABLE \${1:tabla}
ADD CONSTRAINT \${2:fk_nombre}
FOREIGN KEY (\${3:columna})
REFERENCES \${4:tabla_ref}(\${5:id});`
                    },
                    { label: 'ALTER TABLE - DROP COLUMN', snippet: 'ALTER TABLE ${1:tabla} DROP COLUMN ${2:columna};' },
                    { label: 'ALTER TABLE - DROP CONSTRAINT', snippet: 'ALTER TABLE ${1:tabla} DROP CONSTRAINT ${2:nombre_constraint};' },
                    { label: 'CREATE INDEX', snippet: 'CREATE INDEX ${1:idx_nombre} ON ${2:tabla} (${3:columna});' },
                    { label: 'CREATE UNIQUE INDEX', snippet: 'CREATE UNIQUE INDEX ${1:idx_nombre} ON ${2:tabla} (${3:columna});' },
                    { label: 'DROP INDEX', snippet: 'DROP INDEX ${1:idx_nombre} ON ${2:tabla};' },
                    { label: 'DROP TABLE', snippet: 'DROP TABLE IF EXISTS ${1:tabla};' },
                    { label: 'TRUNCATE TABLE', snippet: 'TRUNCATE TABLE ${1:tabla};' },
                    {
                        label: 'LEFT JOIN',
                        snippet:
`SELECT *
FROM \${1:tabla1}
LEFT JOIN \${2:tabla2} ON \${1:tabla1}.\${3:id} = \${2:tabla2}.\${4:id};`
                    },
                    {
                        label: 'RIGHT JOIN',
                        snippet:
`SELECT *
FROM \${1:tabla1}
RIGHT JOIN \${2:tabla2} ON \${1:tabla1}.\${3:id} = \${2:tabla2}.\${4:id};`
                    },
                    {
                        label: 'INNER JOIN múltiple',
                        snippet:
`SELECT *
FROM \${1:tabla1}
INNER JOIN \${2:tabla2} ON \${1:tabla1}.\${3:id} = \${2:tabla2}.\${4:id}
INNER JOIN \${5:tabla3} ON \${2:tabla2}.\${6:id} = \${5:tabla3}.\${7:id};`
                    },
                    { label: 'UNION', snippet: 'SELECT ${1:columna} FROM ${2:tabla1} UNION SELECT ${3:columna} FROM ${4:tabla2};' },
                    { label: 'UNION ALL', snippet: 'SELECT ${1:columna} FROM ${2:tabla1} UNION ALL SELECT ${3:columna} FROM ${4:tabla2};' },
                    { label: 'HAVING', snippet: 'SELECT ${1:columna}, COUNT(*) FROM ${2:tabla} GROUP BY ${1:columna} HAVING COUNT(*) > ${3:1};' },
                    { label: 'BETWEEN', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} BETWEEN ${3:valor1} AND ${4:valor2};' },
                    { label: 'IN', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} IN (${3:val1}, ${4:val2}, ${5:val3});' },
                    { label: 'NOT IN', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} NOT IN (${3:val1}, ${4:val2});' },
                    { label: 'LIKE', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} LIKE \'${3:%patron%}\';' },
                    { label: 'NOT LIKE', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} NOT LIKE \'${3:%patron%}\';' },
                    { label: 'IS NULL', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} IS NULL;' },
                    { label: 'IS NOT NULL', snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:columna} IS NOT NULL;' },
                    { label: 'CASE WHEN', snippet: 'SELECT ${1:columna}, CASE WHEN ${2:condicion} THEN ${3:valor1} ELSE ${4:valor2} END FROM ${5:tabla};' },
                    { label: 'COALESCE', snippet: 'SELECT COALESCE(${1:columna}, ${2:valor_defecto}) FROM ${3:tabla};' },
                    { label: 'CAST', snippet: 'SELECT CAST(${1:columna} AS ${2:TIPO}) FROM ${3:tabla};' },
                    { label: 'SUBSTRING', snippet: 'SELECT SUBSTRING(${1:columna}, ${2:posicion}, ${3:longitud}) FROM ${4:tabla};' },
                    { label: 'CONCAT', snippet: 'SELECT CONCAT(${1:col1}, \' \', ${2:col2}) as nombre_completo FROM ${3:tabla};' },
                    { label: 'UPPER/LOWER', snippet: 'SELECT UPPER(${1:columna}) as mayuscula, LOWER(${2:columna}) as minuscula FROM ${3:tabla};' },
                    { label: 'TRIM', snippet: 'SELECT TRIM(${1:columna}) FROM ${2:tabla};' },
                    { label: 'LENGTH', snippet: 'SELECT LENGTH(${1:columna}) as longitud FROM ${2:tabla};' },
                    { label: 'REPLACE', snippet: 'SELECT REPLACE(${1:columna}, \'${2:buscar}\', \'${3:reemplazar}\') FROM ${4:tabla};' },
                    { label: 'ROUND', snippet: 'SELECT ROUND(${1:columna}, ${2:decimales}) FROM ${3:tabla};' },
                    { label: 'ABS', snippet: 'SELECT ABS(${1:columna}) as valor_absoluto FROM ${2:tabla};' },
                    { label: 'NOW()', snippet: 'SELECT NOW() as fecha_actual;' },
                    { label: 'CURDATE()', snippet: 'SELECT CURDATE() as fecha_hoy;' },
                    { label: 'DATE_ADD', snippet: 'SELECT DATE_ADD(${1:fecha}, INTERVAL ${2:1} ${3:DAY|MONTH|YEAR}) FROM ${4:tabla};' },
                    { label: 'DATE_SUB', snippet: 'SELECT DATE_SUB(${1:fecha}, INTERVAL ${2:1} ${3:DAY|MONTH|YEAR}) FROM ${4:tabla};' },
                    { label: 'DATEDIFF', snippet: 'SELECT DATEDIFF(${1:fecha1}, ${2:fecha2}) as diferencia_dias FROM ${3:tabla};' },
                    { label: 'YEAR/MONTH/DAY', snippet: 'SELECT YEAR(${1:columna}) as ano, MONTH(${1:columna}) as mes, DAY(${1:columna}) as dia FROM ${2:tabla};' }
                ];

                const pick = await vscode.window.showQuickPick(
                    sqlItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Snippet SQL' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               MÉTODOS JAVA JDBC
            ──────────────────────────── */
            if (mode === 'java') {
                const javaItems = [
                    {
                        label: 'Conexión JDBC',
                        snippet:
`import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    public static Connection getConnection() throws SQLException {
        String url = "jdbc:mysql://\${1:localhost}:3306/\${2:database}";
        String user = "\${3:root}";
        String password = "\${4:password}";
        return DriverManager.getConnection(url, user, password);
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
                        label: 'SELECT por ID',
                        snippet:
`public \${1:Entidad} getById\${1:Entidad}(\${2:Tipo} id) throws SQLException {
    String sql = "SELECT * FROM \${3:tabla} WHERE id = ?";
    \${1:Entidad} obj = null;

    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${4:TipoSQL}(1, id);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {
            obj = new \${1:Entidad}();
            // mapear campos
        }
    }
    return obj;
}`
                    },
                    {
                        label: 'SELECT con WHERE',
                        snippet:
`public List<\${1:Entidad}> findBy\${2:Campo}(\${3:Tipo} \${2:campo}) throws SQLException {
    List<\${1:Entidad}> list = new ArrayList<>();
    String sql = "SELECT * FROM \${4:tabla} WHERE \${2:campo} = ?";

    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${5:TipoSQL}(1, \${2:campo});
        ResultSet rs = ps.executeQuery();

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
    String sql = "INSERT INTO \${2:tabla} (\${3:col1}, \${4:col2}) VALUES (?, ?)";
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${5:TipoSQL}(1, obj.\${6:getCol1}());
        ps.set\${7:TipoSQL}(2, obj.\${8:getCol2}());
        return ps.executeUpdate();
    }
}`
                    },
                    {
                        label: 'UPDATE',
                        snippet:
`public int update\${1:Entidad}(\${1:Entidad} obj) throws SQLException {
    String sql = "UPDATE \${2:tabla} SET \${3:col1} = ?, \${4:col2} = ? WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${5:TipoSQL}(1, obj.\${6:getCol1}());
        ps.set\${7:TipoSQL}(2, obj.\${8:getCol2}());
        ps.set\${9:TipoSQL}(3, obj.getId());
        return ps.executeUpdate();
    }
}`
                    },
                    {
                        label: 'DELETE',
                        snippet:
`public int delete\${1:Entidad}(\${2:Tipo} id) throws SQLException {
    String sql = "DELETE FROM \${3:tabla} WHERE id = ?";
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.set\${4:TipoSQL}(1, id);
        return ps.executeUpdate();
    }
}`
                    },
                    {
                        label: 'COUNT',
                        snippet:
`public int count\${1:Entidad}() throws SQLException {
    String sql = "SELECT COUNT(*) as total FROM \${2:tabla}";

    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {

        if (rs.next()) {
            return rs.getInt("total");
        }
    }
    return 0;
}`
                    },
                    {
                        label: 'Transacción',
                        snippet:
`try (Connection conn = DatabaseConnection.getConnection()) {
    conn.setAutoCommit(false);
    try {
        // operación 1
        // operación 2
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
                    { placeHolder: 'Método JDBC' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               SNIPPETS PYTHON
            ──────────────────────────── */
            if (mode === 'python') {
                const pyItems = [
                    {
                        label: 'Conexión SQLite',
                        snippet:
`import sqlite3

conn = sqlite3.connect("\${1:database}.db")
cursor = conn.cursor()`
                    },
                    {
                        label: 'Conexión MySQL (mysql-connector)',
                        snippet:
`import mysql.connector

conn = mysql.connector.connect(
    host="\${1:localhost}",
    user="\${2:root}",
    password="\${3:password}",
    database="\${4:database}"
)
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
                        label: 'SELECT por ID',
                        snippet:
`cursor.execute("SELECT * FROM \${1:tabla} WHERE id = %s", (\${2:id},))
resultado = cursor.fetchone()
if resultado:
    print(resultado)`
                    },
                    {
                        label: 'SELECT con WHERE',
                        snippet:
`cursor.execute("SELECT * FROM \${1:tabla} WHERE \${2:columna} = %s", (\${3:valor},))
rows = cursor.fetchall()
for row in rows:
    print(row)`
                    },
                    {
                        label: 'SELECT con diccionario',
                        snippet:
`cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM \${1:tabla}")
for row in cursor:
    print(row[\"\${2:columna}\"])`
                    },
                    {
                        label: 'INSERT',
                        snippet:
`cursor.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (%s, %s)",
    (\${4:val1}, \${5:val2})
)
conn.commit()
print(f\"ID insertado: {cursor.lastrowid}\")`
                    },
                    {
                        label: 'INSERT múltiple',
                        snippet:
`datos = [
    (\${1:val1}, \${2:val2}),
    (\${3:val1}, \${4:val2}),
    (\${5:val1}, \${6:val2})
]
cursor.executemany(
    "INSERT INTO \${7:tabla} (\${8:col1}, \${9:col2}) VALUES (%s, %s)",
    datos
)
conn.commit()`
                    },
                    {
                        label: 'UPDATE',
                        snippet:
`cursor.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = %s WHERE id = %s",
    (\${3:valor}, \${4:id})
)
conn.commit()
print(f\"Filas afectadas: {cursor.rowcount}\")`
                    },
                    {
                        label: 'DELETE',
                        snippet:
`cursor.execute(
    "DELETE FROM \${1:tabla} WHERE id = %s",
    (\${2:id},)
)
conn.commit()
print(f\"Filas eliminadas: {cursor.rowcount}\")`
                    },
                    {
                        label: 'COUNT',
                        snippet:
`cursor.execute("SELECT COUNT(*) as total FROM \${1:tabla}")
resultado = cursor.fetchone()
print(f\"Total de registros: {resultado[0]}\")`
                    },
                    {
                        label: 'Transacción',
                        snippet:
`try:
    cursor.execute("INSERT INTO \${1:tabla} VALUES (%s, %s)", (\${2:val1}, \${3:val2}))
    conn.commit()
    print(\"Éxito\")
except Exception as e:
    conn.rollback()
    print(f\"Error: {e}\")`
                    },
                    {
                        label: 'Context Manager',
                        snippet:
`from contextlib import closing

with closing(conn.cursor()) as cursor:
    cursor.execute("SELECT * FROM \${1:tabla}")
    for row in cursor:
        print(row)`
                    },
                    {
                        label: 'SQLAlchemy - Conexión',
                        snippet:
`from sqlalchemy import create_engine

engine = create_engine('mysql+mysqlconnector://\${1:user}:\${2:password}@\${3:host}/\${4:database}')
conn = engine.connect()`
                    },
                    {
                        label: 'SQLAlchemy - Query',
                        snippet:
`from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()

# Consulta
resultados = session.query(\${1:Modelo}).all()
session.close()`
                    }
                ];

                const pick = await vscode.window.showQuickPick(
                    pyItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Snippet Python DB' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

            /* ────────────────────────────
               SNIPPETS JAVASCRIPT
            ──────────────────────────── */
            if (mode === 'javascript') {
                const jsItems = [
                    {
                        label: 'Conexión MySQL (mysql2/promise)',
                        snippet:
`import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "\${1:localhost}",
    user: "\${2:root}",
    password: "\${3:password}",
    database: "\${4:database}"
});

export default pool;`
                    },
                    {
                        label: 'Conexión PostgreSQL (pg)',
                        snippet:
`import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: '\${1:postgres}',
    password: '\${2:password}',
    host: '\${3:localhost}',
    port: \${4:5432},
    database: '\${5:database}'
});

export default pool;`
                    },
                    {
                        label: 'SELECT (async/await)',
                        snippet:
`const [rows] = await pool.query("SELECT * FROM \${1:tabla}");
console.log(rows);`
                    },
                    {
                        label: 'SELECT por ID',
                        snippet:
`const [rows] = await pool.query(
    "SELECT * FROM \${1:tabla} WHERE id = ?",
    [\${2:id}]
);
if (rows.length > 0) console.log(rows[0]);`
                    },
                    {
                        label: 'SELECT con WHERE',
                        snippet:
`const [rows] = await pool.query(
    "SELECT * FROM \${1:tabla} WHERE \${2:columna} = ?",
    [\${3:valor}]
);
console.log(rows);`
                    },
                    {
                        label: 'INSERT',
                        snippet:
`const [result] = await pool.execute(
    "INSERT INTO \${1:tabla} (\${2:col1}, \${3:col2}) VALUES (?, ?)",
    [\${4:val1}, \${5:val2}]
);
console.log("Insert ID:", result.insertId);`
                    },
                    {
                        label: 'INSERT múltiple',
                        snippet:
`const data = [
    [\${1:val1}, \${2:val2}],
    [\${3:val1}, \${4:val2}],
    [\${5:val1}, \${6:val2}]
];

for (const row of data) {
    await pool.execute(
        "INSERT INTO \${7:tabla} (\${8:col1}, \${9:col2}) VALUES (?, ?)",
        row
    );
}`
                    },
                    {
                        label: 'UPDATE',
                        snippet:
`const [result] = await pool.execute(
    "UPDATE \${1:tabla} SET \${2:columna} = ? WHERE id = ?",
    [\${3:valor}, \${4:id}]
);
console.log(\"Filas afectadas:\", result.affectedRows);`
                    },
                    {
                        label: 'DELETE',
                        snippet:
`const [result] = await pool.execute(
    "DELETE FROM \${1:tabla} WHERE id = ?",
    [\${2:id}]
);
console.log(\"Filas eliminadas:\", result.affectedRows);`
                    },
                    {
                        label: 'COUNT',
                        snippet:
`const [rows] = await pool.query(
    "SELECT COUNT(*) as total FROM \${1:tabla}"
);
console.log(\"Total:\", rows[0].total);`
                    },
                    {
                        label: 'CREATE TABLE',
                        snippet:
`await pool.execute(\`
CREATE TABLE IF NOT EXISTS \${1:tabla} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    \${2:campo} VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)\`
);`
                    },
                    {
                        label: 'Transacción',
                        snippet:
`const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    // operación 1
    await conn.execute("INSERT INTO \${1:tabla} VALUES (?, ?)", [\${2:val1}, \${3:val2}]);
    // operación 2
    await conn.commit();
} catch (e) {
    await conn.rollback();
    console.error(\"Error:\", e);
} finally {
    conn.release();
}`
                    },
                    {
                        label: 'Función SELECT reutilizable',
                        snippet:
`async function getAll(table) {
    try {
        const [rows] = await pool.query(\`SELECT * FROM \${table}\`);
        return rows;
    } catch (error) {
        console.error(\"Error:\", error);
        return [];
    }
}

const data = await getAll('\${1:tabla}');
console.log(data);`
                    },
                    {
                        label: 'Sequelize - Conexión',
                        snippet:
`import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: '\${1:mysql}',
    host: '\${2:localhost}',
    username: '\${3:root}',
    password: '\${4:password}',
    database: '\${5:database}'
});`
                    },
                    {
                        label: 'Sequelize - Consulta',
                        snippet:
`const users = await User.findAll();
const user = await User.findByPk(\${1:id});
const filtered = await User.findAll({ where: { status: 'active' } });`
                    }
                ];

                const pick = await vscode.window.showQuickPick(
                    jsItems.map(i => ({ label: i.label, detail: i.snippet })),
                    { placeHolder: 'Snippet JavaScript DB' }
                );
                if (!pick) { return; }
                await editor.insertSnippet(new vscode.SnippetString(pick.detail!));
                return;
            }

        } catch (err) {
            console.error('Error en la extensión:', err);
            vscode.window.showErrorMessage('Error en SQL Helper');
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
