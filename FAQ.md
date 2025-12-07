# ❓ SQL Helper - Preguntas Frecuentes (FAQ)

## Instalación y Configuración

### P: ¿Cómo instalo SQL Helper?
**R:** Tienes 3 opciones:

1. **Desde VS Code Marketplace** (más fácil):
   - Abre VS Code
   - Ve a Extensiones (Ctrl+Shift+X)
   - Busca "SQL Helper"
   - Haz clic en Instalar

2. **Desde archivo VSIX** (desarrollo):
   ```bash
   npm install
   npm run compile
   vsce package
   code --install-extension sql-helper-*.vsix
   ```

3. **Desde GitHub** (código fuente):
   ```bash
   git clone https://github.com/marcosgdz03/sql-helper.git
   cd sql-java-helper
   npm install
   npm run compile
   ```

---

### P: ¿Qué versiones de VS Code soporta?
**R:** VS Code v1.106.0 o superior

Puedes verificar tu versión:
- VS Code → Help → About

---

### P: ¿Necesito Node.js instalado?
**R:** **No** para usar la extensión en VS Code

Sí necesitas Node.js si quieres:
- Desarrollar/modificar el código
- Compilar TypeScript
- Empaquetar la extensión

---

### P: ¿Los snippets funcionan en todos los archivos?
**R:** Sí, pero la extensión se activa automáticamente cuando:
- Abres un archivo `.sql`
- Abres un archivo `.java`
- Abres un archivo `.py`
- Abres un archivo `.js` o `.ts`

---

## Uso de Snippets

### P: ¿Cómo inserto un snippet?
**R:** Presiona `Ctrl+Alt+S`:

```
1. Ctrl+Alt+S
2. Escribe para buscar (ej: "SELECT")
3. Usa ↑↓ para navegar
4. Presiona Enter para insertar
```

O usa la Paleta de Comandos:
```
Ctrl+Shift+P → "SQL Helper" → Selecciona comando
```

---

### P: ¿Puedo personalizar los keybindings?
**R:** Sí, abre Keyboard Shortcuts:

```
Ctrl+K Ctrl+S → Busca "SQL Helper" → Modifica según necesites
```

Ejemplo de configuración personalizada en `keybindings.json`:
```json
{
    "key": "ctrl+shift+i",
    "command": "sql-helper.insertSnippet",
    "when": "editorLangId == sql"
}
```

---

### P: ¿Qué snippets están disponibles?
**R:** 70+ snippets distribuidos así:

| Lenguaje | Cantidad | Ejemplos |
|----------|----------|----------|
| SQL | 40+ | SELECT, INSERT, UPDATE, CREATE TABLE, JOINs |
| Java | 9+ | SELECT, INSERT, UPDATE, transacciones, pool |
| Python | 15+ | SQLite, MySQL, PostgreSQL, SQLAlchemy |
| JavaScript | 15+ | mysql2, pg, async/await, Sequelize |

Ver todos en `FEATURES.md`

---

### P: ¿Cómo busco un snippet específico?
**R:** Usa palabras clave o emojis:

```
Buscar "SELECT" → Todas las variantes SELECT
Buscar "INSERT" → Todos los INSERT
Buscar "📖" → Solo SELECT (por emoji)
Buscar "✏️" → Solo CRUD (INSERT/UPDATE/DELETE)
Buscar "🏗️" → Solo DDL (CREATE/ALTER)
Buscar "🔗" → Solo conexiones
```

---

### P: ¿Puedo editar los snippets después de insertarlos?
**R:** Sí, los snippets tienen **placeholders** interactivos:

```sql
SELECT * FROM ${1:tabla};
--                  ↑ Presiona Tab para editar cada placeholder
```

Presiona `Tab` para ir al siguiente placeholder.

---

## Analizador SQL

### P: ¿Cómo uso el analizador SQL?
**R:** Presiona `Ctrl+Alt+A`:

```
1. Abre archivo con SQL
2. Ctrl+Alt+A
3. Se muestran errores en:
   - Panel Problems (abajo)
   - QuickPick (selecciona para detalles)
4. Lee las sugerencias
```

---

### P: ¿Qué errores detecta el analizador?
**R:** Detecta 8 tipos:

1. ❌ Falta punto y coma (`;`)
2. ❌ Comillas no balanceadas (`'`, `"`)
3. ❌ Paréntesis desbalanceados
4. ❌ SELECT sin FROM
5. ❌ INSERT sin VALUES
6. ⚠️ **UPDATE/DELETE SIN WHERE** (peligroso)
7. ❌ Palabras reservadas como nombres
8. ❌ Sintaxis inválida

---

### P: ¿El analizador funciona en código Java/Python?
**R:** **Sí**, extrae automáticamente SQL de strings:

