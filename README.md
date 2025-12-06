# SQL Helper

**SQL Helper** es una extensión para **Visual Studio Code** que ayuda a desarrolladores a trabajar con bases de datos y lenguajes como **SQL, Java, Python y JavaScript**.  
Con esta extensión puedes insertar **snippets de código comunes y avanzados** para operaciones de bases de datos, consultas SQL y gestión de conexiones de manera rápida y eficiente.

---

## 🚀 Características

- **Snippets SQL**:  
  - SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, índices, vistas, triggers, stored procedures, transacciones y más.
- **Java / JDBC**:  
  - Genera métodos JDBC para SELECT, INSERT, DELETE y CRUD completo.  
  - Crea ficheros de conexión (`DatabaseConnection.java`) y servicios reutilizables (`QueryExecutor.java`).
- **Python**:  
  - Snippets para SQLite, PostgreSQL y MySQL.  
  - Funciones CRUD, context managers, manejo de errores y logging.
- **JavaScript / Node.js**:  
  - Conexión a MySQL y PostgreSQL usando `mysql2/promise` o `pg`.  
  - Repositorios y servicios DB con métodos CRUD listos.  
  - Scripts de inicialización (`init.sql`) y seeders (`seed.js`).
- **Multi-lenguaje**: Compatible con archivos `.sql`, `.java`, `.py` y `.js`.
- **Fácil de usar**: Detecta automáticamente el lenguaje del archivo o permite seleccionar manualmente el snippet.

---

## ⚡ Instalación

### Desde el Marketplace

1. Abre **VS Code**.  
2. Ve a la pestaña de **Extensiones** (`Ctrl+Shift+X` o `Cmd+Shift+X` en Mac).  
3. Busca **SQL Helper** y haz clic en **Instalar**.

### Desde VSIX

```bash
vsce package
code --install-extension sql-helper-0.0.1.vsix
```

## 💡 Uso

Abre un archivo del lenguaje deseado (.sql, .java, .py, .js).

Ejecuta el comando "Insertar snippet de SQL Helper" desde la paleta de comandos (Ctrl+Shift+P o Cmd+Shift+P).

Selecciona el snippet que quieres insertar o generar un fichero nuevo en tu proyecto.

## 📂 Ejemplos de snippets

SQL:

```sql
SELECT * FROM users WHERE id = 1;
CREATE TABLE IF NOT EXISTS ejemplo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);
```


Java (JDBC):


```java
Connection conn = DatabaseConnection.getConnection();
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users");
ResultSet rs = ps.executeQuery();
```

Python (SQLite):


```python
conn = sqlite3.connect("database.db")
cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()
```

JavaScript (Node.js / MySQL):


```javascript
const [rows] = await pool.query("SELECT * FROM users");
await pool.execute("INSERT INTO users (name) VALUES (?)", ["Alice"]);
```

## 📌 Contribuir

Si quieres colaborar, reportar errores o sugerir nuevas funcionalidades, abre un issue en el repositorio o envía un pull request.