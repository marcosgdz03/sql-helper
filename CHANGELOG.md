# Changelog

Todos los cambios notables en esta extensión serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/es/).

## [0.1.4] - 2025-12-07

### ✨ Agregado
- **Analizador SQL avanzado (NUEVO)**:
  - Detecta 8+ tipos de errores: punto y coma, comillas, paréntesis, UPDATE/DELETE sin WHERE (peligroso)
  - Funciona en múltiples lenguajes: .sql, .java, .js, .ts, .py
  - Extrae SQL de strings automáticamente en código Java/JavaScript/Python
  - Comando: `Ctrl+Alt+A` (SQL Helper: Analizar SQL)
  - Muestra errores en Panel Problems, QuickPick interactivo y Output Channel

- **Formateador SQL (NUEVO)**:
  - Reformatea consultas automáticamente con keywords en líneas separadas
  - Limpia espacios en blanco excesivos
  - Funciona en todos los lenguajes soportados
  - Comando: `Ctrl+Alt+F` (SQL Helper: Formatear SQL)

- **Integración Diagnostics**:
  - DiagnosticCollection para mostrar errores en el panel Problems nativo
  - Errores con línea, descripción y sugerencia de corrección
  - Actualización en tiempo real del panel Problems

- **Keybindings expandidos**:
  - `Ctrl+Alt+S` - Insertar snippet (todos los lenguajes)
  - `Ctrl+Alt+A` - Analizar SQL (sql, java, javascript, typescript, python)
  - `Ctrl+Alt+F` - Formatear SQL (sql, java, javascript, typescript, python)

### 🔧 Mejorado
- **MySqlHelper.ts** (nuevo módulo):
  - Clase `MySqlHelper` con métodos estáticos para análisis
  - Método `extractSqlFromCode()` para extraer SQL de código fuente
  - Método `detectErrors()` con 8 patrones de detección
  - Método `publishDiagnostics()` para integración con panel Problems
  - Método `showErrorDetails()` para feedback usuario
  - Método `formatSql()` para reformateo automático

- **extension.ts**:
  - Dos nuevos comandos registrados: `sql-helper.analyzeSql` y `sql-helper.formatSql`
  - Validación de lenguaje antes de ejecutar comandos
  - Mejor manejo de errores con try-catch
  - Logging de inicio/fin de operaciones

- **package.json**:
  - Dos nuevos comandos en contribuciones
  - Keybindings actualizado para 3 comandos
  - Palabras clave mejoradas para descubrimiento

## [0.1.3] - 2025-12-07

### ✨ Agregado
- Soporte completo para Python con 15+ snippets
- Soporte completo para JavaScript con 15+ snippets
- Mejoras en logging y manejo de errores

## [0.1.2] - 2025-12-07

### ✨ Agregado
- Soporte para Java JDBC con 9+ snippets
- Pool de conexiones en ejemplos Java
- Transacciones y manejo de excepciones

## [0.1.1] - 2025-12-07

### 🔧 Mejorado
- Seguridad mejorada (.gitignore y .vscodeignore)
- Removido token de Azure DevOps expuesto
- Documentación de seguridad

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