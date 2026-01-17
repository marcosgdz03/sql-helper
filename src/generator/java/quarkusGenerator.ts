import * as fs from "fs";
import * as path from "path";

type Database = "PostgreSQL" | "MySQL" | "SQLite";

export async function generateQuarkusProject(
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

    fs.writeFileSync(path.join(resources, "application.properties"), generateQuarkusConfig(db, dbDetails.dbName));
    fs.writeFileSync(path.join(resources, "init.sql"), generateInitSql(dbDetails.dbName, dbDetails.tables, db));

    if (buildTool === "maven") {fs.writeFileSync(path.join(projectPath, "pom.xml"), `<!-- POM for Quarkus ${version} -->`);}
    else {fs.writeFileSync(path.join(projectPath, "build.gradle"), `// Gradle for Quarkus ${version}`);}

    console.log(`Quarkus project generated at ${projectPath}`);
}

function generateMainClass() {
    return `package com.example.app;

import io.quarkus.runtime.Quarkus;

public class Application {
    public static void main(String[] args) {
        Quarkus.run(args);
    }
}`;
}

function generateQuarkusConfig(db: Database, dbName: string) {
    let config = `quarkus.http.port=8080\nquarkus.application.name=app\nquarkus.datasource.db-kind=`;
    switch (db) {
        case "PostgreSQL": config += `postgresql\nquarkus.datasource.username=postgres\nquarkus.datasource.password=secret\nquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/${dbName}\n`; break;
        case "MySQL": config += `mysql\nquarkus.datasource.username=root\nquarkus.datasource.password=secret\nquarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/${dbName}\n`; break;
        case "SQLite": config += `sqlite\nquarkus.datasource.jdbc.url=jdbc:sqlite:${dbName}.sqlite\n`; break;
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
