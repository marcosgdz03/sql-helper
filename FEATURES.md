# 🎯 SQL Helper - Características Detalladas

## Índice
1. [Snippets SQL](#snippets-sql)
2. [Snippets Java JDBC](#snippets-java-jdbc)
3. [Snippets Python](#snippets-python)
4. [Snippets JavaScript](#snippets-javascript)
5. [Analizador SQL](#analizador-sql)
6. [Formateador SQL](#formateador-sql)

---

## 📊 Snippets SQL

### Operaciones SELECT (15+ snippets)

#### 📖 SELECT Básico
```sql
SELECT * FROM ${1:tabla};
```

#### 📖 SELECT con WHERE
```sql
SELECT * FROM ${1:tabla} WHERE ${2:condición};
```

#### 📖 SELECT con ORDER BY
```sql
SELECT * FROM ${1:tabla} ORDER BY ${2:columna} DESC LIMIT ${3:10};
```

#### 📖 SELECT DISTINCT
```sql
SELECT DISTINCT ${1:columna} FROM ${2:tabla};
```

#### 📖 SELECT GROUP BY
```sql
SELECT ${1:columna}, COUNT(*) FROM ${2:tabla} GROUP BY ${1:columna};
```

#### ⭐ SELECT con LIMIT OFFSET
```sql
SELECT * FROM ${1:tabla} LIMIT ${2:10} OFFSET ${3:0};
```

#### ⭐ SELECT LEFT JOIN
```sql
SELECT a.*, b.*
FROM ${1:tabla1} a
LEFT JOIN ${2:tabla2} b ON a.${3:id} = b.${4:id};
```

#### ⭐ SELECT INNER JOIN
```sql
SELECT a.*, b.*
FROM ${1:tabla1} a
INNER JOIN ${2:tabla2} b ON a.${3:id} = b.${4:id};
```

#### ⭐ SELECT UNION
```sql
SELECT ${1:col1}} FROM ${2:tabla1}
UNION
SELECT ${3:col1}} FROM ${4:tabla2};
```

#### ⭐ SELECT con CASE WHEN
```sql
SELECT 
    id,
    CASE 
        WHEN ${1:condición1} THEN '${2:valor1}'
        WHEN ${3:condición2} THEN '${4:valor2}'
        ELSE '${5:otro}'
    END as ${6:resultado}
FROM ${7:tabla};
```

#### ⭐ SELECT Subquery
```sql
SELECT * FROM (
    SELECT ${1:columnas}} FROM ${2:tabla}
) AS ${3:subquery}}
WHERE ${4:condición}};
```

---

### Operaciones INSERT (8+ snippets)

#### ✏️ INSERT Simple
```sql
INSERT INTO ${1:tabla}} (${2:col1}}, ${3:col2}}) VALUES ('${4:val1}}', '${5:val2}}');
```

#### ✏️ INSERT Múltiple
```sql
INSERT INTO ${1:tabla}} (${2:col1}}, ${3:col2}}) VALUES
('${4:val1}}', '${5:val2}}'),
('${6:val1}}', '${7:val2}}'),
('${8:val1}}', '${9:val2}}');
```

#### ✏️ INSERT SELECT
```sql
INSERT INTO ${1:tabla_destino}} (${2:col1}}, ${3:col2}})
SELECT ${4:col1}}, ${5:col2}} FROM ${6:tabla_origen}};
```

#### ✏️ INSERT IGNORE
```sql
INSERT IGNORE INTO ${1:tabla}} (${2:col1}}, ${3:col2}}) VALUES ('${4:val1}}', '${5:val2}}');
```

#### ✏️ INSERT ON DUPLICATE KEY
```sql
INSERT INTO ${1:tabla}} (${2:col1}}, ${3:col2}}) VALUES ('${4:val1}}', '${5:val2}}')
ON DUPLICATE KEY UPDATE ${3:col2}} = '${5:val2}}';
```

---

### Operaciones UPDATE (6+ snippets)

#### ✏️ UPDATE Simple
```sql
UPDATE ${1:tabla}} SET ${2:columna}} = '${3:valor}}' WHERE ${4:id}} = ${5:1}};
```

#### ✏️ UPDATE Múltiples Columnas
```sql
UPDATE ${1:tabla}}
SET ${2:col1}} = '${3:val1}}', ${4:col2}} = '${5:val2}}'
WHERE ${6:condición}};
```

#### ✏️ UPDATE con Función
```sql
UPDATE ${1:tabla}}
SET ${2:columna}} = CONCAT(${2:columna}}, '${3:sufijo}}')
WHERE ${4:condición}};
```

#### ✏️ UPDATE con JOIN
```sql
UPDATE ${1:tabla1}} a
INNER JOIN ${2:tabla2}} b ON a.${3:id}} = b.${4:id}}
SET a.${5:columna}} = b.${6:valor}};
```

---

### Operaciones DELETE (5+ snippets)

#### ✏️ DELETE Simple
```sql
DELETE FROM ${1:tabla}} WHERE ${2:id}} = ${3:1}};
```

#### ✏️ DELETE con JOIN
```sql
DELETE a FROM ${1:tabla1}} a
INNER JOIN ${2:tabla2}} b ON a.${3:id}} = b.${4:id}};
```

#### ✏️ DELETE en Cascada
```sql
DELETE FROM ${1:tabla}}
WHERE ${2:id}} IN (SELECT ${2:id}} FROM ${3:otra_tabla}});
```

---

### Definición de Datos (DDL) (10+ snippets)

#### 🏗️ CREATE TABLE Simple
```sql
CREATE TABLE IF NOT EXISTS ${1:tabla}} (
    ${2:id}} INT PRIMARY KEY AUTO_INCREMENT,
    ${3:nombre}} VARCHAR(100) NOT NULL,
    ${4:email}} VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 🏗️ CREATE TABLE con Foreign Key
```sql
CREATE TABLE IF NOT EXISTS ${1:tabla}} (
    ${2:id}} INT PRIMARY KEY AUTO_INCREMENT,
    ${3:parent_id}} INT NOT NULL,
    FOREIGN KEY (${3:parent_id}}) REFERENCES ${4:parent_tabla}}(id)
    ON DELETE CASCADE
);
```

#### 🏗️ ALTER TABLE ADD COLUMN
```sql
ALTER TABLE ${1:tabla}} 
ADD COLUMN ${2:nueva_col}} VARCHAR(100) AFTER ${3:col_existente}};
```

#### 🏗️ ALTER TABLE MODIFY COLUMN
```sql
ALTER TABLE ${1:tabla}}
MODIFY COLUMN ${2:columna}} INT NOT NULL DEFAULT 0;
```

#### 🏗️ CREATE INDEX
```sql
CREATE INDEX idx_${1:nombre}} ON ${2:tabla}}(${3:columna}});
```

#### 🏗️ CREATE UNIQUE INDEX
```sql
CREATE UNIQUE INDEX idx_unique_${1:nombre}} ON ${2:tabla}}(${3:columna}});
```

#### 🏗️ DROP TABLE
```sql
DROP TABLE IF EXISTS ${1:tabla}};
```

#### 🏗️ TRUNCATE TABLE
```sql
TRUNCATE TABLE ${1:tabla}};
```

---

### Funciones String (8+ snippets)

#### 🔤 CONCAT
```sql
SELECT CONCAT(${1:col1}}, ' ', ${2:col2}}) as ${3:resultado}} FROM ${4:tabla}};
```

#### 🔤 SUBSTRING
```sql
SELECT SUBSTRING(${1:columna}}, ${2:posición}}, ${3:longitud}}) FROM ${4:tabla}};
```

#### 🔤 UPPER / LOWER
```sql
SELECT UPPER(${1:columna}}) as ${2:resultado}} FROM ${3:tabla}};
```

#### 🔤 REPLACE
```sql
SELECT REPLACE(${1:columna}}, '${2:buscar}}', '${3:reemplazar}}') FROM ${4:tabla}};
```

#### 🔤 LENGTH
```sql
SELECT * FROM ${1:tabla}} WHERE LENGTH(${2:columna}}) > ${3:10}};
```

#### 🔤 TRIM
```sql
SELECT TRIM(${1:columna}}) FROM ${2:tabla}};
```

---

### Funciones de Fecha (6+ snippets)

#### 📅 NOW / CURRENT_TIMESTAMP
```sql
INSERT INTO ${1:tabla}} (${2:columna}}) VALUES (NOW());
```

#### 📅 DATE_ADD
```sql
SELECT DATE_ADD(NOW(), INTERVAL ${1:1}} DAY) as ${2:mañana}};
```

#### 📅 DATE_SUB
```sql
SELECT * FROM ${1:tabla}} 
WHERE ${2:fecha}} > DATE_SUB(NOW(), INTERVAL ${3:7}} DAY);
```

#### 📅 DATEDIFF
```sql
SELECT DATEDIFF(${1:fecha2}}, ${2:fecha1}}) as ${3:días_diferencia}} FROM ${4:tabla}};
```

#### 📅 DATE_FORMAT
```sql
SELECT DATE_FORMAT(${1:columna}}, '${2:%d/%m/%Y}}') FROM ${3:tabla}};
```

---

## ☕ Snippets Java JDBC

### 🔗 Conexión

#### Pool de Conexiones (HikariCP)
```java
public class DatabaseConnection {
    private static HikariDataSource dataSource;
    
    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:mysql://localhost:3306/database");
        config.setUsername("user");
        config.setPassword("password");
        config.setMaximumPoolSize(10);
        dataSource = new HikariDataSource(config);
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
```

### ✏️ SELECT

#### SELECT Todos
```java
public List<User> getAllUsers() throws SQLException {
    List<User> list = new ArrayList<>();
    String sql = "SELECT * FROM users";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
        
        while (rs.next()) {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            list.add(user);
        }
    }
    return list;
}
```

#### SELECT por ID
```java
public User getUserById(int id) throws SQLException {
    String sql = "SELECT * FROM users WHERE id = ?";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setInt(1, id);
        
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setName(rs.getString("name"));
                return user;
            }
        }
    }
    return null;
}
```

#### SELECT con Condiciones
```java
public List<User> searchUsers(String searchTerm) throws SQLException {
    List<User> list = new ArrayList<>();
    String sql = "SELECT * FROM users WHERE name LIKE ? OR email LIKE ?";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        String term = "%" + searchTerm + "%";
        ps.setString(1, term);
        ps.setString(2, term);
        
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                // mapear resultados
            }
        }
    }
    return list;
}
```

### ✏️ INSERT

#### INSERT Simple
```java
public boolean insertUser(User user) throws SQLException {
    String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setString(1, user.getName());
        ps.setString(2, user.getEmail());
        
        return ps.executeUpdate() > 0;
    }
}
```

#### INSERT Múltiple (Batch)
```java
public void insertUsersInBatch(List<User> users) throws SQLException {
    String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        for (User user : users) {
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.addBatch();
        }
        
        ps.executeBatch();
    }
}
```

### ✏️ UPDATE

#### UPDATE Simple
```java
public boolean updateUser(User user) throws SQLException {
    String sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setString(1, user.getName());
        ps.setString(2, user.getEmail());
        ps.setInt(3, user.getId());
        
        return ps.executeUpdate() > 0;
    }
}
```

### ✏️ DELETE

#### DELETE Simple
```java
public boolean deleteUser(int id) throws SQLException {
    String sql = "DELETE FROM users WHERE id = ?";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setInt(1, id);
        return ps.executeUpdate() > 0;
    }
}
```

### 🔒 Transacciones

#### Transacción Completa
```java
public void transferMoney(int fromId, int toId, double amount) throws SQLException {
    String debit = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
    String credit = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
    
    try (Connection conn = DatabaseConnection.getConnection()) {
        conn.setAutoCommit(false);
        
        try (PreparedStatement psDebit = conn.prepareStatement(debit);
             PreparedStatement psCredit = conn.prepareStatement(credit)) {
            
            psDebit.setDouble(1, amount);
            psDebit.setInt(2, fromId);
            psDebit.executeUpdate();
            
            psCredit.setDouble(1, amount);
            psCredit.setInt(2, toId);
            psCredit.executeUpdate();
            
            conn.commit();
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        }
    }
}
```

---

## 🐍 Snippets Python

### 🔗 Conexión

#### SQLite
```python
import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()
```

#### MySQL
```python
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="user",
    password="password",
    database="database"
)
cursor = conn.cursor()
```

#### PostgreSQL
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    user="user",
    password="password",
    database="database"
)
cursor = conn.cursor()
```

