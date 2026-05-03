import * as vscode from "vscode";
import { chooseJavaFramework } from "../generator/javaGenerator";
import { choosePythonFramework } from "../generator//pythonGenerator";
import { chooseJsFramework } from "../generator/jsGenerator";

export async function showProjectGenerator() {
    const languages: vscode.QuickPickItem[] = [
        { 
            label: "🔥 Java", 
            description: "Generate Spring Boot, Micronaut or Quarkus project" 
        },
        { 
            label: "🐍 Python", 
            description: "Generate Flask or FastAPI project" 
        },
        { 
            label: "⚡ JavaScript / TypeScript", 
            description: "Generate Express, NestJS or Next.js project" 
        }
    ];

    const selectedLanguage = await vscode.window.showQuickPick(languages, {
        placeHolder: "Select a programming language to generate your project"
    });

    if (!selectedLanguage) {
        console.log("Project selection cancelled");
        return;
    }


    const actions: Record<string, () => Promise<void>> = {
        "🔥 Java": () => chooseJavaFramework(),
        "🐍 Python": () => choosePythonFramework(),
        "⚡ JavaScript / TypeScript": () => chooseJsFramework()
    };

    await actions[selectedLanguage.label]?.();
}
