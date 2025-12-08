import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { logInfo, logError } from '../utils/helpers';

type Framework = 'spring' | 'node' | 'nestjs' | 'express' | 'flask' | 'fastapi';
type Database = 'mysql' | 'postgres' | 'sqlite';

interface PickItem {
    label: string;
    value: Framework | Database;
}

const SUPPORTED_FRAMEWORKS: PickItem[] = [
    { label: '☕ Java - Spring Boot', value: 'spring' },
    { label: '🟩 Node.js', value: 'node' },
    { label: '🟨 Node.js - NestJS', value: 'nestjs' },
    { label: '🟩 Node.js - Express', value: 'express' },
    { label: '🐍 Python - Flask', value: 'flask' },
    { label: '🐍 Python - FastAPI', value: 'fastapi' }
];

const SUPPORTED_DBS: PickItem[] = [
    { label: 'MySQL', value: 'mysql' },
    { label: 'PostgreSQL', value: 'postgres' },
    { label: 'SQLite', value: 'sqlite' }
];

export async function generateProject() {
    try {
        const frameworkPick = await vscode.window.showQuickPick(SUPPORTED_FRAMEWORKS, { placeHolder: 'Select a framework' });
        if (!frameworkPick) return;

        const dbPick = await vscode.window.showQuickPick(SUPPORTED_DBS, { placeHolder: 'Select a database' });
        if (!dbPick) return;

        const projectName = await vscode.window.showInputBox({ placeHolder: 'Enter project name' });
        if (!projectName) return;

        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showErrorMessage('Open a workspace folder first.');
            return;
        }

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const projectRoot = path.join(workspacePath, projectName);
        fs.mkdirSync(projectRoot, { recursive: true });

        logInfo(`Creating ${frameworkPick.label} project with ${dbPick.label} at ${projectRoot}`);

        switch (frameworkPick.value as Framework) {
            case 'node':
            case 'express':
            case 'nestjs':
                await createNodeProject(projectRoot, projectName, frameworkPick.value as Framework, dbPick.value as Database);
                break;
            case 'flask':
            case 'fastapi':
                await createPythonProject(projectRoot, projectName, frameworkPick.value as Framework, dbPick.value as Database);
                break;
            case 'spring':
                await createSpringProject(projectRoot, projectName, dbPick.value as Database);
                break;
        }

        vscode.window.showInformationMessage(`Project ${projectName} created successfully!`);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logError(`Error generating project: ${errorMsg}`);
        vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
}

// ------------------------
// Node.js / Express / NestJS
// ------------------------
async function createNodeProject(projectRoot: string, projectName: string, framework: Framework, db: Database) {
    const dependencies: Record<string, string> = {};
    if (framework === 'express') dependencies['express'] = '^4.18.2';
    if (framework === 'nestjs') dependencies['@nestjs/core'] = '^10.0.0';
    if (db === 'mysql') dependencies['mysql2'] = '^3.3.0';
    if (db === 'postgres') dependencies['pg'] = '^8.11.1';
    if (db === 'sqlite') dependencies['sqlite3'] = '^5.1.6';
    dependencies['dotenv'] = '^16.3.0';

    fs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: projectName, version: '1.0.0', main: 'index.js', scripts: { start: 'node index.js' }, dependencies }, null, 2)
    );

    // index.js / main.ts
    const mainFile = framework === 'nestjs' ? 'main.ts' : 'index.js';
    const mainContent =
        framework === 'express'
            ? `import express from 'express';
import { ExampleRepository } from './exampleRepository';
const app = express();
app.listen(3000, () => console.log('Server running'));`
            : framework === 'nestjs'
            ? `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();`
            : `console.log('Hello Node.js');`;

    fs.writeFileSync(path.join(projectRoot, mainFile), mainContent);

    // DB connection
    const dbFile = path.join(projectRoot, 'dbConnection.js');
    const dbContent =
        db === 'mysql'
            ? `import mysql from "mysql2/promise";
export const pool = mysql.createPool({ host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'root', password: process.env.DB_PASS || '', database: process.env.DB_NAME || 'test' });`
            : db === 'postgres'
            ? `import { Pool } from "pg";
export const pool = new Pool({ host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'user', password: process.env.DB_PASS || '', database: process.env.DB_NAME || 'test' });`
            : `import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database('./test.db');`;

    fs.writeFileSync(dbFile, dbContent);

    // Example repository
    fs.writeFileSync(
        path.join(projectRoot, 'exampleRepository.js'),
        `import { pool } from './dbConnection';
export class ExampleRepository {
    async findAll() { const [rows] = await pool.query("SELECT * FROM example"); return rows; }
    async findById(id) { const [rows] = await pool.query("SELECT * FROM example WHERE id=?", [id]); return rows[0]; }
    async insert(obj) { const [result] = await pool.query("INSERT INTO example (name) VALUES (?)", [obj.name]); return result.insertId; }
    async update(id, obj) { await pool.query("UPDATE example SET name=? WHERE id=?", [obj.name, id]); }
    async delete(id) { await pool.query("DELETE FROM example WHERE id=?", [id]); }
};`
    );

    exec('npm install', { cwd: projectRoot }, (err, stdout, stderr) => {
        if (err) logError(err.message);
        else logInfo('Dependencies installed');
    });
}

