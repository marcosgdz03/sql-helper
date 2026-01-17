import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export async function chooseDatabase(): Promise<string | null> {
    const dbs: vscode.QuickPickItem[] = [
        { label: "PostgreSQL" },
        { label: "MySQL" },
        { label: "SQLite" }
    ];

    const choice = await vscode.window.showQuickPick(dbs, {
        placeHolder: "Choose a database"
    });

    return choice ? choice.label : null;
}

export async function createBaseFolder(name: string): Promise<string | null> {
    try {
        const folder = path.join(process.env.HOME || process.cwd(), name);
        if (!fs.existsSync(folder)) {fs.mkdirSync(folder, { recursive: true });}
        return folder;
    } catch (err) {
        vscode.window.showErrorMessage("Error creating folder: " + err);
        return null;
    }
}