### ✏️ SELECT

#### SELECT Todos
```python
def get_all_users():
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return users
```

#### SELECT Uno
```python
def get_user_by_id(user_id):
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    return user
```

#### SELECT con Condiciones
```python
def search_users(search_term):
    query = "SELECT * FROM users WHERE name LIKE %s"
    cursor.execute(query, (f"%{search_term}%",))
    return cursor.fetchall()
```

### ✏️ INSERT

#### INSERT Simple
```python
def insert_user(name, email):
    sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
    cursor.execute(sql, (name, email))
    conn.commit()
    return cursor.lastrowid
```

#### INSERT Múltiple
```python
def insert_users_batch(users):
    sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
    cursor.executemany(sql, users)
    conn.commit()
```

### ✏️ UPDATE

#### UPDATE Simple
```python
def update_user(user_id, name, email):
    sql = "UPDATE users SET name = %s, email = %s WHERE id = %s"
    cursor.execute(sql, (name, email, user_id))
    conn.commit()
    return cursor.rowcount
```

### ✏️ DELETE

#### DELETE Simple
```python
def delete_user(user_id):
    sql = "DELETE FROM users WHERE id = %s"
    cursor.execute(sql, (user_id,))
    conn.commit()
    return cursor.rowcount
```

### 🔒 Transacciones

