# 🗄️ SQL Helper

**SQL Helper** es una extensión avanzada para **Visual Studio Code** que acelera el desarrollo con bases de datos proporcionando:

1. **70+ Snippets profesionales** para SQL, Java JDBC, Python y JavaScript/TypeScript
2. **Analizador SQL inteligente** que detecta errores en cualquier lenguaje
3. **Formateador SQL** para mejorar legibilidad automáticamente

Genera código **listo para producción** en segundos, desde consultas SQL complejas hasta métodos completos de CRUD con transacciones y manejo de errores.

---

## 🎯 Características Principales

### 📊 **Snippets SQL** (40+ templates)
- **Selección**: SELECT básico, WHERE, LIMIT, OFFSET, ORDER BY, GROUP BY, DISTINCT, JOINs
- **Manipulación**: INSERT (simple y múltiple), UPDATE, DELETE
- **Estructura**: CREATE TABLE (con tipos de datos avanzados), IF NOT EXISTS, Foreign Keys
- **DDL**: ALTER TABLE (ADD/DROP/MODIFY columns), CREATE INDEX, DROP TABLE
- **Consultas Avanzadas**: JOINs (LEFT, RIGHT, INNER), UNION, CASE WHEN, Subqueries
- **Funciones**: String (CONCAT, SUBSTRING, UPPER/LOWER, REPLACE), Dates (NOW, DATE_ADD, DATEDIFF)
- **BD**: Views, Triggers, Stored Procedures
- **Utilidad**: Generador de archivos SQL, backup/restore

### ☕ **Java JDBC** (9+ métodos)
- Conexión JDBC con pool de conexiones
- SELECT con List, SELECT por ID, SELECT con condiciones
- INSERT, UPDATE, DELETE con PreparedStatement
- COUNT, transacciones completas
- Manejo de excepciones y try-with-resources

### 🐍 **Python** (15+ snippets)
- Conexión SQLite, MySQL (mysql-connector), PostgreSQL
- SELECT (fetchall, fetchone), INSERT (simple y múltiple)
- UPDATE, DELETE con conteo de filas afectadas
- Transacciones con commit/rollback
- Context managers, SQLAlchemy ORM

### 📜 **JavaScript/TypeScript** (15+ snippets)
- Conexión MySQL (mysql2/promise), PostgreSQL (pg)
- SELECT, INSERT, UPDATE, DELETE con async/await
- Métodos reutilizables, COUNT
- CREATE TABLE en runtime
- Transacciones con rollback
- ORM integration (Sequelize)

### 🔍 **Analizador SQL (NUEVO)** - Detecta errores automáticamente
- Detecta **8+ tipos de errores**:
  - Falta de punto y coma (`;`)
  - Comillas no balanceadas (`'`, `"`)
  - Paréntesis desbalanceados
  - SELECT sin FROM
  - INSERT sin VALUES
  - **UPDATE/DELETE SIN WHERE** (peligroso) ⚠️
  - Palabras reservadas usadas como nombres
- Funciona en múltiples lenguajes:
  - `.sql` - Archivos SQL puros
  - `.java` - Dentro de strings: `"SELECT * FROM..."`
  - `.js/.ts` - Template literals: `` const sql = `SELECT...` ``
  - `.py` - Strings Python: `sql = "SELECT..."`
- Muestra errores en:
  - **Panel Problems** (integración nativa VS Code)
  - **QuickPick interactivo** (selecciona para detalles)
  - **Output Channel** (logs detallados)

### 🎨 **Formateador SQL (NUEVO)** - Mejora legibilidad
- Reformatea consultas automáticamente
- Añade saltos de línea en keywords (SELECT, FROM, WHERE, JOIN, etc.)
- Limpia espacios en blanco excesivos
- Funciona en todos los lenguajes soportados

### ✨ **Características Adicionales**
- ✅ Detección automática del lenguaje
- ✅ Búsqueda inteligente con descripciones
- ✅ Emojis para categorización visual (📖 SELECT, ✏️ CRUD, 🏗️ DDL, etc.)
- ✅ Logging completo en output channel con timestamps
- ✅ Manejo robusto de errores con feedback usuario
- ✅ Keybindings personalizables (Ctrl+Alt+S/A/F)

---

## ⚡ Instalación

### Desde el Marketplace

