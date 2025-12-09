import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { selectFolder } from "./expressGenerator";

function ensureDir(parent: string, name: string) {
    const dirPath = path.join(parent, name);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
}

function writeFile(location: string, fileName: string, content: string) {
    const filePath = path.join(location, fileName);
    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Generación de proyecto Next.js
 */
export async function generateNextProject() {
    const folder = await selectFolder();
    if (!folder) return;

    ensureDir(folder, "pages");
    ensureDir(folder, "public");

    writeFile(folder, "package.json", getNextPackage());
    writeFile(path.join(folder, "pages"), "index.js", getNextIndex());

    vscode.window.showInformationMessage("Next.js project generated!");
}

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
