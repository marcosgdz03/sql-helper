# 🔒 Política de Seguridad

## Información General

SQL Helper se compromete con la seguridad y privacidad de sus usuarios. Este documento describe cómo manejamos la seguridad en el proyecto.

## Nunca Incluyas Secretos

**IMPORTANTE**: Nunca incluyas en commits:
- 🔐 Tokens de acceso personal (PAT)
- 🔐 Contraseñas
- 🔐 Claves API
- 🔐 Certificados privados
- 🔐 Información sensible

### Archivos Ignorados Automáticamente

El proyecto incluye `.gitignore` y `.vscodeignore` que excluyen:
```
token.txt
.env
.env.local
*.key
*.pem
secrets.json
.secrets
```

## Credentials y Configuración

### Para Desarrollo Local

1. **Crear archivo `.env.local`** (no se sube a git):
```bash
VSCODE_PAT=tu_token_aqui
DB_PASSWORD=tu_contraseña_aqui
```

2. **Usar variables de entorno**:
```typescript
const pat = process.env.VSCODE_PAT;
```

3. **Nunca hardcodear** secretos en el código

### Para Publicar en Marketplace

1. **Usar Azure DevOps**:
   - Ve a https://dev.azure.com/_usersSettings/tokens
   - Crea Personal Access Token
   - Guárdalo **SOLO localmente**
   - No lo compartas en GitHub

2. **Usar con vsce**:
```bash
# Interactivo (pregunta por token)
vsce publish

# O con variable de entorno
export VSCODE_PAT=tu_token
vsce publish
```

3. **Verificar antes de push**:
```bash
git status
# No debe mostrar token.txt, .env, *.key, etc.
```

## Si Accidentalmente Hiciste Push de Secretos

### Acción Inmediata

1. **Regenera los tokens** en Azure DevOps:
   - https://dev.azure.com/_usersSettings/tokens
   - Delete el token expuesto
   - Crea uno nuevo

2. **Remove del histórico de git**:
```bash
# Opción 1: Rewrite history (cuidado)
git filter-branch --tree-filter 'rm -f token.txt' HEAD

# Opción 2: Usar BFG (más seguro)
bfg --delete-files token.txt
bfg --replace-text secrets.txt

# Push al repo remoto
git push --force
```

3. **Notifica** al propietario del repositorio

## Reportar Vulnerabilidades de Seguridad

Si encuentras una vulnerabilidad de seguridad:

1. **NO la publiques en GitHub Issues** (es público)
2. **Contacta privadamente** al maintainer:
   - Email: [propietario@example.com]
   - O vía GitHub Security Advisory

3. **Incluye**:
   - Descripción del problema
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de fix (opcional)

4. **Plazo**: El maintainer responderá en 48 horas

## Buenas Prácticas

### En el Código

✅ **DO:**
```typescript
// Usar variables de entorno
const token = process.env.GITHUB_TOKEN;

// Comentar código sensible
// NEVER log passwords or tokens

// Validar entrada del usuario
if (!username || !password) {
    throw new Error('Invalid credentials');
}
```

❌ **DON'T:**
```typescript
// Hardcodear tokens
const token = "ghp_xxxxxxxxxxx";

// Loguear credenciales
console.log('Password:', password);

// Incluir en comentarios
// TODO: Use token "abc123def456"

// Guardar en archivos
fs.writeFileSync('.env', `PASSWORD=${password}`);
```

### Antes de Hacer Push

```bash
# 1. Verificar cambios
git diff --cached

# 2. Verificar archivos no staged
git status

# 3. Buscar patrones sensibles
grep -r "password\|token\|secret\|key\|pem" src/
grep -r "process.env" src/  # Debería estar vacío

# 4. Si viste algo sensible
git reset HEAD nombre_archivo
rm nombre_archivo
git add .gitignore
git commit -m "Add sensitive files to gitignore"
```

### Setup Seguro Local

```bash
# 1. Crear .env.local (nunca commit)
echo "VSCODE_PAT=tu_token" > .env.local
echo ".env.local" >> .gitignore

# 2. Cargar en desarrollo
source .env.local  # Linux/Mac
set /p VSCODE_PAT=< .env.local  # Windows

# 3. Usar en scripts
vsce publish --pat $VSCODE_PAT
```

## Dependencias Seguras

- Revisar `package.json` regularmente
- Ejecutar: `npm audit`
- Actualizar: `npm update`
- Auditar nuevas dependencias antes de instalar

```bash
# Auditar vulnerabilidades
npm audit

# Arreglr automáticamente
npm audit fix

# Auditar solo prod
npm audit --production
```

## Histórico de Cambios de Seguridad

| Fecha | Cambio | Estado |
|-------|--------|--------|
| 2025-12-07 | Removido token.txt | ✅ Fixed |
| 2025-12-07 | Mejorado .gitignore | ✅ Implemented |
| 2025-12-07 | Mejorado .vscodeignore | ✅ Implemented |

## Recursos

- [GitHub Security Advisory](https://github.com/advisories)
- [OWASP Security](https://owasp.org/)
- [npm Security](https://docs.npmjs.com/about-npm-security)
- [VS Code Extension Security](https://code.visualstudio.com/api/working-with-extensions/security)

## Preguntas?

Para preguntas sobre seguridad:
- Abre un GitHub Issue privado (Security Advisory)
- Contacta al maintainer

---

**Última actualización**: 7 de diciembre de 2025

**Gracias por ayudar a mantener SQL Helper seguro!** 🔒
