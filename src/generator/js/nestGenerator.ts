import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { selectFolder } from "./expressGenerator";

function ensureDir(parent: string, name: string) {
    const dirPath = path.join(parent, name);
    if (!fs.existsSync(dirPath)) {fs.mkdirSync(dirPath);}
}

function writeFile(location: string, fileName: string, content: string) {
    const filePath = path.join(location, fileName);
    fs.writeFileSync(filePath, content, "utf8");
}

/**
 * Generación de proyecto NestJS
 */
export async function generateNestProject() {
    const folder = await selectFolder();
    if (!folder) {return;}

    ensureDir(folder, "src");

    writeFile(folder, "package.json", getNestPackage());
    writeFile(path.join(folder, "src"), "main.ts", getNestMain());
    writeFile(path.join(folder, "src"), "app.module.ts", getNestAppModule());

    vscode.window.showInformationMessage("NestJS project generated!");
}

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
import { AppModule } from "./app.module";

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