#### Transacción con Commit/Rollback
```python
def transfer_money(from_id, to_id, amount):
    try:
        cursor.execute(
            "UPDATE accounts SET balance = balance - %s WHERE id = %s",
            (amount, from_id)
        )
        cursor.execute(
            "UPDATE accounts SET balance = balance + %s WHERE id = %s",
            (amount, to_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
```

### 🎯 Context Manager

#### With Statement
```python
def get_users_safe():
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM users")
            return cursor.fetchall()
    finally:
        conn.close()
```

### 📦 SQLAlchemy

#### ORM Básico
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql://user:password@localhost/database")
Session = sessionmaker(bind=engine)
session = Session()

users = session.query(User).all()
session.close()
```

---

## 📜 Snippets JavaScript

### 🔗 Conexión

#### MySQL2/Promise
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

#### PostgreSQL (pg)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'database',
    password: 'password',
    port: 5432,
});
```

### ✏️ SELECT

#### SELECT Todos (Async/Await)
```javascript
async function getAllUsers() {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return rows;
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}
```

#### SELECT por ID
```javascript
async function getUserById(userId) {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );
        return rows[0] || null;
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}
```

### ✏️ INSERT

#### INSERT Simple
```javascript
async function insertUser(name, email) {
    try {
        const [result] = await pool.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );
        return result.insertId;
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}
```

