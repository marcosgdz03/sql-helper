import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Lista de frameworks disponibles
 */
export async function chooseJsFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Express.js", description: "Minimalist backend framework for Node.js" },
        { label: "NestJS", description: "Full-featured TypeScript backend framework" },
        { label: "Next.js", description: "React framework for web apps" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, {
        placeHolder: "Choose a JavaScript/TypeScript framework"
    });

    if (!selected) return;

    switch (selected.label) {
        case "Express.js":
            await generateExpressProject();
            break;
        case "NestJS":
            await generateNestProject();
            break;
        case "Next.js":
            await generateNextProject();
            break;
    }
}

/**
 * GENERADOR EXPRESS
 */
async function generateExpressProject() {
    const folder = await selectFolder();
    if (!folder) return;

    writeFile(folder, "package.json", getExpressPackage());
    writeFile(folder, "index.js", getExpressIndex());

    vscode.window.showInformationMessage("Express.js project generated!");
}

/**
 * GENERADOR NESTJS
 * Nota: Normalmente se usaría @nestjs/cli, pero aquí generamos skeleton manual
 */
async function generateNestProject() {
    const folder = await selectFolder();
    if (!folder) return;

    writeFile(folder, "package.json", getNestPackage());
    writeFile(folder, "main.ts", getNestMain());
    ensureDir(folder, "src");
    writeFile(folder + "/src", "app.module.ts", getNestAppModule());

    vscode.window.showInformationMessage("NestJS project generated!");
}

/**
 * GENERADOR NEXT.JS
 */
async function generateNextProject() {
    const folder = await selectFolder();
    if (!folder) return;

    ensureDir(folder, "pages");
    ensureDir(folder, "public");

    writeFile(folder, "package.json", getNextPackage());
    writeFile(folder + "/pages", "index.js", getNextIndex());

    vscode.window.showInformationMessage("Next.js project generated!");
}

/**
 * UTILIDADES
 */
async function selectFolder(): Promise<string | null> {
    const selection = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select destination folder"
    });

    return selection ? selection[0].fsPath : null;
}

function ensureDir(parent: string, name: string) {
    const dirPath = path.join(parent, name);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
}

function writeFile(location: string, fileName: string, content: string) {
    const filePath = path.join(location, fileName);
    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * PLANTILLAS EXPRESS
 */
function getExpressPackage() {
    return `{
  "name": "express-app",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.19.0"
  }
}`;
}

function getExpressIndex() {
    return `import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});`;
}

/**
 * PLANTILLAS NESTJS
 */
function getNestPackage() {
    return `{
  "name": "nestjs-app",
  "version": "1.0.0",
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  }
}`;
}

function getNestMain() {
    return `import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();`;
}

function getNestAppModule() {
    return `import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: []
})
export class AppModule {}`;
}

/**
 * PLANTILLAS NEXTJS
 */
function getNextPackage() {
    return `{
  "name": "next-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "18.3.0",
    "react-dom": "18.3.0"
  }
}`;
}

function getNextIndex() {
    return `export default function Home() {
  return <h1>Hello from Next.js!</h1>;
}`;
}
