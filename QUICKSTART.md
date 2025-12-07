# Quick Start - SQL Helper

## ⚡ Inicio Rápido (3 Funciones Principales)

### 1️⃣ **Insertar Snippets** (`Ctrl+Alt+S`)

**Atajo de Teclado:**
- Windows/Linux: `Ctrl+Alt+S`
- macOS: `Cmd+Alt+S`

**Pasos:**
```
1. Abre archivo .sql, .java, .py, .js o .ts
2. Presiona Ctrl+Alt+S
3. Escribe para buscar (ej: "SELECT", "INSERT", "JOIN")
4. Selecciona con Enter
5. ¡El código se inserta automáticamente!
```

**Ejemplo:**
```bash
Archivo: queries.sql
→ Ctrl+Alt+S
→ Busca: "SELECT WHERE"
→ Resultado: SELECT * FROM ${1:tabla} WHERE ${2:condición};
```

---

### 2️⃣ **Analizar SQL** (`Ctrl+Alt+A`) - NUEVO

Detecta errores automáticamente en cualquier SQL.

**Atajo de Teclado:**
- Windows/Linux: `Ctrl+Alt+A`
- macOS: `Cmd+Alt+A`

**Pasos:**
```
1. Abre archivo con SQL (.sql, .java, .js, .py, .ts)
2. Presiona Ctrl+Alt+A
3. Se muestran errores detectados en:
   - Panel Problems (abajo)
   - QuickPick interactivo
4. Selecciona error para ver sugerencia de corrección
```

**Errores que detecta:**
- ❌ Falta punto y coma (`;`)
- ❌ Comillas no balanceadas
- ❌ Paréntesis desbalanceados
- ❌ SELECT sin FROM
- ❌ INSERT sin VALUES
- ⚠️ **UPDATE/DELETE SIN WHERE** (¡peligroso!)
- ❌ Palabras reservadas como nombres
- ❌ Sintaxis inválida

**Ejemplos:**

```bash
Archivo: update.sql
Contenido: UPDATE users SET name='John'
          (❌ Falta WHERE)

→ Ctrl+Alt+A
→ Panel Problems: "UPDATE/DELETE SIN WHERE"
→ Sugerencia: "Añade WHERE para evitar actualizar todos los registros"
```

```bash
Archivo: query.java
Contenido: String sql = "INSERT INTO users (name) VALUES ('John'"
          (❌ Falta comilla de cierre y punto y coma)

→ Ctrl+Alt+A
→ Panel Problems: "Comilla sin cerrar"
→ Sugerencia: "Cierra la comilla al final de la cadena"
```

---

### 3️⃣ **Formatear SQL** (`Ctrl+Alt+F`) - NUEVO

Reformatea consultas automáticamente para mejor legibilidad.

**Atajo de Teclado:**
- Windows/Linux: `Ctrl+Alt+F`
- macOS: `Cmd+Alt+F`

**Pasos:**
```
1. Selecciona SQL (o todo el archivo)
2. Presiona Ctrl+Alt+F
3. ¡La consulta se formatea automáticamente!
```

**Ejemplo:**

ANTES (compacto):
```sql
SELECT a.id,a.name,b.email FROM users a INNER JOIN profiles b ON a.id=b.user_id WHERE a.status='active' ORDER BY a.created_at DESC LIMIT 10
```

DESPUÉS (formateado):
```sql
SELECT a.id, a.name, b.email
FROM users a
INNER JOIN profiles b ON a.id = b.user_id
WHERE a.status = 'active'
ORDER BY a.created_at DESC
LIMIT 10
```

---

## 📋 Tabla de Keybindings

| Comando | Shortcut | Uso |
|---------|----------|-----|
| **Insertar Snippet** | `Ctrl+Alt+S` | Abre menú de snippets |
| **Analizar SQL** | `Ctrl+Alt+A` | Detecta errores SQL |
| **Formatear SQL** | `Ctrl+Alt+F` | Reformatea consulta |

> **Nota macOS:** Reemplaza `Ctrl` con `Cmd`

---

## 🔍 Búsqueda de Snippets - Categorías

Los snippets se organizan con **emojis por categoría**:

### SQL
- 📖 **SELECT** - Lectura (WHERE, LIMIT, ORDER BY, DISTINCT)
- ✏️ **CRUD** - Escritura (INSERT, UPDATE, DELETE, REPLACE)
- 🏗️ **DDL** - Estructura (CREATE TABLE, ALTER, DROP)
- ⭐ **Avanzado** - JOINs, UNION, CASE WHEN, Subqueries
- 🔤 **String** - CONCAT, SUBSTRING, UPPER, LOWER, REPLACE
- 📅 **Date** - NOW, DATE_ADD, DATEDIFF, DATE_FORMAT

### Búsqueda Rápida por Emoji

```
Escribe el emoji para filtrar:
→ "📖" = Ver solo SELECT
→ "✏️" = Ver INSERT/UPDATE/DELETE
→ "⭐" = Ver JOINs, UNION, etc.
```

