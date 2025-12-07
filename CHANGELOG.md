# Changelog

Todos los cambios notables en esta extensión serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/es/).

## [0.1.0] - 2025-12-07

### ✨ Agregado
- **Refactorización completa** a módulos independientes por lenguaje
- **Logging mejorado** con output channel dedicado (`SQL Helper`)
- **40+ snippets SQL**:
  - Selección: SELECT básico, WHERE, LIMIT, ORDER BY, GROUP BY, DISTINCT
  - Manipulación: INSERT (simple/múltiple), UPDATE, DELETE
  - DDL: CREATE TABLE (varios tipos), ALTER TABLE, CREATE INDEX
  - Consultas avanzadas: JOINs, UNION, CASE WHEN, Subqueries
  - Funciones: String (CONCAT, SUBSTRING, UPPER/LOWER), Dates (NOW, DATE_ADD)
- **9+ métodos Java JDBC**:
  - Conexión con pool
  - SELECT (lista, por ID, con condiciones)
  - INSERT, UPDATE, DELETE
  - COUNT, transacciones
- **15+ snippets Python**:
  - Conexión SQLite, MySQL, PostgreSQL
  - CRUD completo
  - Context managers, SQLAlchemy ORM
- **15+ snippets JavaScript**:
  - mysql2/promise, pg
  - Async/await patterns
  - Transacciones
  - Sequelize integration
- **Detección automática** del lenguaje del archivo
- **Búsqueda inteligente** con emojis por categoría
- **Keybinding personalizado**: `Ctrl+Alt+S` (Windows/Linux), `Cmd+Alt+S` (macOS)
- **Manejo robusto de errores** con feedback al usuario
- **Archivo CONTRIBUTING.md** con guía detallada para contribuidores
- **Types.ts** con interfaces compartidas
- **package.json mejorado** con:
  - Keywords para mejor descubrimiento
  - URLs de repo, bugs, homepage
  - Keybindings configurables
  - Categoría actualizada

### 🔧 Mejorado
- **extension.ts**: Uso de helpers para mejor modularidad
- **helpers.ts**: 
  - Funciones `logInfo()` y `logError()`
  - `pickSnippetType()` con descriptions y emojis
  - Función `getLanguageName()` para nombres legibles
- **sqlSnippets.ts**:
  - Interfaz `SnippetItem` con descriptions
  - Categorización con emojis (📖, ✏️, 🏗️, 🔧, 🗂️, ⭐, 🔤, 📅, 🎯, 📄)
  - Mejor manejo de errores y logging
  - Snippets con placeholders mejorados
- **README.md**: Documentación completa con ejemplos de código

### 📚 Documentación
- README completo con características, instalación, uso
- Ejemplos de snippets para cada lenguaje
- Tabla de keybindings
- Sección de troubleshooting
- CONTRIBUTING.md con guía de desarrollo

### 🐛 Corregido
- Escaping correcto en snippets multilinea
- Manejo de errores en creación de archivos
- Logging consistente en toda la extensión

### ⚠️ Roto
- Removida la necesidad de plugin separado para JDBC

## [0.0.5] - 2024-XX-XX

### Agregado
- Versión inicial con snippets básicos
- Soporte para SQL, Java, Python, JavaScript
- Detección automática del lenguaje
- Generador de archivos SQL