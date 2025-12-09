import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

type Database = "PostgreSQL" | "MySQL" | "SQLite";

export async function chooseJavaFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Spring Boot" },
        { label: "Micronaut" },
        { label: "Quarkus" }
    ];

    const selectedFramework = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a Java framework" });
    if (!selectedFramework) return;

    const version = await askJavaFrameworkVersion(selectedFramework.label);
    if (!version) return;

    const buildTool = await chooseBuildTool();
    if (!buildTool) return;

    const db = await chooseDatabase();
    if (!db) return;

    const dbDetails = await askDatabaseDetails();
    if (!dbDetails) return;

    const useCustomIds = await vscode.window.showQuickPick(
        [{ label: "Yes, custom groupId & artifactId" }, { label: "No, use default com.example.app" }],
        { placeHolder: "Do you want to customize groupId & artifactId?" }
    );

    let groupId = "com.example";
    let artifactId = "app";

    if (useCustomIds?.label.startsWith("Yes")) {
        const inputGroupId = await vscode.window.showInputBox({ placeHolder: "Enter groupId", value: "com.example" });
        if (!inputGroupId) return;
        groupId = inputGroupId;

        const inputArtifactId = await vscode.window.showInputBox({ placeHolder: "Enter artifactId", value: "app" });
        if (!inputArtifactId) return;
        artifactId = inputArtifactId;
    }

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, artifactId.toLowerCase().replace(/\s/g, "-"));

    await generateJavaProject(selectedFramework.label, version, buildTool, projectPath, db, groupId, artifactId, dbDetails);
}

async function askJavaFrameworkVersion(framework: string): Promise<string | undefined> {
    const versionsMap: Record<string, string[]> = {
        "Spring Boot": ["4.0.0", "3.5.8"],
        "Micronaut": ["4.3.0", "4.1.0", "3.9.2"],
        "Quarkus": ["3.9.0", "3.5.2", "3.2.4"]
    };
    return vscode.window.showQuickPick(versionsMap[framework] || [], { placeHolder: `Choose ${framework} version` });
}

async function chooseBuildTool(): Promise<"maven" | "gradle" | undefined> {
    const selected = await vscode.window.showQuickPick([{ label: "Maven" }, { label: "Gradle" }], { placeHolder: "Choose a build tool" });
    return selected?.label.toLowerCase() as "maven" | "gradle" | undefined;
}

async function chooseDatabase(): Promise<Database | undefined> {
    const choice = await vscode.window.showQuickPick(
        [{ label: "PostgreSQL" }, { label: "MySQL" }, { label: "SQLite" }],
        { placeHolder: "Choose a database" }
    );
    return choice?.label as Database | undefined;
}

async function askDatabaseDetails(): Promise<{ dbName: string; tables: string[] } | undefined> {
    const dbName = await vscode.window.showInputBox({ placeHolder: "Enter database name", value: "mydb" });
    if (!dbName) return;

    const numTablesStr = await vscode.window.showInputBox({ placeHolder: "Enter number of tables", value: "1" });
    if (!numTablesStr) return;
    const numTables = parseInt(numTablesStr);
    if (isNaN(numTables) || numTables <= 0) return;

    const tables: string[] = [];
    for (let i = 0; i < numTables; i++) {
        const tableName = await vscode.window.showInputBox({ placeHolder: `Enter name of table ${i + 1}`, value: `table${i + 1}` });
        if (!tableName) return;
        tables.push(tableName);
    }

    return { dbName, tables };
}

function generateInitSql(dbName: string, tables: string[]): string {
    let sql = `CREATE DATABASE IF NOT EXISTS ${dbName};\nUSE ${dbName};\n\n`;
    tables.forEach(table => {
        sql += `CREATE TABLE IF NOT EXISTS ${table} (\n  id BIGINT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(255),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n`;
    });
    return sql;
}

