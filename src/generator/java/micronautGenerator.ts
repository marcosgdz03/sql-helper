import * as fs from "fs";
import * as path from "path";

type Database = "PostgreSQL" | "MySQL" | "SQLite";

export async function generateMicronautProject(
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

    fs.writeFileSync(path.join(resources, "application.yml"), generateMicronautConfig(db, dbDetails.dbName));
    fs.writeFileSync(path.join(resources, "init.sql"), generateInitSql(dbDetails.dbName, dbDetails.tables, db));

    if (buildTool === "maven") fs.writeFileSync(path.join(projectPath, "pom.xml"), `<!-- POM for Micronaut ${version} -->`);
    else fs.writeFileSync(path.join(projectPath, "build.gradle"), `// Gradle for Micronaut ${version}`);

    console.log(`Micronaut project generated at ${projectPath}`);
}

function generateMainClass() {
    return `package com.example.app;

import io.micronaut.runtime.Micronaut;

public class Application {
    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}`;
}

function generateMicronautConfig(db: Database, dbName: string) {
    let config = `micronaut:\n  application:\n    name: app\n  server:\n    port: 8080\ndatasources:\n  default:\n`;
    switch (db) {
        case "PostgreSQL": config += `    url: jdbc:postgresql://localhost:5432/${dbName}\n    username: postgres\n    password: secret\n    dialect: POSTGRES\n`; break;
        case "MySQL": config += `    url: jdbc:mysql://localhost:3306/${dbName}\n    username: root\n    password: secret\n    dialect: MYSQL\n`; break;
        case "SQLite": config += `    url: jdbc:sqlite:${dbName}.sqlite\n    dialect: SQLITE\n`; break;
    }
    return config;
}

function generateInitSql(dbName: string, tables: string[], db: Database) {
    let sql = db !== "SQLite" ? `CREATE DATABASE IF NOT EXISTS ${dbName};\nUSE ${dbName};\n\n` : "";
    tables.forEach(table => {
        const idType = db === "PostgreSQL" ? "BIGSERIAL" : db === "MySQL" ? "BIGINT AUTO_INCREMENT" : "INTEGER PRIMARY KEY AUTOINCREMENT";
        sql += `CREATE TABLE IF NOT EXISTS ${table} (\n  id ${idType},\n  name VARCHAR(255),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n`;
    });
    return sql;
}
