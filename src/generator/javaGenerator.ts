import * as vscode from "vscode";
import * as path from "path";
import { generateSpringProject } from "./java/springGenerator";
import { generateMicronautProject } from "./java/micronautGenerator";
import { generateQuarkusProject } from "./java/quarkusGenerator";

export async function chooseJavaFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Spring Boot" },
        { label: "Micronaut" },
        { label: "Quarkus" }
    ];

    const selectedFramework = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a Java framework" });
    if (!selectedFramework) return;

    const javaVersion = await askJavaVersion();
    if (!javaVersion) return;

    const version = await askFrameworkVersion(selectedFramework.label);
    if (!version) return;

    const buildTool = await chooseBuildTool();
    if (!buildTool) return;

    const db = await chooseDatabase();
    if (!db) return;

    const dbDetails = await askDatabaseDetails();
    if (!dbDetails) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(folderUri[0].fsPath, "app"); // por simplicidad

    switch (selectedFramework.label) {
        case "Spring Boot":
            await generateSpringProject(projectPath, version, buildTool, db, dbDetails, javaVersion);
            break;
        case "Micronaut":
            await generateMicronautProject(projectPath, version, buildTool, db, dbDetails, javaVersion);
            break;
        case "Quarkus":
            await generateQuarkusProject(projectPath, version, buildTool, db, dbDetails, javaVersion);
            break;
    }
}

// --- Funciones comunes para preguntar opciones ---
async function askJavaVersion(): Promise<"17" | "21" | undefined> {
    const selected = await vscode.window.showQuickPick([{ label: "17" }, { label: "21" }], { placeHolder: "Choose Java version" });
    return selected?.label as "17" | "21" | undefined;
}

async function askFrameworkVersion(framework: string): Promise<string | undefined> {
    const versionsMap: Record<string, string[]> = {
        "Spring Boot": ["4.0.0", "3.5.8"],
        "Micronaut": ["4.3.0", "4.1.0", "3.9.2"],
        "Quarkus": ["3.9.0", "3.5.2", "3.2.4"]
    };
    return vscode.window.showQuickPick(versionsMap[framework] || [], { placeHolder: `Choose ${framework} version` });
}

async function chooseBuildTool(): Promise<"maven" | "gradle" | undefined> {
    const selected = await vscode.window.showQuickPick([{ label: "Maven" }, { label: "Gradle" }], { placeHolder: "Choose a build tool" });
    return selected?.label.toLowerCase() as "maven" | "gradle" | undefined;
}

type Database = "PostgreSQL" | "MySQL" | "SQLite";
async function chooseDatabase(): Promise<Database | undefined> {
    const choice = await vscode.window.showQuickPick([{ label: "PostgreSQL" }, { label: "MySQL" }, { label: "SQLite" }], { placeHolder: "Choose a database" });
    return choice?.label as Database | undefined;
}

async function askDatabaseDetails(): Promise<{ dbName: string; tables: string[] } | undefined> {
    const dbName = await vscode.window.showInputBox({ placeHolder: "Enter database name", value: "mydb" });
    if (!dbName) return;

    const numTablesStr = await vscode.window.showInputBox({ placeHolder: "Enter number of tables", value: "1" });
    if (!numTablesStr) return;
    const numTables = parseInt(numTablesStr);
    if (isNaN(numTables) || numTables <= 0) return;

    const tables: string[] = [];
    for (let i = 0; i < numTables; i++) {
        const tableName = await vscode.window.showInputBox({ placeHolder: `Enter name of table ${i + 1}`, value: `table${i + 1}` });
        if (!tableName) return;
        tables.push(tableName);
    }

    return { dbName, tables };
}
