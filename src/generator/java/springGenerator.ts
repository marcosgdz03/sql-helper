import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

type Database = "PostgreSQL" | "MySQL" | "SQLite";

interface Template {
    name: string;
    description: string;
    config: {
        package: string;
        architecture: string;
    };
}

export async function chooseSpringTemplate(): Promise<Template | undefined> {
    const templates: vscode.QuickPickItem[] = [
        { 
            label: "📄 REST API Template", 
            description: "Simple REST controllers"
        },
        { 
            label: "🏛️ Clean Architecture", 
            description: "Ports & Adapters pattern"
        },
        { 
            label: "🔗 Microservices", 
            description: "Spring Cloud services"
        },
    ];
    
    const selected = await vscode.window.showQuickPick(templates, {
        placeHolder: "Choose Spring Boot template"
    });
    
    if (!selected) {
        return;
    }
    
    return {
        name: selected.label,
        description: selected.description || "",
        config: {
            package: "com.example.app",
            architecture: selected.label.toLowerCase().replace(/\s+/g, "-"),
        } as any
    };
}

export async function generateSpringProject(
    projectPath: string,
    version: string,
    buildTool: string,
    db: Database,
    dbDetails: { dbName: string; tables: string[] },
    javaVersion: string
) {
    const basePackage = path.join(projectPath, "src", "main", "java", "com", "example", "app");
    const resources = path.join(projectPath, "src", "main", "resources");

    fs.mkdirSync(basePackage, { recursive: true });
    fs.mkdirSync(resources, { recursive: true });
    ["model", "dao", "controller"].forEach(folder => 
        fs.mkdirSync(path.join(basePackage, folder), { recursive: true })
    );

    const application = generateMainClass();
    fs.writeFileSync(path.join(basePackage, "Application.java"), application);

    const props = generateSpringProperties(db, dbDetails.dbName);
    fs.writeFileSync(path.join(resources, "application.properties"), props);

    const sql = generateInitSql(dbDetails.dbName, dbDetails.tables, db);
    fs.writeFileSync(path.join(resources, "init.sql"), sql);

    if (buildTool === "maven") {
        fs.writeFileSync(path.join(projectPath, "pom.xml"), 
            `<!-- POM for Spring Boot ${version} -->`
        );
    } else {
        fs.writeFileSync(path.join(projectPath, "build.gradle"), 
            `// Gradle for Spring Boot ${version}`
        );
    }

    console.log(`Spring Boot project generated at ${projectPath}`);
}

function generateMainClass() {
    return `package com.example.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`;
}

function generateSpringProperties(db: Database, dbName: string) {
    const props: string[] = ["server.port=8080", `spring.application.name=${dbName}`];
    
    switch (db) {
        case "PostgreSQL": 
            props.push("spring.datasource.url=jdbc:postgresql://localhost:5432/");
            props.push(`${dbName}?schema=public`);
            props.push("spring.datasource.username=postgres");
            props.push("spring.datasource.password=secret");
            break;
        case "MySQL": 
            props.push("spring.datasource.url=jdbc:mysql://localhost:3306/");
            props.push(`${dbName}?createDatabaseIfNotExist=true`);
            props.push("spring.datasource.username=root");
            props.push("spring.datasource.password=secret");
            break;
        case "SQLite": 
            props.push(`spring.datasource.url=jdbc:sqlite:${dbName}.sqlite`);
            break;
    }
    
    return props.join("\\n");
}

function generateInitSql(dbName: string, tables: string[], db: Database) {
    const lines: string[] = [];
    
    if (db !== "SQLite") {
        lines.push(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
        lines.push(`USE ${dbName};`);
        lines.push("");
    }
    
    tables.forEach(table => {
        const idType = db === "PostgreSQL" ? "BIGSERIAL" : 
                       db === "MySQL" ? "BIGINT AUTO_INCREMENT" : 
                       "INTEGER PRIMARY KEY AUTOINCREMENT";
        
        lines.push(`CREATE TABLE IF NOT EXISTS ${table} (
  id ${idType},
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
        lines.push("");
    });
    
    return lines.join("\\n");
}

async function generateControllers(tables: string[]): Promise<void> {
    const controllersDir = path.join(
        process.cwd(),
        "src", "generator", "java", "controllers"
    );
    
    if (!fs.existsSync(controllersDir)) {
        fs.mkdirSync(controllersDir, { recursive: true });
    }
    
    const controllers = [
        `UserController.java`,
        `ProductController.java`
    ];
    
    controllers.forEach(controller => {
        const controllerPath = path.join(controllersDir, controller);
        const controllerName = controller.replace(".java", "");
        
        fs.writeFileSync(
            controllerPath,
            `package com.example.app.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/${controllerName.toLowerCase()}")
public class ${controllerName}Controller {
    
    @GetMapping
    public List<String> getAll() {
        return List.of();
    }
}`
        );
    });
}