#### INSERT Múltiple
```javascript
async function insertUsersBatch(users) {
    try {
        for (const user of users) {
            await pool.execute(
                "INSERT INTO users (name, email) VALUES (?, ?)",
                [user.name, user.email]
            );
        }
    } catch (error) {
        console.error("Database error:", error);
        throw error;
    }
}
```

### 🔒 Transacciones

#### Transacción con Rollback
```javascript
async function transferMoney(fromId, toId, amount) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        await conn.execute(
            "UPDATE accounts SET balance = balance - ? WHERE id = ?",
            [amount, fromId]
        );
        
        await conn.execute(
            "UPDATE accounts SET balance = balance + ? WHERE id = ?",
            [amount, toId]
        );
        
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}
```

---

## 🔍 Analizador SQL

### Tipos de Errores Detectados

#### 1. Falta Punto y Coma
```sql
SELECT * FROM users
❌ Error: Falta punto y coma (;)
✅ Sugerencia: Añade ; al final de la sentencia SQL
```

#### 2. Comillas No Balanceadas
```java
String sql = "INSERT INTO users VALUES ('John
❌ Error: Comilla sin cerrar
✅ Sugerencia: Cierra la comilla al final de la cadena
```

#### 3. Paréntesis Desbalanceados
```sql
SELECT * FROM users WHERE (id = 1 AND name = 'John'
❌ Error: Paréntesis sin cerrar
✅ Sugerencia: Añade ) para cerrar el paréntesis
```