O busca por nombre:
```
→ "SELECT" = Todas las variantes SELECT
→ "JOIN" = Operaciones de unión
→ "COUNT" = Función de agregación
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: INSERT en Java

```bash
Archivo: Main.java
1. Posiciona cursor donde quieres el código
2. Presiona Ctrl+Alt+S
3. Busca: "INSERT"
4. Selecciona: "✏️ INSERT with PreparedStatement"
5. Enter
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

### Ejemplo 2: Detectar Error en Python

```bash
Archivo: database.py
Contenido:
    sql = "UPDATE customers SET balance = 0"
    (❌ Falta WHERE)

1. Presiona Ctrl+Alt+A
2. Panel Problems muestra: "UPDATE/DELETE SIN WHERE"
3. Selecciona el error
4. Ve la sugerencia: "Añade WHERE para ser específico"
```

### Ejemplo 3: Formatear Consulta

```bash
Archivo: query.sql
Contenido sin formato:
    SELECT u.id, u.name, p.email, p.phone FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.active = 1 ORDER BY u.created_at DESC

1. Selecciona todo (Ctrl+A)
2. Presiona Ctrl+Alt+F
3. Resultado formateado automáticamente
```

---

## ⚙️ Configuración

### Personalizar Keybindings

Si quieres cambiar los atajos:

1. Abre Preferences: Keyboard Shortcuts (`Ctrl+K Ctrl+S`)
2. Busca "SQL Helper"
3. Haz click en el lápiz para editar
4. Presiona la combinación deseada

---

## 🎯 Casos de Uso Comunes

**Necesito un INSERT rápido**
→ Ctrl+Alt+S → "INSERT" → Enter

**Tengo un error en mi SQL**
→ Ctrl+Alt+A → Verifica Panel Problems

**Mi SQL es ilegible**
→ Ctrl+Alt+F → Formatea automáticamente

**Quiero un SELECT con JOIN**
→ Ctrl+Alt+S → "JOIN" → Selecciona variante

**Necesito transacción en JavaScript**
→ Ctrl+Alt+S → "transaction" → Enter
- "CONCAT" → Funciones de string
```

---

## 💡 Consejos

### 1. Personalizadores de Snippet
Después de insertar, los placeholders `${1:texto}` se hacen editables:
- **Tab** para ir al siguiente placeholder
- **Shift+Tab** para ir al anterior
- **Escape** para salir del modo snippet

Ejemplo: `SELECT * FROM ${1:tabla} WHERE ${2:condicion};`
```
→ Cursor en "tabla" listo para editar
→ Tab → Cursor en "condicion"
```

### 2. Búsqueda por Descripción
La búsqueda se aplica también a la **descripción**:
```
Busca "Contar" → Encontrará "SELECT COUNT(*)"
Busca "Múltiple" → Encontrará "INSERT MULTIPLE"
Busca "Fecha" → Encontrará funciones de fecha
```

### 3. Crear Archivos SQL
Algunos snippets crean archivos en tu proyecto:
- "create_tables.sql" → Estructura de BD
- "seed_data.sql" → Datos de prueba

### 4. Configurar Keybinding

Para cambiar el atajo `Ctrl+Alt+S`:

1. Ve a `Preferences: Open Keyboard Shortcuts` (`Ctrl+K Ctrl+S`)
2. Busca "SQL Helper"
3. Click derecho en el atajo
4. Selecciona "Change Keybinding"
5. Presiona tu combinación deseada

---

## 🐛 Problemas Comunes

### "No se detecta el lenguaje"
→ Asegúrate de que el archivo tenga la extensión correcta (.sql, .java, .py, .js)
→ O selecciona manualmente el tipo en el selector

### "El snippet no se inserta"
→ Verifica que haya un editor activo
→ Probá F5 para recargar VS Code

### "Veo caracteres raros en los snippets"
→ Los emojis pueden variar según la fuente
→ Son solo visuales, no afectan el código

### "¿Cómo salgo del modo snippets?"
→ Presiona `Escape` para salir

---

## 📚 Más Información

- **README completo**: `README.md` - Documentación exhaustiva
- **Guía de contribución**: `CONTRIBUTING.md` - Cómo agregar snippets
- **Changelog**: `CHANGELOG.md` - Histórico de cambios
- **Publicación**: `PUBLISHING.md` - Para maintainers

---

## ⌨️ Cheat Sheet

| Acción | Atajo |
|--------|-------|
| Abrir snippet | `Ctrl+Alt+S` |
| Paleta de comandos | `Ctrl+Shift+P` |
| Siguiente placeholder | `Tab` |
| Anterior placeholder | `Shift+Tab` |
| Salir de snippet | `Escape` |
| Cambiar keybinding | `Ctrl+K Ctrl+S` |

---

## 🎯 Próximos Pasos

1. **Explorar snippets**: Prueba algunos para cada lenguaje
2. **Personalizar**: Ajusta el keybinding a tu preferencia
3. **Guardar favoritos**: Memoriza los nombres de los más usados
4. **Reportar**: Si encuentras bugs, abre un [GitHub Issue](https://github.com/marcosgdz03/sql-helper/issues)
5. **Contribuir**: ¿Idea para un nuevo snippet? [Contribuye!](CONTRIBUTING.md)

---

**¡Disfruta codificando más rápido con SQL Helper! 🚀**

Preguntas? Issues? → [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)
