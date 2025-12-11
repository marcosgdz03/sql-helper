# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog (https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
- Placeholder for upcoming changes
- Add React and Svelte project generators for JavaScript/TypeScript
- Improve JS generator exports and fix TypeScript typing issues
- Stabilize Python generator modules (common, Flask, FastAPI)
- Split Java generator into framework-specific modules (Spring Boot, Micronaut, Quarkus)
- Add Java version selection (17 / 21) and DB init SQL support
- Add retry-on-connect logic for JDBC/DAO classes
- Generate `init.sql` and wire it into application config for Spring/Micronaut/Quarkus
- Add improved templates for README and build files (Maven/Gradle)
- Fix TypeScript compiler errors and export function names consistently

## [0.5.0] - 2025-12-11
### Added
- ✅ Full project generators:
  - Java: Spring Boot, Micronaut, Quarkus (select framework, framework version, Java 17/21, build tool Maven/Gradle, groupId/artifactId, database selection, init.sql generation, CRUD skeletons).
  - Python: Common generator plus separated Flask and FastAPI modules (virtualenv setup, db module, models & CRUD scaffolding, database init).
  - JavaScript/TypeScript: Express, NestJS, Next.js generators.
- ✅ New JS generators: React and Svelte project skeletons (basic templates and package.json).
- ✅ init.sql creation and integration into application configs (Spring Boot, Micronaut, Quarkus) so DB and tables are created on startup (uses IF NOT EXISTS and USE <db> where applicable).
- ✅ Retry-on-connect logic in generated JDBC/DAO code to handle transient DB connectivity issues.
- ✅ Ability to choose database name and tables during generation (generates SQL, Java models/DAOs/controllers).
- ✅ Option to customize `groupId` and `artifactId` when generating Java projects.
- ✅ Java code generation uses plain POJOs (no Lombok) and JDBC-based DAOs by default (configurable).
- ✅ Python generators include `db` module with safe creation routines for PostgreSQL/MySQL/SQLite.
- ✅ Improved README templates and project README generation for each scaffolded project.
- ✅ Added changelog entry and release notes for v0.5.0.

### Changed
- 🛠️ Refactored generator code into per-framework modules to improve maintainability.
- 🛠️ Removed Lombok from generated Java templates (plain getters/setters).
- 🛠️ Use `uvicorn[standard]` and `async` DB drivers for FastAPI templates.
- 🛠️ Split Python generator into common + framework-specific files.
- 🛠️ Fix TypeScript compiler errors for js generators and exports.
- 🛠️ Upgrade default Next.js / React versions in templates where applicable.

### Fixed
- ✅ Resolved multiple TypeScript diagnostics reported in generator files.
- ✅ Ensure exported function names (e.g., `chooseJsFramework`) match imports.
- ✅ Fix path / package generation for custom `groupId` and `artifactId`.

## [0.1.0] - 2025-12-08
- ✅ Refactored code into modular structure
- ✅ Improved logging via Output Channel
- ✅ 40+ SQL snippets added
- ✅ 9+ Java JDBC methods
- ✅ 15+ Python snippets
- ✅ 15+ JavaScript/TypeScript snippets
- ✅ Customizable keybindings (Ctrl+Alt+S/A/F)
- ✅ Enhanced error handling
- ✅ SQL Analyzer added
- ✅ SQL Formatter added

## [0.0.5] - 2025-11-20
- Initial release with basic SQL snippets
- Basic keybindings for insert snippet