```java
// queries.java
String sql = "SELECT * FROM users"  // Falta ;
⌨️ Ctrl+Alt+A → Detecta falta de punto y coma
```

```python
# database.py
sql = "UPDATE users SET name='John'"  # Falta WHERE
⌨️ Ctrl+Alt+A → Detecta UPDATE sin WHERE
```

---

### P: ¿Qué significa "UPDATE/DELETE SIN WHERE"?
**R:** Es una advertencia de seguridad:

```sql
UPDATE users SET active = 0
-- ⚠️ PELIGRO: Actualiza TODOS los usuarios!
-- ✅ Correcto:
UPDATE users SET active = 0 WHERE id = 5
```

Sin WHERE, afecta a **TODOS** los registros.

---

### P: ¿Los errores aparecen en tiempo real?
**R:** No, debes presionar `Ctrl+Alt+A` para analizar.

Próximas versiones pueden agregar análisis en tiempo real.

---

## Formateador SQL

### P: ¿Cómo formato una consulta SQL?
**R:** Presiona `Ctrl+Alt+F`:

```
1. Selecciona tu SQL (o todo el archivo)
2. Ctrl+Alt+F
3. Se reformatea automáticamente
```

**Antes**:
```sql
SELECT a.id,a.name FROM users a WHERE a.active=1
```

**Después**:
```sql
SELECT a.id, a.name
FROM users a
WHERE a.active = 1
```

---

### P: ¿Qué cambios hace el formateador?
**R:**
- Añade saltos de línea en keywords (SELECT, FROM, WHERE, etc.)
- Limpia espacios en blanco excesivos
- Mantiene comillas y strings intactos
- Preserva comentarios

---

### P: ¿Puedo personalizar el formato?
**R:** Actualmente no, pero próximas versiones lo permitirán.

Por ahora, sigue el formato estándar que genera.

---

## Troubleshooting

### P: Los snippets no aparecen
**R:** Intenta:

1. **Verificar archivo**: ¿Tiene extensión correcta? (.sql, .java, .py, .js, .ts)
2. **Recargar VS Code**: Ctrl+R
3. **Verificar extensión habilitada**: 
   - Extensions → SQL Helper → debe estar habilitado
4. **Reinstalar**:
   ```
   Desinstala desde Extensions
   Reinicia VS Code
   Instala nuevamente desde Marketplace
   ```

---

### P: El analizador no muestra errores
**R:** Verifica:

1. **Presionaste Ctrl+Alt+A**: (no Ctrl+Alt+S)
2. **Hay SQL en el archivo**: Si está vacío, no hay errores
3. **Output Channel**: Abre Output → SQL Helper para logs
4. **Lenguaje correcto**: ¿El archivo es .sql/.java/.py/.js?

---

### P: El formateador no funciona
**R:** Intenta:

1. **Tienes SQL seleccionado**: o se aplica a todo el archivo
2. **Presionaste Ctrl+Alt+F**: (no Ctrl+Alt+S)
3. **SQL válido**: Si es inválido, podría no formatearse
4. **Deshacer si es necesario**: Ctrl+Z para revertir

---

### P: Los keybindings no funcionan
**R:**

1. **Verifica conflictos**: 
   - Preferences → Keyboard Shortcuts
   - Busca el atajo
   - ¿Otro comando lo usa?

2. **Recarga**: Ctrl+R o reinicia VS Code

3. **Personaliza si es necesario**:
   ```
   Ctrl+K Ctrl+S → Busca "SQL Helper"
   → Click en lápiz para editar
   → Presiona nueva combinación
   ```

---

### P: Hay errores en la consola
**R:** 

