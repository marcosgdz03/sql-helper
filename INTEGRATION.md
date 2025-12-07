# 🛠️ SQL Helper - Guía de Integración para Desarrolladores

## Tabla de Contenidos
1. [Arquitectura](#arquitectura)
2. [Estructura del Código](#estructura-del-código)
3. [API de Comandos](#api-de-comandos)
4. [Integración con Otros IDEs](#integración-con-otros-ides)
5. [Extensión de Funcionalidades](#extensión-de-funcionalidades)

---

## 🏗️ Arquitectura

### Componentes Principales

```
┌─────────────────────────────────────────────┐
│         VS Code Extension Framework          │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────┐         ┌──────▼─────┐
    │Command │         │ Diagnostics│
    │Manager │         │Collection  │
    └────┬───┘         └─────┬──────┘
         │                   │
    ┌────▼───────────────────▼──────┐
    │       extension.ts             │
    │    (Main Entry Point)          │
    └──────────┬─────────────────────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    │          │          │          │          │
┌───▼──┐  ┌───▼──────┐ ┌─▼────┐  ┌─▼─────┐ ┌──▼────┐
│Helper│  │MySqlHelper│ │Snippets   │Logging│
│Index │  │.ts        │ │Factory    │Output │
└──────┘  └────┬──────┘ └─┬────┘  └───────┘ └───────┘
               │          │
               │     ┌─────┴──────┬─────────┬──────────┐
               │     │            │         │          │
         ┌─────▼────┐│  ┌──────┐┌─▼─┐   ┌─▼──┐ ┌─────▼───┐
         │Error     ││  │Python││JS  │   │Java│ │SQL      │
         │Detection ││  │      ││    │   │    │ │Snippets │
         │& Formatting            │     │    │ │         │
         └──────────┘│  └──────┘└────┘   └────┘ └─────────┘
                     │
         ┌───────────▼────────────────┐
         │   types.ts (Interfaces)    │
         └────────────────────────────┘
```

### Flujo de Ejecución

```
1. Usuario presiona Ctrl+Alt+S
   ↓
2. VS Code dispara evento "sql-helper.insertSnippet"
   ↓
3. extension.ts registra el comando
   ↓
4. Se detecta el lenguaje del archivo
   ↓
5. Se llama a la fábrica de snippets correspondiente
   ↓
6. Se abre QuickPick con opciones
   ↓
7. Usuario selecciona snippet
   ↓
8. Se inserta en el editor
   ↓
9. Se registra en el Output Channel
```

---

## 📁 Estructura del Código

### Archivos Principales

```
src/
├── extension.ts              # Punto de entrada, registro de comandos
├── types.ts                  # Interfaces compartidas
├── helpers.ts                # Funciones de utilidad
├── utils/
│   └── mySqlHelper.ts        # Analizador y formateador SQL
└── snippets/
    ├── sqlSnippets.ts        # Snippets SQL (40+)
    ├── javaSnippets.ts       # Snippets Java (9+)
    ├── pythonSnippets.ts     # Snippets Python (15+)
    └── jsSnippets.ts         # Snippets JavaScript (15+)
```

### Archivos de Configuración

```
root/
├── package.json              # Manifest, dependencias, comandos
├── tsconfig.json             # Configuración TypeScript
├── eslint.config.mjs         # Reglas de linting
├── .gitignore                # Exclusiones git (secrets, node_modules)
├── .vscodeignore             # Exclusiones del VSIX
└── Documentación/
    ├── README.md             # Guía principal
    ├── QUICKSTART.md         # Inicio rápido
    ├── CHANGELOG.md          # Historial de versiones
    ├── FEATURES.md           # Características detalladas
    ├── CONTRIBUTING.md       # Guía para contribuidores
    ├── SECURITY.md           # Política de seguridad
    └── PUBLISHING.md         # Guía de publicación
```

---

## 🔌 API de Comandos

### Comando: `sql-helper.insertSnippet`

**Descripción**: Inserta un snippet de código según el lenguaje

**Keybinding**: `Ctrl+Alt+S` / `Cmd+Alt+S`

**Lenguajes soportados**: sql, java, javascript, typescript, python

**Implementación**:
```typescript
vscode.commands.registerCommand('sql-helper.insertSnippet', async (editor) => {
    const langId = editor.document.languageId;
    
    // Detectar lenguaje y obtener snippets
    let snippets: SnippetItem[] = [];
    
    switch(langId) {
        case 'sql':
            snippets = getSqlSnippets();
            break;
        case 'java':
            snippets = getJavaSnippets();
            break;
        // ... más lenguajes
    }
    
    // Mostrar QuickPick
    const selected = await vscode.window.showQuickPick(snippets);
    
    // Insertar snippet
    if (selected) {
        await insertSnippet(editor, selected);
    }
});
```

---

### Comando: `sql-helper.analyzeSql`

**Descripción**: Analiza SQL en busca de errores

**Keybinding**: `Ctrl+Alt+A` / `Cmd+Alt+A`

**Lenguajes soportados**: sql, java, javascript, typescript, python

**Características**:
- Extrae SQL de strings en código
- Detecta 8 tipos de errores
- Publica errores en el panel Problems
- Abre QuickPick interactivo

**Implementación**:
```typescript
vscode.commands.registerCommand('sql-helper.analyzeSql', async (editor) => {
    const document = editor.document;
    
    // Analizar SQL
    const errors = MySqlHelper.detectErrors(text);
    
    // Publicar diagnostics
    MySqlHelper.publishDiagnostics(document, errors);
    
    // Mostrar QuickPick
    const selected = await vscode.window.showQuickPick(errorItems);
    
    // Mostrar detalles
    if (selected) {
        MySqlHelper.showErrorDetails(selected.error);
    }
});
```

---

### Comando: `sql-helper.formatSql`

**Descripción**: Formatea SQL para mejorar legibilidad

**Keybinding**: `Ctrl+Alt+F` / `Cmd+Alt+F`

**Lenguajes soportados**: sql, java, javascript, typescript, python

**Transformaciones**:
- Añade saltos de línea en keywords
- Limpia espacios en blanco
- Mantiene indentación

**Implementación**:
```typescript
vscode.commands.registerCommand('sql-helper.formatSql', async (editor) => {
    const document = editor.document;
    const selection = editor.selection;
    
    // Obtener texto a formatear
    const text = selection.isEmpty ? 
        document.getText() : 
        document.getText(selection);
    
    // Formatear
    const formatted = formatSqlQuery(text);
    
    // Reemplazar en editor
    await editor.edit(editBuilder => {
        editBuilder.replace(range, formatted);
    });
});
```

---

## 🔧 Interfaces y Tipos

### SnippetItem
```typescript
interface SnippetItem {
    label: string;           // Texto mostrado en QuickPick
    snippet: string;         // Código a insertar
    description?: string;    // Descripción adicional
}
```

### SqlError
```typescript
interface SqlError {
    type: string;            // "Falta punto y coma", etc.
    description: string;     // Descripción del error
    suggestion: string;      // Sugerencia de corrección
    line?: number;          // Número de línea
}
```

---

## 🎨 Clase MySqlHelper

### Métodos Públicos

#### `analyzeSql(editor: TextEditor): Promise<void>`
Analiza el documento actual y publica diagnostics

#### `detectErrors(text: string): SqlError[]`
Detecta errores SQL en texto

#### `publishDiagnostics(document: TextDocument, errors: SqlError[]): void`
Publica errores en el panel Problems

#### `showErrorDetails(error: SqlError): void`
Muestra ventana modal con detalles del error

---

## 📝 Logging

El sistema utiliza un Output Channel para logging:

```typescript
import { logInfo, logError } from './helpers';

// Logging de información
logInfo('Análisis SQL completado', 3);  // 3 errores

// Logging de errores
logError('Error en análisis SQL', error.message);
```

**Output**: Abre Output Channel → SQL Helper

---

## 🚀 Extensión de Funcionalidades

### Agregar un Nuevo Lenguaje

1. **Crear archivo de snippets**:
```typescript
// src/snippets/goSnippets.ts

import { SnippetItem } from '../types';

export function getGoSnippets(): SnippetItem[] {
    return [
        {
            label: '🔗 MySQL Connection',
            snippet: `// Go SQL connection\nimport "database/sql"\nimport _ "github.com/go-sql-driver/mysql"`,
            description: 'Importa driver MySQL para Go'
        },
        // ... más snippets
    ];
}
```

2. **Registrar en extension.ts**:
```typescript
import { getGoSnippets } from './snippets/goSnippets';

case 'go':
    snippets = getGoSnippets();
    break;
```

3. **Actualizar package.json**:
```json
{
    "activationEvents": ["onLanguage:go"],
    "contributes": {
        "commands": [{
            "command": "sql-helper.insertSnippet",
            "when": "editorLangId == sql || editorLangId == go"
        }]
    }
}
```

---

### Agregar Nueva Validación SQL

En `src/utils/mySqlHelper.ts`:

```typescript
private static detectErrors(text: string): SqlError[] {
    const errors: SqlError[] = [];
    
    // Nueva validación: detectar UPDATE con LIMIT
    const updateLimitRegex = /UPDATE.*LIMIT/i;
    if (updateLimitRegex.test(text)) {
        errors.push({
            type: 'UPDATE con LIMIT (no estándar)',
            description: 'MySQL no soporta LIMIT en UPDATE estándar',
            suggestion: 'Usa subconsulta o reescribe la lógica',
            line: 1
        });
    }
    
    return errors;
}
```

---

### Personalizar Snippets

En cualquier archivo de snippets:

```typescript
export function getSnippets(): SnippetItem[] {
    return [
        {
            label: '🎯 Mi Snippet Custom',
            snippet: `// Mi código personalizado\n${1:cursor_aquí}`,
            description: 'Descripción de qué hace'
        }
    ];
}
```

---

## 📦 Testing

### Ejecutar Tests

```bash
npm test
```

### Estructura de Tests

```
src/test/
└── extension.test.ts        # Tests principales
```

### Test de Snippet

```typescript
test('insertSnippet inserta código correcto', async () => {
    // Crear editor mock
    // Ejecutar comando
    // Verificar que el texto fue insertado
});
```

---

## 🔐 Seguridad

### Principios Implementados

1. **No almacenar credenciales**: Todos los ejemplos usan placeholders
2. **Validación de entrada**: Regex seguros sin inyección
3. **Sanitización**: Escapado correcto de caracteres especiales
4. **No modificar archivos del sistema**: Solo edita archivos del usuario

### Secretos a Excluir

```
# .gitignore
.env
.env.local
token.txt
*.key
*.pem
secrets.json
```

---

## 📚 Documentación para Usuarios

- **README.md**: Guía general y features
- **QUICKSTART.md**: Inicio en 5 minutos
- **FEATURES.md**: Documentación detallada de cada feature
- **CHANGELOG.md**: Historial de cambios
- **CONTRIBUTING.md**: Cómo contribuir
- **SECURITY.md**: Política de seguridad

---

## 🐛 Debugging

### Activar Modo Debug

```bash
npm run watch
```

Luego en VS Code: `Run → Start Debugging`

### Logs Disponibles

1. **Output Channel "SQL Helper"**: Logs de la extensión
2. **Developer Console**: Errores de TypeScript
3. **Problems Panel**: Diagnostics y errores

---

## 🔗 Referencias

- [VS Code API Documentation](https://code.visualstudio.com/api)
- [VS Code Extension Examples](https://github.com/microsoft/vscode-extension-samples)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Soporte

Para preguntas sobre integración:
- 📧 Abre issue en GitHub
- 💬 Participa en Discussions

---

**¡Gracias por contribuir a SQL Helper! 🚀**
