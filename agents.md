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

*Última actualización: 2026-05-03*