1. **Abre Developer Console**: Help → Toggle Developer Tools
2. **Busca mensajes rojo**: Son los errores
3. **Copia el error y** [reporta en GitHub](https://github.com/marcosgdz03/sql-helper/issues)

---

## Características

### P: ¿Cuál es la diferencia entre los 3 comandos?
**R:**

| Comando | Atajo | Función |
|---------|-------|---------|
| **Insertar Snippet** | `Ctrl+Alt+S` | Abre menú para insertar código |
| **Analizar SQL** | `Ctrl+Alt+A` | Detecta errores SQL |
| **Formatear SQL** | `Ctrl+Alt+F` | Reformatea para legibilidad |

---

### P: ¿Puedo usar los snippets en otros IDEs?
**R:** **No**, SQL Helper es exclusivo para VS Code.

Pero puedes:
- Copiar el código de los snippets manualmente
- Ver todos los snippets en `FEATURES.md`
- Crear tus propios snippets en otros IDEs

---

### P: ¿Los snippets incluyen manejo de errores?
**R:** **Sí**, los snippets de Java/Python/JavaScript incluyen:

```java
try (Connection conn = ...) {
    // código
} catch (SQLException e) {
    // manejo de error
}
```

```python
try:
    cursor.execute(...)
except Exception as e:
    conn.rollback()
    raise e
```

---

### P: ¿Soporta transacciones?
**R:** **Sí**, hay snippets específicos:

- **Java**: `🔒 Transacción completa`
- **Python**: `🔒 transfer_money (with transaction)`
- **JavaScript**: `🔒 Transacción con rollback`

---

## Seguridad

### P: ¿SQL Helper almacena mis datos?
**R:** **No**, todo funciona localmente en tu máquina.

- No se envía información a servidores
- Los snippets no contienen datos reales (solo placeholders)
- Los logs se guardan solo en el Output Channel

---

### P: ¿Es seguro usar los snippets?
**R:** **Sí**, pero recuerda:

1. **Siempre usa PreparedStatements**: Para evitar SQL injection
2. **Nunca hardcodes contraseñas**: Usa variables de entorno
3. **Valida entrada del usuario**: Aunque uses PreparedStatement
4. **Revisa el código generado**: Antes de usarlo en producción

---

### P: ¿Qué hace el analizador con mis datos?
**R:** 

- **Solo analiza localmente**: No se envía a ningún servidor
- **No almacena datos**: Se borran después del análisis
- **No accede a tu BD**: Solo revisa el texto del SQL

---

## Contribución

### P: ¿Puedo contribuir con nuevos snippets?
**R:** **Sí**, abre un Pull Request en GitHub:

1. Fork el repositorio
2. Añade tus snippets en `src/snippets/*.ts`
3. Prueba localmente: `npm run compile`
4. Commit y Push
5. Abre Pull Request

Ver `CONTRIBUTING.md` para detalles.

---

### P: ¿Puedo reportar bugs?
**R:** **Sí**, usa [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues):

Incluye:
- Versión de VS Code
- Pasos para reproducir
- Archivo de ejemplo (si es posible)
- Mensajes de error

---

### P: ¿Dónde puedo sugerir features?
**R:** Participa en [GitHub Discussions](https://github.com/marcosgdz03/sql-helper/discussions)

O abre un [GitHub Issue](https://github.com/marcosgdz03/sql-helper/issues) con el tag `enhancement`

---

## Performance

### P: ¿Es lenta la extensión?
**R:** **No**, es muy ligera:

- Activación lazy: Solo se carga cuando necesita
- Snippets en memoria: Carga rápida
- Análisis fast: Regex optimizado
- Sin dependencias externas: Cero overhead

---

### P: ¿Cuanto espacio ocupa?
**R:** ~2-3 MB instalada (muy pequeña)

---

## Roadmap Futuro

### P: ¿Qué features llegarán pronto?
**R:** Trabajamos en:

- [ ] SQL Injection detection avanzado
- [ ] Query optimization suggestions
- [ ] Database schema autocompletion
- [ ] Connection testing built-in
- [ ] Support para MongoDB, Firebase
- [ ] Real-time syntax validation
- [ ] Query execution history
- [ ] Snippets para GraphQL

---

### P: ¿Cómo sugiero una feature?
**R:** Abre un issue en GitHub:

1. Ve a [Issues](https://github.com/marcosgdz03/sql-helper/issues)
2. Click "New Issue"
3. Describe qué quieres
4. Explica por qué sería útil

---

## Más Ayuda

### P: ¿Dónde encuentro documentación completa?
**R:** 

- **README.md**: Guía general
- **QUICKSTART.md**: Inicio rápido
- **FEATURES.md**: Documentación detallada
- **CONTRIBUTING.md**: Para contribuidores
- **SECURITY.md**: Política de seguridad
- **INTEGRATION.md**: Para desarrolladores
- **CHANGELOG.md**: Historial de cambios
 - **README.md**: Guía general
 - **QUICKSTART.md**: Inicio rápido
 - **FEATURES.md**: Documentación detallada
 - **CHANGELOG.md**: Historial de cambios
 - **SECURITY.md**: Política de seguridad
 - Para contribuir o reportar mejoras, abre un [GitHub Issue](https://github.com/marcosgdz03/sql-helper/issues) o envía un Pull Request.

### P: ¿Dónde reporto problemas de seguridad?
**R:** 

**NO** abras un issue público.

En su lugar:
1. Lee `SECURITY.md`
2. Contacta a través del formulario seguro en GitHub

---

## Contacto

- 🐛 **Bugs**: [GitHub Issues](https://github.com/marcosgdz03/sql-helper/issues)
- 💡 **Features**: [GitHub Discussions](https://github.com/marcosgdz03/sql-helper/discussions)
- 🔒 **Seguridad**: Ver `SECURITY.md`
- ⭐ **Dale una estrella**: Si te gusta la extensión

---

**¿No encontraste la respuesta? Abre un issue y te ayudaremos! 🚀**
