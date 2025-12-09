import * as fs from "fs";
import * as path from "path";

type Database = "PostgreSQL" | "MySQL" | "SQLite";

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
    ["model", "dao", "controller"].forEach(folder => fs.mkdirSync(path.join(basePackage, folder), { recursive: true }));

    fs.writeFileSync(path.join(basePackage, "Application.java"), generateMainClass());

    fs.writeFileSync(path.join(resources, "application.properties"), generateSpringProperties(db, dbDetails.dbName));
    fs.writeFileSync(path.join(resources, "init.sql"), generateInitSql(dbDetails.dbName, dbDetails.tables, db));

    if (buildTool === "maven") fs.writeFileSync(path.join(projectPath, "pom.xml"), `<!-- POM for Spring Boot ${version} -->`);
    else fs.writeFileSync(path.join(projectPath, "build.gradle"), `// Gradle for Spring Boot ${version}`);

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
    let props = `server.port=8080\nspring.application.name=app\n`;
    switch (db) {
        case "PostgreSQL": props += `spring.datasource.url=jdbc:postgresql://localhost:5432/${dbName}\nspring.datasource.username=postgres\nspring.datasource.password=secret\n`; break;
        case "MySQL": props += `spring.datasource.url=jdbc:mysql://localhost:3306/${dbName}\nspring.datasource.username=root\nspring.datasource.password=secret\n`; break;
        case "SQLite": props += `spring.datasource.url=jdbc:sqlite:${dbName}.sqlite\n`; break;
    }
    return props;
}

function generateInitSql(dbName: string, tables: string[], db: Database) {
    let sql = db !== "SQLite" ? `CREATE DATABASE IF NOT EXISTS ${dbName};\nUSE ${dbName};\n\n` : "";
    tables.forEach(table => {
        const idType = db === "PostgreSQL" ? "BIGSERIAL" : db === "MySQL" ? "BIGINT AUTO_INCREMENT" : "INTEGER PRIMARY KEY AUTOINCREMENT";
        sql += `CREATE TABLE IF NOT EXISTS ${table} (\n  id ${idType},\n  name VARCHAR(255),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n`;
    });
    return sql;
}
