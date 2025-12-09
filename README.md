# 🗄️ SQL Helper

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Rating](https://img.shields.io/visual-studio-marketplace/rating/marcosgdz03/sql-helper?label=rating)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#review-details) [![GitHub stars](https://img.shields.io/github/stars/marcosgdz03/sql-helper?style=social)](https://github.com/marcosgdz03/sql-helper/stargazers) [![License](https://img.shields.io/github/license/marcosgdz03/sql-helper)](./LICENSE.md)

**SQL Helper** is an advanced **Visual Studio Code** extension that accelerates database development by providing:

1. **70+ professional snippets** for SQL, Java JDBC, Python, and JavaScript/TypeScript
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
- Customizable keybindings (Ctrl+Alt+S/A/F/J)

---

## ⚡ Installation

### From the Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for SQL Helper
4. Click Install or visit:

👉 SQL Helper on Visual Studio Marketplace  
[Install SQL Helper](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history)

---

### From VSIX (development)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix
```

---

## ⌨️ Quick Keybindings

| Command | Shortcut | Description |
|---------|----------|-------------|
| Insert Snippet | `Ctrl+Alt+S` | Opens snippet menu |
| Analyze SQL | `Ctrl+Alt+A` | Detects SQL issues |
| Format SQL | `Ctrl+Alt+F` | Reformats query |
| Generate Python Project | `Ctrl+Alt+P` | Create Flask/FastAPI project |
| Generate JavaScript/TypeScript Project | `Ctrl+Alt+J` | Create Express/Nest/Next project |

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

### 2️⃣ Analyze SQL (`Ctrl+Alt+A`)
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

### 4️⃣ Generate Python Project (`Ctrl+Alt+P`)
```
1. Press Ctrl+Alt+P
2. Choose framework (Flask or FastAPI)
3. Select Python version (3.10, 3.11, 3.12)
4. Choose database (PostgreSQL, MySQL, SQLite)
5. Select folder
6. Project folder with virtualenv, DB module, models, CRUD, and README is generated
```

### 5️⃣ Generate JavaScript/TypeScript Project (`Ctrl+Alt+J`)
```
1. Press Ctrl+Alt+J
2. Choose framework:
   - Express.js: Minimalist Node.js backend
   - NestJS: Full-featured TypeScript backend
   - Next.js: React-based frontend + backend
3. Select project folder
4. Full project scaffolding is generated:
   - Folder structure
   - package.json with dependencies
   - Starter files (index.js, main.ts, app.module.ts, pages/index.js)
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
   Detected: "Line 1 - UPDATE without WHERE"
   💡 Suggestion: Add WHERE to avoid updating all records
```

### Detecting in Java

```java
// queries.java
String sql = "INSERT INTO users (name) VALUES ('John')" // ❌ Missing ;

⌨️ Press: Ctrl+Alt+A
🎯 Result:
   ✗ MISSING SEMICOLON
   Detected: "Line 1"
   💡 Suggestion: "Add ; at the end of the SQL statement"
```

### Format Query

```bash
✏️ Original content:
SELECT a.id,a.name,b.email FROM users a INNER JOIN profiles b ON a.id=b.user_id WHERE a.status='active' ORDER BY a.created_at DESC LIMIT 10

⌨️ Press: Ctrl+Alt+F
🎯 Result:
SELECT a.id, a.name, b.email
FROM users a
INNER JOIN profiles b ON a.id = b.user_id
WHERE a.status = 'active'
ORDER BY a.created_at DESC
LIMIT 10
```

---

## 💻 Snippet Examples

### Python Transaction
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

### Java Insert
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

### JavaScript Async/Await
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

## 📋 Requirements

- **VS Code**: `^1.106.0`
- **Node.js**: `14+` (for development)

---

## 📝 Changelog

### 0.5.0 - 2025-12-09
- ✅ Added Python project generation (Flask/FastAPI) with DB modules and CRUD
- ✅ Added JavaScript/TypeScript project generation (Express/Nest/Next.js)
- ✅ Updated keybindings (`Ctrl+Alt+P`, `Ctrl+Alt+J`)
- ✅ Improved README with usage examples

### 0.1.0 - 2025-12-08
- ✅ Refactored code into modular structure
- ✅ Improved logging via Output Channel
- ✅ 40+ SQL snippets added
- ✅ 9+ Java JDBC methods
- ✅ 15+ Python snippets
- ✅ 15+ JavaScript/TypeScript snippets
- ✅ Customizable keybindings (Ctrl+Alt+S/A/F)
- ✅ Enhanced error handling
- ✅ SQL Analyzer added
- ✅ SQL Formatter added

### 0.0.5 - 2025-11-20
- Initial release with basic SQL snippets
- Basic keybindings for insert snippet

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 📧 Support

Report bugs or request features here: [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)

---

## 📄 License

MIT — Free for commercial and personal use