async function generateJavaProject(
    framework: string,
    version: string,
    buildTool: "maven" | "gradle",
    projectPath: string,
    db: Database,
    groupId: string,
    artifactId: string,
    dbDetails: { dbName: string; tables: string[] }
) {
    const basePackage = path.join(projectPath, "src", "main", "java", ...groupId.split("."), artifactId);
    const resources = path.join(projectPath, "src", "main", "resources");

    fs.mkdirSync(basePackage, { recursive: true });
    fs.mkdirSync(resources, { recursive: true });
    ["model", "dao", "controller"].forEach(folder => fs.mkdirSync(path.join(basePackage, folder), { recursive: true }));

    fs.writeFileSync(path.join(basePackage, "Application.java"), generateJavaMainClass(framework, groupId, artifactId));

    // init.sql
    const initSqlContent = generateInitSql(dbDetails.dbName, dbDetails.tables);
    fs.writeFileSync(path.join(resources, "init.sql"), initSqlContent);

    // Configuración DB
    if (framework === "Spring Boot") {
        let props = generateSpringProperties(db);
        props += "\nspring.datasource.data=classpath:init.sql\n";
        fs.writeFileSync(path.join(resources, "application.properties"), props);
    } else if (framework === "Micronaut") {
        let config = generateMicronautConfig(db);
        fs.writeFileSync(path.join(resources, "application.yml"), config);
    } else if (framework === "Quarkus") {
        let config = generateQuarkusConfig(db);
        fs.writeFileSync(path.join(resources, "application.properties"), config);
    }

    if (buildTool === "maven") {
        fs.writeFileSync(path.join(projectPath, "pom.xml"), generatePom(framework, version, db, groupId, artifactId));
    } else {
        fs.writeFileSync(path.join(projectPath, "build.gradle"), generateGradle(framework, version, db, groupId, artifactId));
    }

    fs.writeFileSync(path.join(projectPath, "README.md"), generateReadme(framework, buildTool));

    vscode.window.showInformationMessage(`${framework} project created with ${buildTool} (${version})`);

    // Generar CRUD dinámico para todas las tablas
    for (const table of dbDetails.tables) {
        await generateCrudForTable(basePackage, db, framework, table);
    }
}

function generateJavaMainClass(framework: string, groupId: string, artifactId: string): string {
    const pkg = `package ${groupId}.${artifactId};\n\n`;
    switch (framework) {
        case "Spring Boot":
            return pkg + `import org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}`;
        case "Micronaut":
            return pkg + `import io.micronaut.runtime.Micronaut;\n\npublic class Application {\n    public static void main(String[] args) {\n        Micronaut.run(Application.class, args);\n    }\n}`;
        case "Quarkus":
            return pkg + `import io.quarkus.runtime.Quarkus;\n\npublic class Application {\n    public static void main(String[] args) {\n        Quarkus.run(args);\n    }\n}`;
        default:
            return "// Unsupported framework";
    }
}

