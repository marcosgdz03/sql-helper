import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export async function showProjectGenerator() {
    // -------------------------------
    // Elegir lenguaje
    // -------------------------------
    const languages: vscode.QuickPickItem[] = [
        { label: "Java", description: "Generate Java project boilerplate" },
        { label: "Python", description: "Generate Python project boilerplate" },
        { label: "JavaScript / TypeScript", description: "Generate JS/TS project boilerplate" }
    ];

    const selectedLanguage = await vscode.window.showQuickPick(languages, {
        placeHolder: "Choose a language for your project"
    });

    if (!selectedLanguage) return;

    switch (selectedLanguage.label) {
        case "Java":
            await chooseJavaFramework();
            break;
        case "Python":
            await choosePythonFramework();
            break;
        case "JavaScript / TypeScript":
            await chooseJsFramework();
            break;
    }
}

// ====================================================
// JAVA
// ====================================================
async function chooseJavaFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Spring Boot", description: "Java microservices framework" },
        { label: "Micronaut", description: "Fast lightweight DI framework" },
        { label: "Quarkus", description: "Supersonic subatomic Java" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a Java framework" });
    if (!selected) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, openLabel: "Select destination folder" });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, `java-${selected.label.replace(/\s/g, '-')}`);
    fs.mkdirSync(path.join(projectPath, "src", "main", "java"), { recursive: true });
    fs.mkdirSync(path.join(projectPath, "src", "main", "resources"), { recursive: true });

    // Archivo de ejemplo
    const mainJava = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello ${selected.label}!");
    }
}`;
    fs.writeFileSync(path.join(projectPath, "src", "main", "java", "Main.java"), mainJava);
    fs.writeFileSync(path.join(projectPath, "README.md"), generateJavaProject(selected.label));

    vscode.window.showInformationMessage(`Java project (${selected.label}) created at ${projectPath}`);
}

function generateJavaProject(framework: string): string {
    switch (framework) {
        case "Spring Boot":
            return `<project>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  </dependencies>
</project>`;
        case "Micronaut":
            return `micronautVersion=4.0
dependencies {
  implementation("io.micronaut:micronaut-inject")
}`;
        case "Quarkus":
            return `<project>
  <dependencyManagement>
    <dependency>
      <groupId>io.quarkus</groupId>
      <artifactId>quarkus-bom</artifactId>
      <version>3.0.0</version>
    </dependency>
  </dependencyManagement>
</project>`;
        default:
            return "// Framework not supported";
    }
}

// ====================================================
// PYTHON
// ====================================================
async function choosePythonFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Flask", description: "Lightweight Python web framework" },
        { label: "FastAPI", description: "Modern Python web framework" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a Python framework" });
    if (!selected) return;

    const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        openLabel: "Select destination folder"
    });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, `python-${selected.label.toLowerCase()}`);
    const srcPath = path.join(projectPath, "src");
    fs.mkdirSync(srcPath, { recursive: true });

    switch (selected.label) {
        case "Flask":
            // requirements.txt
            fs.writeFileSync(path.join(projectPath, "requirements.txt"), "flask\nsqlalchemy");

            // src/app.py
            fs.writeFileSync(path.join(srcPath, "app.py"), `from flask import Flask
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello Flask"

if __name__ == "__main__":
    app.run(debug=True)`);

            // README
            fs.writeFileSync(path.join(projectPath, "README.md"), `Python Flask project generated.
Install dependencies:
pip install -r requirements.txt
Run server:
python src/app.py`);
            break;

        case "FastAPI":
            // requirements.txt
            fs.writeFileSync(path.join(projectPath, "requirements.txt"), "fastapi\nuvicorn\nsqlalchemy");

            // src/main.py
            fs.writeFileSync(path.join(srcPath, "main.py"), `from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)`);

            // README
            fs.writeFileSync(path.join(projectPath, "README.md"), `Python FastAPI project generated.
Install dependencies:
pip install -r requirements.txt
Run server:
python src/main.py`);
            break;
    }

    vscode.window.showInformationMessage(`Python project (${selected.label}) created at ${projectPath}`);
}



// ====================================================
// JAVASCRIPT / TYPESCRIPT
// ====================================================
// ====================================================
// JAVASCRIPT / TYPESCRIPT
// ====================================================
async function chooseJsFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Express", description: "Node.js web framework" },
        { label: "Next.js", description: "React fullstack framework" },
        { label: "NestJS", description: "Typescript backend framework" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a JS/TS framework" });
    if (!selected) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true, openLabel: "Select destination folder" });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, `js-${selected.label.replace(/\s/g, '-')}`);
    fs.mkdirSync(path.join(projectPath, "src"), { recursive: true });

    switch (selected.label) {
        case "Express":
            // package.json
            fs.writeFileSync(path.join(projectPath, "package.json"), JSON.stringify({
                name: "express-app",
                version: "1.0.0",
                main: "src/app.js",
                scripts: {
                    start: "node src/app.js",
                    dev: "nodemon src/app.js"
                },
                dependencies: {
                    express: "^4.18.2"
                },
                devDependencies: {
                    nodemon: "^2.0.22"
                }
            }, null, 4));

            // src/app.js
            fs.writeFileSync(path.join(projectPath, "src", "app.js"), `const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Hello Express"));

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`);

            fs.writeFileSync(path.join(projectPath, "README.md"), "Express project generated. Run `npm install` and then `npm run dev` to start.");
            break;

        case "Next.js":
            fs.writeFileSync(path.join(projectPath, "README.md"), "Next.js project placeholder.\nRun:\nnpx create-next-app@latest .\nnpm run dev");
            break;

        case "NestJS":
            fs.writeFileSync(path.join(projectPath, "README.md"), "NestJS project placeholder.\nInstall CLI:\nnpm i -g @nestjs/cli\nnest new project");
            break;
    }

    vscode.window.showInformationMessage(`JS/TS project (${selected.label}) created at ${projectPath}`);
}