1. Abre **VS Code**
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca **SQL Helper**
4. Haz clic en **Instalar** o visita directamente:

    [Instalar SQL Helper en Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper&ssr=false#version-history)

    (enlace directo al Marketplace)

### Desde VSIX (desarrollo)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix
```

---

## ⌨️ Keybindings Rápidos

| Comando | Shortcut | Descripción |
|---------|----------|-------------|
| **Insertar Snippet** | `Ctrl+Alt+S` | Abre menú de snippets |
| **Analizar SQL** | `Ctrl+Alt+A` | Detecta errores SQL |
| **Formatear SQL** | `Ctrl+Alt+F` | Formatea consulta |

> **macOS**: Reemplaza `Ctrl` con `Cmd`

---

## 💡 Uso Rápido

### 1️⃣ Insertar Snippet (`Ctrl+Alt+S`)
```
1. Abre archivo .sql, .java, .py, .js o .ts
2. Presiona Ctrl+Alt+S
3. Escribe para buscar (ej: "SELECT", "INSERT")
4. Presiona Enter
5. El código se inserta automáticamente
```

### 2️⃣ Analizar SQL (`Ctrl+Alt+A`)
```
1. Abre archivo con SQL (dentro de código o .sql)
2. Presiona Ctrl+Alt+A
3. Se muestran errores en:
   - Panel Problems (abajo)
   - QuickPick (selecciona para detalles)
4. Selecciona un error para ver sugerencia
```

### 3️⃣ Formatear SQL (`Ctrl+Alt+F`)
```
1. Selecciona consulta SQL (o todo el archivo)
2. Presiona Ctrl+Alt+F
3. La consulta se formatea automáticamente
```

### Ejemplos

#### 📖 SQL - Selección Avanzada
```bash
✏️ Atajo: Ctrl+Alt+S
🔍 Busca: "SELECT JOIN"
```

Resultado:
```sql
SELECT a.*, b.*
FROM tabla1 a
LEFT JOIN tabla2 b ON a.id = b.id
WHERE a.estado = 'activo'
ORDER BY a.fecha DESC;
```

#### ☕ Java - CRUD Completo
```bash
✏️ Atajo: Ctrl+Alt+S
🔍 Busca: "INSERT"
📍 Archivo: Main.java
```

Resultado:
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

#### 🐍 Python - Transacción
```bash
✏️ Atajo: Ctrl+Alt+S
🔍 Busca: "transaction"
```

Resultado:
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
✏️ Atajo: Ctrl+Alt+S
🔍 Busca: "async SELECT"
```

Resultado:
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

## 🔍 Ejemplos del Analizador SQL

### Detectar Errores

```bash
✏️ Archivo: queries.sql
📝 Contenido:
    UPDATE users SET name = 'John'
    ❌ Falta WHERE clause (peligroso!)

⌨️ Atajo: Ctrl+Alt+A
🎯 Resultado:
   ✗ UPDATE/DELETE SIN WHERE
   Detectado: "Línea 1 - UPDATE sin WHERE"
   💡 Sugerencia: "Añade WHERE para evitar actualizar todos los registros"
   
✔️ Se muestra en:
   - Panel Problems
   - QuickPick interactivo
   - Output Channel "SQL Helper"
```

### Detectar en Java

```java
// queries.java
String sql = "INSERT INTO users (name) VALUES ('John')  // ❌ Falta ;

⌨️ Atajo: Ctrl+Alt+A
🎯 Resultado:
   ✗ FALTA PUNTO Y COMA
   Detectado: "Línea 1"
   💡 Sugerencia: "Añade ; al final de la sentencia SQL"
```

### Formatear Consulta

```bash
✏️ Contenido original:
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

| Comando | Shortcut |
|---------|----------|
| Insertar snippet | `Ctrl+Alt+S` (Windows/Linux) <br> `Cmd+Alt+S` (macOS) |

Puedes personalizar el atajo en `Preferences: Open Keyboard Shortcuts`

---

## 🔍 Ejemplos de Snippets

### SQL - INSERT Múltiple
```sql
INSERT INTO tabla (col1, col2)
VALUES
('val1', 'val2'),
('val1', 'val2'),
('val1', 'val2');
```

### SQL - JOIN Complejo
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

### JavaScript - Transacción
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

## 📋 Requisitos

- **VS Code**: `^1.106.0`
- **Node.js**: `14+` (para desarrollo)

---

## 🐛 Problemas Conocidos

- Algunos caracteres especiales en snippets multilinea pueden requerir escapado
- Los emojis se muestran según la fuente del sistema

---

## 📝 Changelog

### v0.1.0
- ✅ Refactorización completa a módulos
- ✅ Logging mejorado con output channel
- ✅ 40+ snippets SQL
- ✅ 9+ métodos Java JDBC
- ✅ 15+ snippets Python
- ✅ 15+ snippets JavaScript
- ✅ Keybinding personalizable
- ✅ Mejor manejo de errores

### v0.0.5
- Versión inicial con snippets básicos

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repo
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Soporte

Para reportar bugs o sugerir features: [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)

---

## 📄 Licencia

MIT - Libre para uso comercial y personal

---

**¡Disfruta desarrollando más rápido con SQL Helper! 🚀**

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