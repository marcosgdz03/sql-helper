# 🤖 SQL Helper - Agentes Disponibles

Este documento describe los agentes disponibles para interactuar con el proyecto SQL Helper.

---

## 📋 Tabla de Agentes

| Agente | Descripción | Uso Principal |
|--------|-------------|---------------|
| `api-designer` | Diseño e mejora de APIs con mejores prácticas | Diseño de endpoints REST, GraphQL |
| `bug-investigator` | Diagnóstico y propuestas de arreglos para bugs | Debugging, análisis de errores |
| `code-review` | Realización de revisiones de código estructuradas | Code review antes de merge |
| `devops-helper` | Asistencia con despliegue, CI/CD e infraestructura | Docker, Kubernetes, pipelines |
| `doc-writer` | Generación de documentación clara y útil | Documentación de API, README |
| `feature-builder` | Implementación de features desde requisitos/especificaciones | Desarrollo de nuevas funcionalidades |
| `git-release` | Creación de releases consistentes y changelogs | Versiones, releases semánticos |
| `performance-optimizer` | Mejora del rendimiento y eficiencia de aplicaciones | SQL queries, optimización |
| `project-planner` | Dividir ideas en planes técnicos estructurados | Arquitectura, planificación |
| `refactor-assistant` | Mejorar estructura sin cambiar comportamiento | Refactoring, modernización |
| `security-auditor` | Identificar vulnerabilidades y riesgos de seguridad | Audit, pentesting |
| `system-designer` | Diseñar arquitecturas escalables y mantenibles | Arquitectura de sistemas |
| `test-generator` | Generar tests para asegurar confiabilidad del código | Jest, unittest, pytest |

---

## 🎯 Categorización de Agentes

### 🧠 **Exploración y Análisis**
- `code-search_*` (herramientas nativas)
  - Exploración de codebase
  - Búsqueda de código
  - Análisis de dependencias
  - Detección de duplicados

### 🔨 **Desarrollo e Implementación**
- `feature-builder` - Implementación de nuevas features
- `refactor-assistant` - Mejoras estructurales
- `system-designer` - Diseño arquitectónico
- `api-designer` - Diseño de APIs

### ✅ **Calidad y Pruebas**
- `test-generator` - Generación de tests
- `bug-investigator` - Diagnóstico de bugs
- `code-review` - Revisiones de código

### 🚀 **Despliegue e Infraestructura**
- `devops-helper` - CI/CD, Docker, infraestructura
- `git-release` - Versiones y changelogs

### 🛡️ **Seguridad**
- `security-auditor` - Auditoría de seguridad

### 📚 **Documentación**
- `doc-writer` - Generación de documentación
- `project-planner` - Planificación técnica

---

## 📖 Guía de Uso

### 🧪 **Desarrollo de Features**

```bash
# Para implementar una nueva funcionalidad
/agent feature builder
  - Describe la feature requerida
  - Proporciona especificaciones
  - Define requisitos técnicos
```

### 🔍 **Análisis de Código**

```bash
# Para diagnosticar problemas
/agent bug investigator
  - Proporciona el error o bug
  - Describe el contexto
  - Pide diagnóstico
```

### 📈 **Optimización**

```bash
# Para mejorar rendimiento
/agent performance optimizer
  - Describe las métricas
  - Proporciona el código
  - Pide análisis de rendimiento
```

### 🔒 **Auditoría de Seguridad**

```bash
# Para auditar código
/agent security auditor
  - Proporciona el código a auditar
  - Define el tipo de riesgo a evaluar
```

---

## 💡 Ejemplos Comunes de Uso

### ✅ Flujos de Trabajo Recomendados

#### 1. **Nuevo Feature**
```
/agent feature-builder
1. Describe la feature requerida
2. Proporciona especificaciones
3. Agrega agente code-review para revisión
4. Agrega test-generator para pruebas
```

#### 2. **Refactorización**
```
/agent refactor-assistant
1. Define los objetivos del refactor
2. Mantiene el comportamiento actual
3. Agrega performance-optimizer si es necesario
```

#### 3. **Pre-release**
```
/agent code-review (revisión de código)
/agent test-generator (verificar tests)
/agent git-release (crear changelog)
```

#### 4. **Pre-deploy**
```
/agent devops-helper
1. Prepara configuración de despliegue
2. Verifica CI/CD pipelines
3. Prepara documentación (doc-writer)
```

---

## 🎭 Agentes nativos de opencode

Estos agentes vienen incorporados en opencode y están disponibles por defecto:

```markdown
✅ api-designer
✅ bug-investigator
✅ code-review
✅ devops-helper
✅ doc-writer
✅ feature-builder
✅ git-release
✅ performance-optimizer
✅ project-planner
✅ refactor-assistant
✅ security-auditor
✅ system-designer
✅ test-generator
```

---

## 📝 Herramientas GitHub API

Además de los agentes, puedes usar directamente las herramientas de GitHub API:

```bash
# Crear/issues
github_create_issue

# Crear pull requests
github_create_pull_request

# Buscar repositorios
github_search_repositories

# Mover/actualizar archivos
github_push_files
```

---

## 🔄 Integración con el proyecto SQL Helper

Estos agentes pueden ayudar en:

- ✅ **Generar nuevos snippets** (feature-builder + doc-writer)
- ✅ **Analizar queries SQL** (performance-optimizer + bug-investigator)
- ✅ **Revisar extension.ts** (code-review + refactor-assistant)
- ✅ **Crear documentación** (doc-writer)
- ✅ **Preparar releases** (git-release)
- ✅ **Optimizar SQL queries** (performance-optimizer)

---

## 📚 Notas

- Los agentes nativos de opencode se invocan automáticamente con `/agent [nombre]`
- Puedes combinar múltiples agentes para flujos de trabajo complejos
- Documenta siempre los cambios en CHANGELOG.md (git-release)
- Revisa el código antes de commits (code-review)

---

## 🆕 ¿Qué más podrías añadir aquí?

### **Sección de Ejemplos Prácticos con SQL Helper**

#### Ejemplo 1: Añadir nuevo snippet con feature-builder + test-generator

```bash
/agent feature builder
  - Feature: Generador de queries con UNION/INTERSECT
  - Especificaciones: Soporta MySQL/PostgreSQL, con validación de syntax
  - Integración: Auto-detección de dialecto de BD
```

**Siguientes pasos:**
1. `/agent code-review` (revisar implementación)
2. `/agent test-generator` (generar tests para el snippet)
3. `/agent doc-writer` (documentar el nuevo snippet)
4. `/agent git-release` (actualizar changelog)

#### Ejemplo 2: Optimización de Query SQL con performance-optimizer

```bash
/agent performance optimizer
  - Query: SELECT * FROM users WHERE created_at > ? ORDER BY name DESC LIMIT 10
  - Métricas: 150ms actualmente
  - Objetivo: < 100ms en 10k rows
```

**Posibles sugerencias del agente:**
- Añadir índice compuesto en `(created_at, name)`
- Usar LIMIT/OFFSET alternativos para paginación
- Considerar materialized views para ordenamientos frecuentes

#### Ejemplo 3: Auditoría de Seguridad con security-auditor

```bash
/agent security auditor
  - Código: AuthUtils.ts (gestión de tokens JWT)
  - Riesgo a evaluar: Vulnerabilidades de inyección SQL
  - Tipo de ataque: Authentication bypass
```

---

### **Flujos de Trabajo Personalizados para SQL Helper**

#### Flujo: Desarrollo de Nuevo Snippet

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  feature-   │────>│ code-review │────>│  test-       │────>│ doc-writer  │
│  builder     │     │             │     │  generator   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                 │                    │                    │
       │                 │                    │                    │
       v                 v                    v                    v
  Crear         Revisar             Generar tests           Documentar
  snippet          código              coverage              en README
```

#### Flujo: Refactorización de Código Existente

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  performance │────>│ refactor-   │────>│ code-review │
│  optimizer   │     │ assistant   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                 │                    │
       │                 │                    │
       v                 v                    v
  Analizar         Mejorar             Verificar
  rendimiento      estructura          comportamiento
```

#### Flujo: Preparación para Release

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ code-review │────>│ test-       │────>│ git-release │────>│ doc-writer  │
│             │     │ generator   │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                 │                    │                    │
       │                 │                    │                    │
       v                 v                    v                    v
  Revisión         Tests                Changelog              Release notes
  de código         coverage        versión                   documentación
