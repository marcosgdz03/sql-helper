# SQL Helper

**SQL Helper** es una extensión avanzada para **Visual Studio Code** que acelera el desarrollo con bases de datos proporcionando **snippets de código profesionales y reutilizables** para **SQL, Java JDBC, Python y JavaScript**.

Con esta extensión puedes generar código listo para producción en segundos, desde consultas SQL complejas hasta métodos completos de CRUD en varios lenguajes de programación.

---

## 🚀 Características Principales

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

### ✨ **Características Adicionales**
- ✅ Detección automática del lenguaje
- ✅ Búsqueda inteligente con descripciones
- ✅ Emojis para categorización visual
- ✅ Logging en output channel
- ✅ Manejo robusto de errores
- ✅ Keybinding personalizable (`Ctrl+Alt+S`)

---

## ⚡ Instalación

### Desde el Marketplace

1. Abre **VS Code**
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca **SQL Helper**
4. Haz clic en **Instalar**

### Desde VSIX (desarrollo)

```bash
npm install
npm run compile
vsce package
code --install-extension sql-helper-*.vsix
```

---

## 💡 Uso Rápido

1. **Abre un archivo** con extensión `.sql`, `.java`, `.py`, `.js` o `.ts`
2. **Presiona** `Ctrl+Alt+S` (o usa Ctrl+Shift+P y busca "SQL Helper")
3. **Selecciona** el snippet deseado
4. **Listo** - El código se inserta automáticamente

### Ejemplos

#### SQL
```sql
SELECT * FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;
```

#### Java
```java
public List<User> getAllUsers() throws SQLException {
    // Código JDBC completo generado automáticamente
}
```

#### Python
```python
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
resultado = cursor.fetchone()
```

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