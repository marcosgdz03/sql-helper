import * as vscode from "vscode";
import { generateExpressProject } from "./js/expressGenerator";
import { generateNestProject } from "./js/nestGenerator";
import { generateNextProject } from "./js/nextGenerator";

/**
 * Elige framework JS/TS y genera proyecto
 */
export async function chooseJsFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Express.js", description: "Minimalist backend framework for Node.js" },
        { label: "NestJS", description: "Full-featured TypeScript backend framework" },
        { label: "Next.js", description: "React framework for web apps" }
    ];

    const selected = await vscode.window.showQuickPick(frameworks, { placeHolder: "Choose a JavaScript/TypeScript framework" });
    if (!selected) return;

    switch (selected.label) {
        case "Express.js": await generateExpressProject(); break;
        case "NestJS": await generateNestProject(); break;
        case "Next.js": await generateNextProject(); break;
    }
}
