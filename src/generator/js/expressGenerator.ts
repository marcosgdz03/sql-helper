import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Selección de carpeta (corregido para Promise<string | null>)
 */
export async function selectFolder(): Promise<string | null> {
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
 * Generación de proyecto Express.js
 */
export async function generateExpressProject() {
    const folder = await selectFolder();
    if (!folder) return;

    writeFile(folder, "package.json", getExpressPackage());
    writeFile(folder, "index.js", getExpressIndex());

    vscode.window.showInformationMessage("Express.js project generated!");
}

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
