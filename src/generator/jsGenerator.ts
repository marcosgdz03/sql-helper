import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export async function chooseJsFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Express" },
        { label: "Next.js" },
        { label: "NestJS" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, {
        placeHolder: "Choose a JS/TS framework"
    });
    if (!selected) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(
        folderUri[0].fsPath,
        `js-${selected.label.replace(/\s/g, "-")}`
    );

    fs.mkdirSync(path.join(projectPath, "src"), { recursive: true });

    switch (selected.label) {
        case "Express":
            generateExpressProject(projectPath);
            break;

        case "Next.js":
            fs.writeFileSync(
                path.join(projectPath, "README.md"),
                "Next.js placeholder. Run:\nnpx create-next-app@latest .\nnpm run dev"
            );
            break;

        case "NestJS":
            fs.writeFileSync(
                path.join(projectPath, "README.md"),
                "NestJS placeholder. Install CLI:\nnpm i -g @nestjs/cli\nnest new project"
            );
            break;
    }

    vscode.window.showInformationMessage(
        `JS/TS project (${selected.label}) created at ${projectPath}`
    );
}

function generateExpressProject(projectPath: string) {
    fs.writeFileSync(
        path.join(projectPath, "package.json"),
        JSON.stringify(
            {
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
            },
            null,
            4
        )
    );

    fs.writeFileSync(
        path.join(projectPath, "src", "app.js"),
        `const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Hello Express"));

app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`
    );

    fs.writeFileSync(
        path.join(projectPath, "README.md"),
        "Express project generated. Run `npm install` and then `npm run dev` to start."
    );
}
