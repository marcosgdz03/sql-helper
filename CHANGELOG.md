# 🗄️ SQL Helper

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Rating](https://img.shields.io/visual-studio-marketplace/rating/marcosgdz03.sql-helper?label=rating)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#review-details) [![GitHub stars](https://img.shields.io/github/stars/marcosgdz03/sql-helper?style=social)](https://github.com/marcosgdz03/sql-helper/stargazers) [![License](https://img.shields.io/github/license/marcosgdz03/sql-helper)](./LICENSE.md)

**SQL Helper** is an advanced **Visual Studio Code** extension that accelerates database development by providing:

1. **70+ professional snippets** for SQL, Java JDBC, Python, and JavaScript/TypeScript
2. **Smart SQL Analyzer** that detects errors in any language
3. **SQL Formatter** for automatic readability improvement
4. **Framework generators** for Python (Flask/FastAPI) and JS/TS (Express/NestJS/Next.js) with full CRUD scaffolding

Generate **production-ready code** in seconds — from complex SQL queries to full CRUD methods with transactions and error handling.

---

## 🎯 Main Features

### 📊 **SQL Snippets** (40+ templates)
- **Selection**: Basic SELECT, WHERE, LIMIT, OFFSET, ORDER BY, GROUP BY, DISTINCT, JOINs
- **Manipulation**: INSERT (single & multiple), UPDATE, DELETE
- **Structure**: CREATE TABLE (advanced types), IF NOT EXISTS, Foreign Keys
- **DDL**: ALTER TABLE (ADD/DROP/MODIFY columns), CREATE INDEX, DROP TABLE
- **Advanced Queries**: JOINs (LEFT, RIGHT, INNER), UNION, CASE WHEN, Subqueries
- **Functions**: String (CONCAT, SUBSTRING, UPPER/LOWER, REPLACE), Dates (NOW, DATE_ADD, DATEDIFF)
- **DB**: Views, Triggers, Stored Procedures
- **Utility**: file generator, backup/restore

### ☕ **Java JDBC** (9+ methods)
- Connection with pool
- SELECT with List, by ID, with conditions
- INSERT, UPDATE, DELETE using PreparedStatement
- COUNT, full transactions
- Exception handling with try-with-resources

### 🐍 **Python** (15+ snippets)
- SQLite, MySQL (mysql-connector), PostgreSQL
- SELECT (fetchall/fetchone), INSERT (single/multiple)
- UPDATE, DELETE with affected rows
- Transactions with commit/rollback
- Context managers, SQLAlchemy ORM
- **Flask & FastAPI generator** for project scaffolding, tables, CRUD, and DB init

### 📜 **JavaScript/TypeScript** (15+ snippets)
- MySQL (mysql2/promise), PostgreSQL (pg)
- SELECT, INSERT, UPDATE, DELETE with async/await
- Reusable methods, COUNT
- Runtime CREATE TABLE
- Transactions with rollback
- ORM integration (Sequelize)
- **Express.js / NestJS / Next.js generator** for scaffolding full projects

### 🔍 **SQL Analyzer (NEW)** — Automatically detects errors
Detects **8+ error types** including missing semicolons, unbalanced quotes, missing WHERE in UPDATE/DELETE, and more.  
Supports `.sql`, `.java`, `.js/.ts`, `.py` and displays errors in Problems Panel, QuickPick, and Output Channel.

### 🎨 **SQL Formatter (NEW)** — Beautify queries
- Reformats SQL automatically
- Adds line breaks to keywords (SELECT, FROM, WHERE…)
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

👉 [SQL Helper in Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper)

---

### From VSIX (development)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix


---

# 🗄️ SQL Helper

[![Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/marcosgdz03.sql-helper)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history) [![Marketplace Rating](https://img.shields.io/visual-studio-marketplace/rating/marcosgdz03.sql-helper?label=rating)](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#review-details) [![GitHub stars](https://img.shields.io/github/stars/marcosgdz03/sql-helper?style=social)](https://github.com/marcosgdz03/sql-helper/stargazers) [![License](https://img.shields.io/github/license/marcosgdz03/sql-helper)](./LICENSE.md)

**SQL Helper** is an advanced **Visual Studio Code** extension that accelerates database development by providing:

1. **70+ professional snippets** for SQL, Java JDBC, Python, and JavaScript/TypeScript
2. **Smart SQL Analyzer** that detects errors in any language
3. **SQL Formatter** for automatic readability improvement
4. **Framework generators** for Python (Flask/FastAPI) and JS/TS (Express/NestJS/Next.js) with full CRUD scaffolding

Generate **production-ready code** in seconds — from complex SQL queries to full CRUD methods with transactions and error handling.

---

## 🎯 Main Features

### 📊 **SQL Snippets** (40+ templates)
- **Selection**: Basic SELECT, WHERE, LIMIT, OFFSET, ORDER BY, GROUP BY, DISTINCT, JOINs
- **Manipulation**: INSERT (single & multiple), UPDATE, DELETE
- **Structure**: CREATE TABLE (advanced types), IF NOT EXISTS, Foreign Keys
- **DDL**: ALTER TABLE (ADD/DROP/MODIFY columns), CREATE INDEX, DROP TABLE
- **Advanced Queries**: JOINs (LEFT, RIGHT, INNER), UNION, CASE WHEN, Subqueries
- **Functions**: String (CONCAT, SUBSTRING, UPPER/LOWER, REPLACE), Dates (NOW, DATE_ADD, DATEDIFF)
- **DB**: Views, Triggers, Stored Procedures
- **Utility**: file generator, backup/restore

### ☕ **Java JDBC** (9+ methods)
- Connection with pool
- SELECT with List, by ID, with conditions
- INSERT, UPDATE, DELETE using PreparedStatement
- COUNT, full transactions
- Exception handling with try-with-resources

### 🐍 **Python** (15+ snippets)
- SQLite, MySQL (mysql-connector), PostgreSQL
- SELECT (fetchall/fetchone), INSERT (single/multiple)
- UPDATE, DELETE with affected rows
- Transactions with commit/rollback
- Context managers, SQLAlchemy ORM
- **Flask & FastAPI generator** for project scaffolding, tables, CRUD, and DB init

### 📜 **JavaScript/TypeScript** (15+ snippets)
- MySQL (mysql2/promise), PostgreSQL (pg)
- SELECT, INSERT, UPDATE, DELETE with async/await
- Reusable methods, COUNT
- Runtime CREATE TABLE
- Transactions with rollback
- ORM integration (Sequelize)
- **Express.js / NestJS / Next.js generator** for scaffolding full projects

### 🔍 **SQL Analyzer (NEW)** — Automatically detects errors
Detects **8+ error types** including missing semicolons, unbalanced quotes, missing WHERE in UPDATE/DELETE, and more.  
Supports `.sql`, `.java`, `.js/.ts`, `.py` and displays errors in Problems Panel, QuickPick, and Output Channel.

### 🎨 **SQL Formatter (NEW)** — Beautify queries
- Reformats SQL automatically
- Adds line breaks to keywords (SELECT, FROM, WHERE…)
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

👉 [SQL Helper in Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper)

---

### From VSIX (development)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix

### 1️⃣ Insert Snippet (`Ctrl+Alt+S`)

1. Open a .sql, .java, .py, .js, or .ts file

2. Press Ctrl+Alt+S

3. Type to search (e.g., "SELECT", "INSERT")

4. Press Enter

5. Code is inserted automatically

### 2️⃣ Analyze SQL (`Ctrl+Alt+A`)

1. Open a file containing SQL

2. Press Ctrl+Alt+A

3. Errors appear in:

    - Problems Panel

    - QuickPick

4. Select an error for details

### 3️⃣ Format SQL (`Ctrl+Alt+F`)

1. Select SQL query (or whole file)

2. Press Ctrl+Alt+F

3. Query is formatted automatically

### 4️⃣ Generate Python Project (`Ctrl+Alt+P`)

1. Press Ctrl+Alt+P

2. Choose framework: Flask or FastAPI

3. Select Python version and database type

4. Choose project folder

5. Tables and CRUD scaffolding are generated automatically


### 5️⃣ Generate JavaScript/TypeScript Project (`Ctrl+Alt+J`)

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
   
✔️ Errors are shown in:
   - Problems Panel
   - Interactive QuickPick
   - Output Channel "SQL Helper"


### DETECTING IN JAVA

// queries.java
String sql = "INSERT INTO users (name) VALUES ('John')" // ❌ Missing ;

⌨️ Press: Ctrl+Alt+A
🎯 Result:
   ✗ MISSING SEMICOLON
   Detected: "Line 1"
   💡 Suggestion: "Add ; at the end of the SQL statement"

### Format Query

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

---

### 🐍 Python Snippet Example - Transaction

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


