# Guía de Publicación - SQL Helper

## Antes de Publicar

### Checklist Pre-Publicación

- [ ] Todos los tests pasan: `npm test`
- [ ] No hay errores de linting: `npm run lint`
- [ ] Compilación sin errores: `npm run compile`
- [ ] `package.json` versión actualizada
- [ ] `CHANGELOG.md` actualizado con cambios
- [ ] `README.md` reflejaba todas las características
- [ ] Probado en Windows, Mac y Linux (si es posible)
- [ ] Probado en VS Code 1.106+
- [ ] Screenshots/GIFs de características nuevas listos

## Proceso de Publicación

### 1. Actualizar Versión

```json
// package.json
{
  "version": "0.1.0"
}
```

Seguir [Semantic Versioning](https://semver.org/es/):
- **MAJOR**: Cambios incompatibles (rompedor)
- **MINOR**: Nuevas características (compatible)
- **PATCH**: Correcciones de bugs (compatible)

### 2. Actualizar CHANGELOG

```markdown
## [0.1.0] - 2025-12-07

### ✨ Agregado
- Feature 1
- Feature 2

### 🔧 Mejorado
- Improvement 1

### 🐛 Corregido
- Bug fix 1
```

### 3. Commit y Tag

```bash
# Commit de versión
git add package.json CHANGELOG.md
git commit -m "Release v0.1.0"

# Tag
git tag -a v0.1.0 -m "Release version 0.1.0"

# Push
git push origin main
git push origin v0.1.0
```

### 4. Generar VSIX (Visual Studio Code Extension)

```bash
# Instalar vsce (si no lo tienes)
npm install -g vsce

# Empaquetar
vsce package

# Se crea: sql-helper-0.1.0.vsix
```

### 5. Publicar en VS Code Marketplace

#### Opción A: CLI (Recomendado)

```bash
# Obtener Personal Access Token (PAT) en:
# https://dev.azure.com/marcosgdz03/_usersSettings/tokens

# Publicar
vsce publish

# O especificar versión/patch:
vsce publish patch    # 0.0.5 -> 0.0.6
vsce publish minor    # 0.0.5 -> 0.1.0
vsce publish major    # 0.0.5 -> 1.0.0
vsce publish 0.1.0    # Versión específica
```

#### Opción B: Web UI

1. Ve a: https://marketplace.visualstudio.com
2. Login con cuenta Microsoft
3. "Create publisher" si es primera vez (marcosgdz03)
4. Upload VSIX manualmente
5. Fill metadata (descripción, screenshots, etc.)

### 6. Verificar Publicación

```bash
# Esperar 5-15 minutos para propagación
# Luego buscar "SQL Helper" en VS Code Marketplace
# o ir a: https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper
```

## Después de Publicar

### Anunciar Release

1. **GitHub Release Page**
   - Ve a: https://github.com/marcosgdz03/sql-helper/releases
   - Click "Draft a new release"
   - Tag: v0.1.0
   - Title: SQL Helper v0.1.0
   - Description: Copy from CHANGELOG.md
   - Adjuntar VSIX file
   - Publish release

2. **Redes Sociales** (Opcional)
   - Tweet con hashtags: #VSCode #SQL #Developer
   - Linkedin post
   - Discord/Slack si está en communities

3. **Actualizar README**
   - Agregar link a marketplace
   - Actualizar badges (versión, downloads)

## Troubleshooting

### Error: "The Personal Access Token (PAT) used has expired"

```bash
# Crear nuevo PAT en:
# https://dev.azure.com/marcosgdz03/_usersSettings/tokens

# Reautenticar
vsce login marcosgdz03
```

### Error: "publisher does not match"

```bash
# El publisher en package.json debe coincidir
{
  "publisher": "marcosgdz03"
}
```

### Error: "Invalid manifest"

```bash
# Validar package.json
vsce ls

# Debe mostrar todos los archivos necesarios
```

### Extension no aparece en marketplace

- Esperar 15-20 minutos (propagación normal)
- Verificar que VS Code se reinició
- Limpiar caché: Ctrl+Shift+P > "Clear Extension Cache"
- Buscar por versión exacta "marcosgdz03.sql-helper 0.1.0"

## Versionado y Releases

### Histórico de Versiones

- **v0.0.1-0.0.5**: Alpha/Beta - Features iniciales
- **v0.1.0**: Refactorización, 70+ snippets, documentación completa
- **v0.2.0+**: Próximas mejoras

### Estrategia de Publicación

- **Releases majores**: Cambios arquitectónicos grandes
- **Releases menores**: Nuevos snippets, features, mejoras
- **Patches**: Bug fixes, correcciones menores
- **Pre-releases**: Alpha/Beta con tag `-alpha.1`, `-beta.1`

```bash
# Pre-release
vsce publish --pre-release 0.1.0-beta.1

# Release estable
vsce publish 0.1.0
```

## Recursos

- [Official vsce docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [VS Code Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Semantic Versioning](https://semver.org/es/)
- [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)

---

**¡Listo para publicar SQL Helper! 🚀**