```

---

### **Comandos de Invocación Rápidos**

#### En VS Code (Chat Sidebar)

```bash
# Invocar agente específico
/agent feature builder - "Crear snippet para..."
/agent bug investigator - "Analizar error en..."
```

#### En ChatGPT/Copilot

```bash
# Prompt para SQL Helper
"You are opencode agent. Context: SQL Helper extension development. Task: ..."
```

#### Comandos Cortos (Macros)

```bash
# Definir alias en .vscode/settings.json:
{
  "quickPick.commands": [
    {
      "command": "/agent feature builder",
      "label": "✨ Nuevo Snippet"
    },
    {
      "command": "/agent code review", 
      "label": "🔍 Revisar Código"
    },
    {
      "command": "/agent test generator",
      "label": "🧪 Generar Tests"
    }
  ]
}
```

---

### **Best Practices y Recomendaciones**

#### ✅ DO (Haz esto)

- **Combinar agentes** para tareas complejas
- **Revisar código** antes de cada commit
- **Generar tests** cuando agregues nuevas funcionalidades
- **Usar performance-optimizer** para SQL queries críticas
- **Documentar** cada cambio importante

#### ❌ DON'T (No hagas esto)

- No usar `/agent system designer` para cambios menores
- No confiar solo en `/agent test generator` sin revisión manual
- No usar `/agent refactor-assistant` sin documentar el propósito
- No ignorar las sugerencias de `/agent security auditor`
- No commitear sin pasar por `/agent code-review`

---

### **Limitaciones y Consideraciones**

#### Contexto Mínimo por Agente

| Agente | Mínimo requerido | Máximo recomendado |
|--------|------------------|--------------------|
| `feature-builder` | 3-5 propiedades | 10-15 propiedades |
| `code-review` | Código completo | N/A |
| `test-generator` | Función a testear | TODO suite |
| `performance-optimizer` | Query + contexto | Dashboard completo |
| `security-auditor` | Función/module | Proyecto completo |

#### Tiempos de Respuesta Estimados

- **Herramientas nativas**: 1-2 segundos
- `feature-builder`: 5-15 segundos
- `code-review`: 2-5 segundos
- `test-generator`: 5-20 segundos
- `performance-optimizer`: 10-30 segundos

#### Recursos Necesarios

- **RAM mínima**: 2GB para operaciones complejas
- **CPU**: 2 núcleos recomendados
- **LocalStorage**: 100MB+ para contextos grandes

---

### **Ejemplo Completo: Agregar Snippet de JOIN Avanzado**

#### Paso 1: Definir el Feature

```bash
/agent feature builder
  - Feature: Snippet para JOIN con LEFT+INNER combinados
  - Especificaciones:
    - Soporta MySQL y PostgreSQL
    - Incluye comentarios de optimización
    - Parámetros: tabla_principal, tabla_sec, condiciones
    - Variables configurables
```

#### Paso 2: Revisión y Tests

```bash
/agent code-review
/agent test-generator
```

#### Paso 3: Documentación

```bash
/agent doc-writer
  - Actualizar snippets/*.json
  - Añadir a README.md
  - Crear example en documentation
```

#### Paso 4: Release

```bash
/agent git-release
  - Verificar CHANGELOG.md
  - Añadir versión nueva
```

---

### **Checklist Antes de Merge**

- [ ] Código revisado con `code-review`
- [ ] Tests generados y aprobados
- [ ] Documentation actualizada
- [ ] CHANGELOG actualizado
- [ ] No hay vulnerabilidades de seguridad
- [ ] Performance óptima verificada

---

### **Integración con GitHub Actions**

Puedes incluir flujos de trabajo de agentes en tus CI pipelines:

```yaml
# .github/workflows/test.yml
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    - name: Generate tests
      run: /agent test-generator
      
    - name: Review code
      run: /agent code-review
      
    - name: Run tests
      run: npm test
      
  security:
    - name: Security audit
      run: /agent security-auditor
```

---

### **Métricas de Éxito de Agentes**

Para rastrear la efectividad de los agentes:

- **Coverage de tests**: > 80% objetivo
- **Tiempo de review automática**: < 5 segundos
- **Detección de bugs**: 100% de críticas conocidas
- **Mejora de performance**: 30%+ en queries críticas

---

### **Recursos Adicionales**

- 📚 [Documentación oficial de opencode](https://opencode.ai)
- 📖 [Guía de uso de agentes](https://github.com/opencode-ai/opencode/docs)
- 💬 [Discusión de comunidad](https://github.com/opencode-ai/opencode/discussions)
- 🐛 [Reportar bugs en agentes](https://github.com/opencode-ai/opencode/issues)

---

### **Siguientes Pasos Sugeridos**

1. **Prueba los agentes** con tu código actual
2. **Configura aliases** en VS Code para acceso rápido
3. **Crea flujos personalizados** según tus necesidades
4. **Establece métricas** para medir mejora
5. **Documenta ejemplos** en tu repositorio

---

*Última actualización: 2026-05-03*
