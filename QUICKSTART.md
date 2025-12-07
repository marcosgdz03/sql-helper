# Quick Start - SQL Helper

## ⚡ Inicio en 5 Minutos

### 1. Instalar la Extensión

**Desde VS Code Marketplace:**
1. Abre VS Code
2. Ve a Extensiones (`Ctrl+Shift+X`)
3. Busca "SQL Helper"
4. Instala la extensión

### 2. Usar la Extensión

**Método 1: Atajo de Teclado**
- Presiona `Ctrl+Alt+S` (Windows/Linux)
- O `Cmd+Alt+S` (macOS)

**Método 2: Paleta de Comandos**
1. Presiona `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (macOS)
2. Escribe "SQL Helper"
3. Selecciona "SQL Helper: Insertar snippet"

### 3. Seleccionar Snippet

- **Escriba** para buscar (ej: "SELECT", "INSERT", "COUNT")
- **Flecha arriba/abajo** para navegar
- **Enter** para seleccionar
- El código se inserta automáticamente

---

## 📝 Ejemplos Rápidos

### SQL - SELECT Simple
```bash
1. Abre un archivo .sql
2. Presiona Ctrl+Alt+S
3. Busca "SELECT"
4. Presiona Enter
→ Se inserta: SELECT * FROM ${1:tabla};
```

### Java - Método JDBC
```bash
1. Abre un archivo .java
2. Presiona Ctrl+Alt+S
3. Busca "INSERT"
4. Presiona Enter
→ Código JDBC completo listo
```

### Python - SELECT
```bash
1. Abre un archivo .py
2. Presiona Ctrl+Alt+S
3. Busca "SELECT"
4. Presiona Enter
→ Cursor execution listo
```

### JavaScript - Transacción
```bash
1. Abre un archivo .js
2. Presiona Ctrl+Alt+S
3. Busca "Transacción"
4. Presiona Enter
→ Código async/await con rollback
```

---

## 🔍 Búsqueda Inteligente

Los snippets se organizan con **emojis por categoría**:

### SQL
- 📖 Lectura (SELECT)
- ✏️ Escritura (INSERT, UPDATE, DELETE)
- 🏗️ Estructura (CREATE TABLE)
- 🔧 Modificación (ALTER TABLE)
- 🗂️ Índices (INDEX)
- ⭐ Avanzado (JOINs, UNION)
- 🔤 Funciones String
- 📅 Funciones Fecha

### Búsqueda Rápida

```
Escribe el emoji para ver solo esa categoría:
- Escribe "📖" para ver SELECT
- Escribe "✏️" para ver INSERT/UPDATE/DELETE
- Escribe "⭐" para ver JOINs, UNION, etc.
```

O busca por nombre:
```
- "SELECT" → Todas las variantes SELECT
- "COUNT" → Función de agregación
- "JOIN" → Operaciones de unión
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