async function generateCrudForTable(basePackage: string, db: Database, framework: string, table: string) {
    const className = capitalize(table);
    const pkg = basePackage.split(path.sep).slice(-2).join(".");

    // --- Model ---
    const entity = `
package ${pkg}.model;

public class ${className} {
    private Long id;
    private String name;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
`;
    fs.writeFileSync(path.join(basePackage, "model", `${className}.java`), entity);

    // --- DAO ---
    const url = db === "PostgreSQL" ? `jdbc:postgresql://localhost:5432/${table}` :
                db === "MySQL" ? `jdbc:mysql://localhost:3306/${table}` :
                `jdbc:sqlite:${table}.sqlite`;
    const username = db === "PostgreSQL" ? "postgres" : db === "MySQL" ? "root" : "";
    const password = db === "PostgreSQL" ? "secret" : db === "MySQL" ? "secret" : "";

    const dao = `
package ${pkg}.dao;

import ${pkg}.model.${className};
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ${className}Dao {
    private final String url = "${url}";
    private final String username = "${username}";
    private final String password = "${password}";

    public ${className}Dao() {
        executeInitSql();
    }

    private Connection getConnectionWithRetry() {
        int attempts = 0;
        while (attempts < 5) {
            try {
                return DriverManager.getConnection(url, username, password);
            } catch (SQLException e) {
                attempts++;
                System.out.println("Connection attempt " + attempts + " failed, retrying in 2s...");
                try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
            }
        }
        throw new RuntimeException("Cannot connect to DB after 5 attempts");
    }

    private void executeInitSql() {
        try (Connection conn = getConnectionWithRetry();
             Statement stmt = conn.createStatement()) {
            String sql = new String(java.nio.file.Files.readAllBytes(java.nio.file.Paths.get("src/main/resources/init.sql")));
            stmt.execute(sql);
        } catch (Exception e) { e.printStackTrace(); }
    }

    public List<${className}> findAll() {
        List<${className}> list = new ArrayList<>();
        try (Connection conn = getConnectionWithRetry();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, name FROM ${table}")) {
            while (rs.next()) {
                ${className} obj = new ${className}();
                obj.setId(rs.getLong("id"));
                obj.setName(rs.getString("name"));
                list.add(obj);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public void save(${className} obj) {
        try (Connection conn = getConnectionWithRetry();
             PreparedStatement stmt = conn.prepareStatement("INSERT INTO ${table} (name) VALUES (?)")) {
            stmt.setString(1, obj.getName());
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public void delete(Long id) {
        try (Connection conn = getConnectionWithRetry();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM ${table} WHERE id = ?")) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }
}
`;
    fs.writeFileSync(path.join(basePackage, "dao", `${className}Dao.java`), dao);

    // --- Controller ---
    let controller: string;
    if (framework === "Spring Boot") {
        controller = `
package ${pkg}.controller;

import ${pkg}.dao.${className}Dao;
import ${pkg}.model.${className};
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/${table}")
public class ${className}Controller {
    private final ${className}Dao dao = new ${className}Dao();

    @GetMapping
    public List<${className}> getAll() { return dao.findAll(); }

    @PostMapping
    public void create(@RequestBody ${className} obj) { dao.save(obj); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { dao.delete(id); }
}
`;
    } else if (framework === "Micronaut") {
        controller = `
package ${pkg}.controller;

import ${pkg}.dao.${className}Dao;
import ${pkg}.model.${className};
import io.micronaut.http.annotation.*;
import java.util.List;

@Controller("/${table}")
public class ${className}Controller {
    private final ${className}Dao dao = new ${className}Dao();

    @Get("/")
    public List<${className}> getAll() { return dao.findAll(); }

    @Post("/")
    public void create(@Body ${className} obj) { dao.save(obj); }

    @Delete("/{id}")
    public void delete(Long id) { dao.delete(id); }
}
`;
    } else { // Quarkus
        controller = `
package ${pkg}.controller;

import ${pkg}.dao.${className}Dao;
import ${pkg}.model.${className};
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/${table}")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ${className}Resource {
    private final ${className}Dao dao = new ${className}Dao();

    @GET
    public List<${className}> getAll() { return dao.findAll(); }

    @POST
    public void create(${className} obj) { dao.save(obj); }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Long id) { dao.delete(id); }
}
`;
    }
    fs.writeFileSync(path.join(basePackage, "controller", framework === "Quarkus" ? `${className}Resource.java` : `${className}Controller.java`), controller);
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Configuración DB, build y README ---
function generateSpringProperties(db: Database): string {
    let props = `server.port=8080\nspring.application.name=app\n`;
    switch (db) {
        case "PostgreSQL": props += `spring.datasource.url=jdbc:postgresql://localhost:5432/dbname\nspring.datasource.username=postgres\nspring.datasource.password=secret\n`; break;
        case "MySQL": props += `spring.datasource.url=jdbc:mysql://localhost:3306/dbname\nspring.datasource.username=root\nspring.datasource.password=secret\n`; break;
        case "SQLite": props += `spring.datasource.url=jdbc:sqlite:db.sqlite\n`; break;
    }
    return props;
}

function generateMicronautConfig(db: Database): string {
    let config = `micronaut:\n  application:\n    name: app\n  server:\n    port: 8080\ndatasources:\n  default:\n`;
    switch (db) {
        case "PostgreSQL": config += `    url: jdbc:postgresql://localhost:5432/dbname\n    username: postgres\n    password: secret\n    dialect: POSTGRES\n`; break;
        case "MySQL": config += `    url: jdbc:mysql://localhost:3306/dbname\n    username: root\n    password: secret\n    dialect: MYSQL\n`; break;
        case "SQLite": config += `    url: jdbc:sqlite:db.sqlite\n    dialect: SQLITE\n`; break;
    }
    return config;
}

function generateQuarkusConfig(db: Database): string {
    let config = `quarkus.http.port=8080\nquarkus.application.name=app\nquarkus.datasource.db-kind=`;
    switch (db) {
        case "PostgreSQL": config += `postgresql\nquarkus.datasource.username=postgres\nquarkus.datasource.password=secret\nquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/dbname\n`; break;
        case "MySQL": config += `mysql\nquarkus.datasource.username=root\nquarkus.datasource.password=secret\nquarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/dbname\n`; break;
        case "SQLite": config += `sqlite\nquarkus.datasource.jdbc.url=jdbc:sqlite:db.sqlite\n`; break;
    }
    return config;
}

function generatePom(framework: string, version: string, db: Database, groupId: string, artifactId: string): string {
    const dbDep = db ? {
        PostgreSQL: `<dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>`,
        MySQL: `<dependency><groupId>mysql</groupId><artifactId>mysql-connector-java</artifactId><scope>runtime</scope></dependency>`,
        SQLite: `<dependency><groupId>org.xerial</groupId><artifactId>sqlite-jdbc</artifactId><scope>runtime</scope></dependency>`
    }[db] : "";

    const frameworkDep = framework === "Spring Boot" ? `<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>` :
        framework === "Micronaut" ? `<dependency><groupId>io.micronaut</groupId><artifactId>micronaut-inject</artifactId></dependency>` :
            `<dependency><groupId>io.quarkus</groupId><artifactId>quarkus-resteasy</artifactId></dependency>`;

    return `<project>
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>${version}</version>
  </parent>
  <groupId>${groupId}</groupId>
  <artifactId>${artifactId}</artifactId>
  <version>1.0.0</version>
  <dependencies>
    ${frameworkDep}
    ${dbDep}
  </dependencies>
</project>`;
}

function generateGradle(framework: string, version: string, db: Database, groupId: string, artifactId: string): string {
    return `plugins {
    id 'java'
}`;
}

function generateReadme(framework: string, buildTool: string): string {
    return `# ${framework} Project
Build tool: ${buildTool}`;
}