// ------------------------
// Python - Flask / FastAPI
// ------------------------
async function createPythonProject(projectRoot: string, projectName: string, framework: Framework, db: Database) {
    const requirements: string[] = [];
    if (framework === 'flask') requirements.push('flask');
    if (framework === 'fastapi') requirements.push('fastapi', 'uvicorn');
    if (db === 'mysql') requirements.push('mysql-connector-python');
    if (db === 'postgres') requirements.push('psycopg2-binary');
    if (db === 'sqlite') requirements.push('sqlite3'); // builtin

    fs.writeFileSync(path.join(projectRoot, 'requirements.txt'), requirements.join('\n'));

    const mainContent =
        framework === 'flask'
            ? `from flask import Flask
app = Flask(__name__)
@app.route('/')
def hello():
    return "Hello Flask!"
if __name__ == '__main__':
    app.run(debug=True)`
            : `from fastapi import FastAPI
app = FastAPI()
@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}`;

    fs.writeFileSync(path.join(projectRoot, 'main.py'), mainContent);

    const dbContent =
        db === 'mysql'
            ? `import mysql.connector
conn = mysql.connector.connect(host='localhost', user='root', password='', database='test')`
            : db === 'postgres'
            ? `import psycopg2
conn = psycopg2.connect(host='localhost', user='user', password='', database='test')`
            : `import sqlite3
conn = sqlite3.connect('test.db')`;

    fs.writeFileSync(path.join(projectRoot, 'db.py'), dbContent);

    fs.writeFileSync(
        path.join(projectRoot, 'repository.py'),
        `from db import conn
class ExampleRepository:
    def find_all(self):
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM example")
        return cursor.fetchall()
    def insert(self, obj):
        cursor = conn.cursor()
        cursor.execute("INSERT INTO example (name) VALUES (?)", (obj['name'],))
        conn.commit()`
    );
}

// ------------------------
// Java - Spring Boot
// ------------------------
async function createSpringProject(projectRoot: string, projectName: string, db: Database) {
    const pomContent = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>${projectName}</artifactId>
  <version>1.0.0</version>
  <dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <version>3.2.0</version>
    </dependency>
    ${db === 'mysql' ? `<dependency><groupId>mysql</groupId><artifactId>mysql-connector-java</artifactId><version>8.1.0</version></dependency>` : ''}
    ${db === 'postgres' ? `<dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><version>42.6.0</version></dependency>` : ''}
  </dependencies>
</project>`;
    fs.writeFileSync(path.join(projectRoot, 'pom.xml'), pomContent);

    const appJava = `package com.example;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`;
    const srcPath = path.join(projectRoot, 'src', 'main', 'java', 'com', 'example');
    fs.mkdirSync(srcPath, { recursive: true });
    fs.writeFileSync(path.join(srcPath, 'Application.java'), appJava);

    logInfo('Spring Boot project structure created.');
}
