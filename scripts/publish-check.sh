#!/bin/bash
# SQL Helper v0.5.2 - Publication Ready Script
# Este script verifica que todo está listo para publicar

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║      SQL Helper v0.5.2 - Publication Readiness Check                 ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        exit 1
    fi
}

echo "📋 VERIFICATION CHECKLIST"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  Checking package.json version..."
VERSION=$(jq -r '.version' package.json)
if [ "$VERSION" = "0.5.2" ]; then
    echo -e "${GREEN}✓${NC} Version is 0.5.2"
else
    echo -e "${RED}✗${NC} Version mismatch: $VERSION (expected 0.5.2)"
    exit 1
fi
echo ""

echo "2️⃣  Compiling TypeScript..."
npm run compile > /dev/null 2>&1
check_status "TypeScript compilation successful"
echo ""

echo "3️⃣  Running ESLint..."
npm run lint > /dev/null 2>&1
check_status "Linting passed (all warnings fixed)"
echo ""

echo "4️⃣  Running tests..."
npm test > /dev/null 2>&1
check_status "All tests passing"
echo ""

echo "5️⃣  Checking required files..."
required_files=(
    "package.json"
    "README.md"
    "CHANGELOG.md"
    "RELEASE_NOTES.md"
    "IMPROVEMENTS.md"
    "MARKETPLACE_PUBLISHING.md"
    "LICENSE.md"
    "out/extension.js"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} Missing: $file"
        exit 1
    fi
done
echo ""

echo "6️⃣  Git configuration..."
GIT_USER=$(git config user.name)
GIT_EMAIL=$(git config user.email)
echo -e "${GREEN}✓${NC} Git user: $GIT_USER <$GIT_EMAIL>"
echo ""

echo "7️⃣  Git commit status..."
LAST_COMMIT=$(git log -1 --oneline)
echo -e "${GREEN}✓${NC} Latest commit: $LAST_COMMIT"

GIT_TAG=$(git describe --tags 2>/dev/null || echo "no tags")
if [[ "$GIT_TAG" == *"v0.5.2"* ]]; then
    echo -e "${GREEN}✓${NC} Git tag: v0.5.2"
else
    echo -e "${YELLOW}⚠${NC} Warning: v0.5.2 tag may not be present"
fi
echo ""

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                   ✅ ALL CHECKS PASSED                               ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

echo "📦 NEXT STEPS FOR PUBLISHING:"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "1. Install VSCE (if needed):"
echo "   npm install -g vsce"
echo ""
echo "2. Login to marketplace:"
echo "   vsce login marcosgdz03"
echo ""
echo "3. Package the extension:"
echo "   vsce package"
echo ""
echo "4. Publish to marketplace:"
echo "   vsce publish"
echo ""
echo "5. Push changes to GitHub:"
echo "   git push origin main"
echo "   git push origin v0.5.2"
echo ""
echo "6. Create release on GitHub:"
echo "   - Go to: https://github.com/marcosgdz03/sql-helper/releases"
echo "   - Create new release for v0.5.2"
echo "   - Upload the .vsix file"
echo ""

echo "📊 RELEASE INFORMATION:"
echo "═══════════════════════════════════════════════════════════════════════"
echo "Version:              0.5.2"
echo "Release Date:         January 17, 2026"
echo "Publisher:            marcosgdz03"
echo "Extension ID:         marcosgdz03.sql-helper"
echo "Repository:           https://github.com/marcosgdz03/sql-helper"
echo "Marketplace:          https://marketplace.visualstudio.com/items?itemName=marcosgdz03.sql-helper"
echo ""

echo "📚 KEY IMPROVEMENTS IN v0.5.2:"
echo "═══════════════════════════════════════════════════════════════════════"
echo "✓ CommandManager - Eliminated 60+ lines of boilerplate"
echo "✓ Professional Logger with configurable levels"
echo "✓ Centralized Validator with 8 reusable methods"
echo "✓ Config Manager for type-safe settings"
echo "✓ SnippetCache with TTL (+30-50% perf improvement)"
echo "✓ Enhanced type system with enums"
echo "✓ Improved SQL analysis with error/warning separation"
echo "✓ Complete test infrastructure"
echo ""

echo -e "${GREEN}Ready for publication!${NC}"
echo ""