#### 4. SELECT sin FROM
```sql
SELECT id, name, email
❌ Error: SELECT sin FROM
✅ Sugerencia: Especifica la tabla con FROM
```

#### 5. INSERT sin VALUES
```sql
INSERT INTO users (id, name) 
❌ Error: INSERT sin VALUES
✅ Sugerencia: Añade VALUES (...) después del listado de columnas
```

#### 6. UPDATE/DELETE sin WHERE (PELIGROSO)
```sql
UPDATE users SET status = 'inactive'
❌ ⚠️ Error: UPDATE SIN WHERE
✅ Sugerencia: Añade WHERE para evitar actualizar todos los registros
```

#### 7. Palabra Reservada como Nombre
```sql
SELECT select, order FROM users WHERE select = 1
❌ Error: "select" es palabra reservada de SQL
✅ Sugerencia: Usa backticks para escapar: `select`
```

#### 8. Sintaxis Inválida
```sql
SLECT * FROM users
❌ Error: Sintaxis SQL inválida
✅ Sugerencia: Verifica la ortografía de keywords SQL
```

### Uso en Different Lenguajes

#### En .sql
```sql
-- Archivo: queries.sql
UPDATE users SET active = 0
-- Ctrl+Alt+A → Detecta UPDATE sin WHERE
```

#### En .java
```java
// Archivo: Database.java
String sql = "SELECT id FROM users"  // Falta ;
// Ctrl+Alt+A → Detecta error
```

#### En .js
```javascript
// Archivo: queries.js
const sql = `UPDATE products SET price = 100
// Ctrl+Alt+A → Detecta UPDATE sin WHERE y falta ;
```

#### En .py
```python
# Archivo: db.py
query = "DELETE FROM logs"  # Falta WHERE
# Ctrl+Alt+A → Detecta DELETE sin WHERE
```

---

## 🎨 Formateador SQL

### Transformaciones

#### Entrada Compacta
```sql
SELECT a.id,a.name,b.email FROM users a INNER JOIN profiles b ON a.id=b.user_id WHERE a.active=1 ORDER BY a.created_at DESC LIMIT 10
```

#### Salida Formateada
```sql
SELECT a.id, a.name, b.email
FROM users a
INNER JOIN profiles b ON a.id = b.user_id
WHERE a.active = 1
ORDER BY a.created_at DESC
LIMIT 10
```

### Keywords que Generan Saltos de Línea
- `SELECT` - Inicio de consulta
- `FROM` - Especifica tabla
- `WHERE` - Filtros
- `JOIN` / `INNER JOIN` / `LEFT JOIN` / `RIGHT JOIN` - Uniones
- `ON` - Condiciones de join
- `GROUP BY` - Agrupación
- `HAVING` - Filtro de grupos
- `ORDER BY` - Ordenamiento
- `LIMIT` - Limitación de resultados
- `UNION` - Combinación de consultas
- `INSERT INTO` - Inserción
- `VALUES` - Valores a insertar
- `UPDATE` - Actualización
- `SET` - Asignaciones
- `DELETE FROM` - Eliminación

### Limpieza Automática
- Elimina espacios en blanco excesivos
- Mantiene indentación legible
- Preserva comillas y strings
- Mantiene comentarios

---

## 🔧 Configuración

### Personalizar Keybindings

Abre `Preferences: Keyboard Shortcuts` y busca "SQL Helper":

```json
{
    "key": "ctrl+alt+shift+s",
    "command": "sql-helper.insertSnippet",
    "when": "editorTextFocus && editorLangId == sql"
},
{
    "key": "ctrl+shift+a",
    "command": "sql-helper.analyzeSql",
    "when": "editorTextFocus"
},
{
    "key": "ctrl+shift+f",
    "command": "sql-helper.formatSql",
    "when": "editorTextFocus"
}
```

---

## 📞 Soporte

Para reportar errores o sugerir nuevas características:
- 🐛 [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)
- 💡 [GitHub Discussions](https://github.com/marcosgdz03/sql-helper)

---

**¡Espera tu feedback para mejorar aún más! 🚀**
