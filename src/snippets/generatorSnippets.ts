import * as vscode from "vscode";
import { chooseJavaFramework } from "../generator/javaGenerator";
import { choosePythonFramework } from "../generator//pythonGenerator";
import { chooseJsFramework } from "../generator/jsGenerator";

export async function showProjectGenerator() {
    const languages: vscode.QuickPickItem[] = [
        { label: "Java", description: "Generate Java project boilerplate" },
        { label: "Python", description: "Generate Python project boilerplate" },
        { label: "JavaScript / TypeScript", description: "Generate JS/TS project boilerplate" }
    ];

    const selectedLanguage = await vscode.window.showQuickPick(languages, {
        placeHolder: "Choose a language for your project"
    });

    if (!selectedLanguage) {return;}

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
