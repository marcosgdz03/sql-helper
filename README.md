# SQL Helper

**SQL Helper** es una extensión de Visual Studio Code diseñada para desarrolladores que trabajan con bases de datos y lenguajes como **SQL, Java, Python y JavaScript**.  
Permite insertar rápidamente **snippets de código comunes** para operaciones de bases de datos, JDBC y consultas SQL.

---

## Características

- ✅ Inserta snippets SQL básicos y avanzados:
  - SELECT, INSERT, CREATE TABLE, ALTER TABLE, índices y más.
- ✅ Genera métodos JDBC para Java:
  - SELECT, INSERT y DELETE con conexión a bases de datos.
- ✅ Snippets Python para manejo de SQLite.
- ✅ Snippets JavaScript (Node.js) para MySQL usando `mysql2/promise`.
- 🔹 Compatible con archivos `.sql`, `.java`, `.py` y `.js`.
- 🔹 Detecta automáticamente el lenguaje del archivo o permite seleccionar manualmente el tipo de snippet.

---

## Instalación

1. Abre **VS Code**.
2. Ve a la pestaña de **Extensiones** (`Ctrl+Shift+X` o `Cmd+Shift+X` en Mac).
3. Busca `SQL Helper` y haz clic en **Instalar**.

O, si quieres instalar desde el VSIX:

```bash
vsce package
code --install-extension sql-helper-0.0.1.vsix
