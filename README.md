# 🗄️ SQL Helper

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Rating](https://img.shields.io/visual-studio-marketplace/rating/marcosgdz03.sql-helper?label=rating)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#review-details) [![GitHub stars](https://img.shields.io/github/stars/marcosgdz03/sql-helper?style=social)](https://github.com/marcosgdz03/sql-helper/stargazers) [![License](https://img.shields.io/github/license/marcosgdz03/sql-helper)](./LICENSE.md)

**SQL Helper** is an advanced **Visual Studio Code** extension that accelerates database development by providing:

1. **70+ professional snippets** pfor SQL, Java JDBC, Python, and JavaScript/TypeScript
2. **Smart SQL Analyzer** that detects errors in any language
3. **SQL Formatter** for automatic readability improvement

Generate **production-ready code** in seconds — from complex SQL queries to full CRUD methods with transactions and error handling.

---

## 🎯 Características Principales

### 📊 **Snippets SQL** (40+ templates)
- **Selection**: Basic SELECT, WHERE, LIMIT, OFFSET, ORDER BY, GROUP BY, DISTINCT, JOINs
- **Manipulation**: INSERT (single & multiple), UPDATE, DELETE
- **Structure**: CREATE TABLE (con tipos de datos avanzados), IF NOT EXISTS, Foreign Keys
- **DDL**: ALTER TABLE (ADD/DROP/MODIFY columns), CREATE INDEX, DROP TABLE
- **Advanced Queries**: JOINs (LEFT, RIGHT, INNER), UNION, CASE WHEN, Subqueries
- **Functions**: String (CONCAT, SUBSTRING, UPPER/LOWER, REPLACE), Dates (NOW, DATE_ADD, DATEDIFF)
- **BD**: Views, Triggers, Stored Procedures
- **Utility**: file generator, backup/restore

### ☕ **Java JDBC** (9+ methods)
- JDBC connection with connection pool
- SELECT with List, SELECT by ID, SELECT with conditions
- INSERT, UPDATE, DELETE using PreparedStatement
- COUNT, full transactions
- Exception handling and try-with-resources

### 🐍 **Python** (15+ snippets)
- SQLite, MySQL (mysql-connector), PostgreSQL connections
- SELECT (fetchall, fetchone), INSERT (single & multiple)
- UPDATE, DELETE with affected rows
- Transactions with commit/rollback
- Context managers, SQLAlchemy ORM

### 📜 **JavaScript/TypeScript** (15+ snippets)
- MySQL (mysql2/promise), PostgreSQL (pg) connections
- SELECT, INSERT, UPDATE, DELETE with async/await
- Reusable methods, COUNT
- Runtime CREATE TABLE
- Transactions with rollback
- ORM integration (Sequelize)

### 🔍 **SQL Analyzer (NEW)** — Automatically detects errors
Detects **8+ error types**:

- Missing semicolon (;)

- Unbalanced quotes (', ")

- Unbalanced parentheses

- SELECT without FROM

- INSERT without VALUES

- **UPDATE/DELETE WITHOUT WHERE (dangerous) ⚠️**

- Reserved keywords used as identifiers

Supports multiple languages:

- `.sql` — Raw SQL

- `.java` — Strings: `"SELECT * FROM..."`

- `.js/.ts` — Template literals: const sql = `SELECT...`

- `.py` — Strings: `sql = "SELECT..."`

Displays errors in:

- Problems Panel (native VS Code integration)

- Interactive QuickPick (select for details)

- Output Channel (detailed logs)

### 🎨 **SQL Formatter (NEW)** — Beautify queries
- Automatically reformats SQL
- Adds line breaks to keywords (SELECT, FROM, WHERE, JOIN...)
- Cleans excessive whitespace
- Works in all supported languages

### ✨ **Additional Features**
- Automatic language detection
- Smart search with descriptions
- Emoji-based categorization (📖 SELECT, ✏️ CRUD, 🏗️ DDL…)
- Full logging with timestamps
- Robust error reporting
- Customizable keybindings (Ctrl+Alt+S/A/F)

---

## ⚡ Installation

### From the Marketplace

1. Open VS Code

2. Go to Extensions (`Ctrl+Shift+X`)

3. Search for SQL Helper

4. Click Install or visit:

👉 SQL Helper on Visual Studio Marketplace
    [Install SQL Helper in Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history)

---

## 📣 Promote & Share

Help others discover the extension — a few quick ways to increase visibility:

- ⭐ Star the repo: `https://github.com/marcosgdz03/sql-helper`
- Share the Marketplace link: `https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper`
- Tweet / Mastodon post (example):

```
I just started using SQL Helper for VS Code — 70+ SQL snippets, SQL analysis and formatting built-in. Install: https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper
#vscode #sql #developer
```

- Add the badge to your README:

```
[![SQL Helper in VS Marketplace](https://img.shields.io/visual-studio-marketplace/i/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper)
```

If you'd like, I can generate social images (Twitter card/GitHub social) or a short animated demo GIF to include in the README.

### Desde VSIX (desarrollo)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix
```

---

## ⌨️ Quick Keybindings

| Command | Shortcut | Descriptions |
|---------|----------|-------------|
| **Insert Snippet** | `Ctrl+Alt+S` | Opens snippet menu |
| **Analyze SQL** | `Ctrl+Alt+A` | Detects SQL issues |
| **Format SQL** | `Ctrl+Alt+F` | Reformats query |

> **macOS**: Replace `Ctrl` with `Cmd`

---

## 💡 Quick Usage

### 1️⃣ Insert Snippet (`Ctrl+Alt+S`)
```
1. Open a .sql, .java, .py, .js or .ts file
2. Press Ctrl+Alt+S
3. Type to search (e.g. "SELECT", "INSERT")
4. Press Enter
5. Code is inserted automatically
```

### 2️⃣ Analize SQL (`Ctrl+Alt+A`)
```
1. Open a file containing SQL
2. Press Ctrl+Alt+A
3. Errors appear in:
   - Problems Panel
   - QuickPick
4. Select an error for details
```

### 3️⃣ Format SQL (`Ctrl+Alt+F`)
```
1. Select SQL query (or whole file)
2. Press Ctrl+Alt+F
3. Query is formatted automatically
```

### SQL Analyzer Examples

#### Detecting Errors
```bash
✏️ Press: Ctrl+Alt+S
🔍 Search: "SELECT JOIN"
```

Result:
```sql
SELECT a.*, b.*
FROM table1 a
LEFT JOIN table2 b ON a.id = b.id
WHERE a.status = 'active'
ORDER BY a.date DESC;
```

#### ☕ Java - CRUD complete
```bash
✏️ Press: Ctrl+Alt+S
🔍 Search: "INSERT"
📍 Archive: Main.java
```

Result:
```java
public static void insertUser(User user) throws SQLException {
    String sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setString(1, user.getName());
        ps.setString(2, user.getEmail());
        ps.executeUpdate();
    }
}
```

#### 🐍 Python - transaction
```bash
✏️ Press: Ctrl+Alt+S
🔍 Search: "transaction"
```

Result:
```python
def transfer_money(from_id, to_id, amount):
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    try:
        cursor.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", 
                      (amount, from_id))
        cursor.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", 
                      (amount, to_id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
```

#### 📜 JavaScript - Async/Await
```bash
✏️ Press: Ctrl+Alt+S
🔍 Search: "async SELECT"
```

Result:
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

---

## 🔍 SQL Analyzer Examples

### Detect Errors

```bash
✏️ File: queries.sql
📝 Content:
    UPDATE users SET name = 'John'
    ❌ Missing WHERE clause

⌨️ Press: Ctrl+Alt+A
🎯 Result:
   ✗ UPDATE/DELETE SIN WHERE
   Detectado: "Línea 1 - UPDATE sin WHERE"
   💡 SSuggestion: Add WHERE to avoid updating all records
   
✔️ You can see:
   - Panel Problems
   - Interactive Quickpick
   - Output Channel "SQL Helper"
```

### Detecting in java

```java
// queries.java
String sql = "INSERT INTO users (name) VALUES ('John')" // ❌ Missing ;

⌨️ Press: Ctrl+Alt+A
🎯 Result:
   ✗ FAULT PUNTO Y COMA
   Detect: "Line 1"
   💡 Suggest: "Add ; at the of the SQL sequence"
```

### Format query

```bash
✏️ Original content:
SELECT a.id,a.name,b.email FROM users a INNER JOIN profiles b ON a.id=b.user_id WHERE a.status='active' ORDER BY a.created_at DESC LIMIT 10

⌨️ Atajo: Ctrl+Alt+F
🎯 Resultado formateado:
SELECT a.id, a.name, b.email
FROM users a
INNER JOIN profiles b ON a.id = b.user_id
WHERE a.status = 'active'
ORDER BY a.created_at DESC
LIMIT 10
```

---

#### JavaScript
```javascript
const [users] = await pool.query("SELECT * FROM users");
```

---

## ⌨️ Keybindings

| Command | Shortcut |
|---------|----------|
| Insert snippet | `Ctrl+Alt+S` (Windows/Linux) <br> `Cmd+Alt+S` (macOS) |

You can personalize the shortcut in `Preferences: Open Keyboard Shortcuts`

---

## 🔍 Ejemplos de Snippets

### SQL - INSERT Múltiple
```sql
INSERT INTO table (col1, col2)
VALUES
('val1', 'val2'),
('val1', 'val2'),
('val1', 'val2');
```

### SQL - Complicated JOIN
```sql
SELECT *
FROM tabla1
LEFT JOIN tabla2 ON tabla1.id = tabla2.id
INNER JOIN tabla3 ON tabla2.id = tabla3.id;
```

### Java - SELECT CRUD
```java
public List<Entity> getAllEntity() throws SQLException {
    List<Entity> list = new ArrayList<>();
    String sql = "SELECT * FROM tabla";
    
    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
        
        while (rs.next()) {
            Entity obj = new Entity();
            // mapear campos
            list.add(obj);
        }
    }
    return list;
}
```

### Python - SQLAlchemy
```python
from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)
session = Session()

resultados = session.query(Modelo).all()
session.close()
```

### JavaScript - transaction
```javascript
const conn = await pool.getConnection();
try {
    await conn.beginTransaction();
    await conn.execute("INSERT INTO tabla VALUES (?, ?)", [val1, val2]);
    await conn.commit();
} catch (e) {
    await conn.rollback();
} finally {
    conn.release();
}
```

---

## 📋 Requirements

- **VS Code**: `^1.106.0`
- **Node.js**: `14+` (for development)

---

## 🐛 Known Issues

- Some special characters in multiline snippets may require escaping
- Emoji display depends on system font

---

## 📝 Changelog

### v0.1.0
- Full refactor to modules
- Improved logging with output channel
- 40+ SQL snippets
- 9+ Java JDBC methods
- 15+ Python snippets
- 15+ JavaScript snippets
- Customizable keybinding
- Better error handling

### v0.0.5
- Initial version with basic snippets

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 📧 Support

Report bugs or request features here:: [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)

---

## 📄 License

MIT — Free for commercial and personal use

---
