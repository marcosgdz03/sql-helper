# Guía de Contribución - SQL Helper

¡Gracias por tu interés en contribuir a SQL Helper! 🎉

## Cómo Contribuir

### 1. Reportar Bugs

Antes de abrir un issue:
- Verifica que el bug no haya sido reportado ya
- Describe el comportamiento esperado vs. actual
- Incluye pasos para reproducir
- Añade capturas de pantalla si es relevante

**Formato:**
```
Título: [BUG] Descripción breve

Descripción:
Qué sucede mal

Pasos para reproducir:
1. Abre un archivo ...
2. Presiona Ctrl+Alt+S
3. Selecciona...

Comportamiento esperado:
Qué debería ocurrir

Comportamiento actual:
Qué ocurre realmente

Información del sistema:
- OS: Windows/Mac/Linux
- VS Code version: X.X.X
```

### 2. Sugerir Mejoras

**Título:** [FEATURE] Descripción de la mejora

**Descripción:**
- Por qué es útil
- Casos de uso
- Ejemplos de código si aplica

### 3. Enviar Code

#### Setup Local

```bash
# 1. Fork y clonar el repo
git clone https://github.com/TU-USUARIO/sql-helper.git
cd sql-helper

# 2. Instalar dependencias
npm install

# 3. Compilar en modo watch
npm run watch
```

#### Estructura del Proyecto

```
src/
├── extension.ts          # Punto de entrada principal
├── snippets/            # Módulos de snippets por lenguaje
│   ├── sqlSnippets.ts
│   ├── javaSnippets.ts
│   ├── pythonSnippets.ts
│   └── jsSnippets.ts
└── utils/
    └── helpers.ts       # Funciones auxiliares compartidas
```

#### Reglas de Código

1. **TypeScript**: Usa tipos explícitos, evita `any`
2. **Naming**: camelCase para variables/funciones, PascalCase para clases/interfaces
3. **Comentarios**: Usa JSDoc para funciones públicas
4. **Logging**: Utiliza `logInfo()` y `logError()` en lugar de `console.log()`
5. **Errores**: Maneja siempre posibles excepciones

#### Ejemplo - Agregar un nuevo snippet SQL

```typescript
// src/snippets/sqlSnippets.ts

// 1. Agregar al array sqlItems:
{ 
    label: '📖 SELECT ejemplo', 
    snippet: 'SELECT * FROM ${1:tabla} WHERE ${2:condicion};', 
    description: 'Descripción breve' 
},

// 2. Los snippets siguen este formato:
// - label: Nombre visible (con emoji para categoría)
// - snippet: Código con placeholders ${N:placeholder}
// - description: Texto corto que aparece en la búsqueda
```

#### Testing

```bash
# Compilar y ejecutar tests
npm run test

# Linting
npm run lint

# Build para producción
npm run vscode:prepublish
```

#### Commits

Usa mensajes claros y descriptivos:

```
[FEATURE] Agregar snippets para PostgreSQL
[FIX] Corregir escaping en snippets multilinea
[DOCS] Actualizar README con ejemplos
[REFACTOR] Mejorar structure helpers.ts
[TEST] Agregar tests para sqlSnippets
```

### 4. Pull Request

1. Crea una rama: `git checkout -b feature/mi-mejora`
2. Commit con mensajes claros
3. Push a tu fork: `git push origin feature/mi-mejora`
4. Abre PR hacia `main`

**Descripción del PR:**
- Qué cambios hace
- Por qué son necesarios
- Cómo testearlo
- Screenshots si corresponde

## Desarrollo de Snippets

### Nuevo Snippet SQL

```typescript
{
    label: '📖 Nombre del snippet',
    snippet: 'SELECT ${1:placeholder} FROM ${2:tabla};',
    description: 'Descripción breve para la búsqueda'
}
```

### Placeholder Variables

- `${1:nombre}` - Primer placeholder (tab para ir al siguiente)
- `${2:valor}` - Segundo placeholder
- `${1|opción1|opción2|}` - Con opciones

### Emojis por Categoría (SQL)

- 📖 Lecturas (SELECT)
- ✏️ Escritura (INSERT, UPDATE, DELETE)
- 🏗️ Estructura (CREATE TABLE)
- 🔧 Modificación (ALTER TABLE)
- 🗂️ Índices (INDEX)
- ⭐ Avanzado (JOINs, UNION, SUBQUERIES)
- 🔤 Funciones de string
- 📅 Funciones de fecha
- 🎯 Objetos BD (VIEW, TRIGGER)
- 📄 Utilidades (archivos)

## Directrices Generales

✅ **SÍ:**
- Prueba localmente antes de subir
- Mantén el código limpio y legible
- Sigue la estructura existente
- Documenta cambios complejos
- Sé respetuoso en discusiones

❌ **NO:**
- No hagas refactoring masivo sin discutir primero
- No agregues dependencias sin justificación
- No ignores los errores de linting
- No rompas compatibilidad backward

## Contacto

- **Issues**: GitHub Issues
- **Discussiones**: GitHub Discussions
- **Email**: [tu-email si lo deseas]

---

**¡Gracias por mejorar SQL Helper! 🚀**
