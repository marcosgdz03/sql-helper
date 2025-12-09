import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export async function chooseJavaFramework() {
    const frameworks: vscode.QuickPickItem[] = [
        { label: "Spring Boot" },
        { label: "Micronaut" },
        { label: "Quarkus" }
    ];

    const selectedFramework = await vscode.window.showQuickPick(frameworks, {
        placeHolder: "Choose a Java framework"
    });
    if (!selectedFramework) return;

    const version = await askJavaFrameworkVersion(selectedFramework.label);
    if (!version) return;

    const buildTool = await chooseBuildTool();
    if (!buildTool) return;

    const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
    if (!folderUri) return;

    const projectPath = path.join(
        folderUri[0].fsPath,
        selectedFramework.label.toLowerCase().replace(/\s/g, "-")
    );

    await generateJavaProject(selectedFramework.label, version, buildTool, projectPath);
}

async function askJavaFrameworkVersion(framework: string): Promise<string | undefined> {
    let versions: string[] = [];

    switch (framework) {
        case "Spring Boot":
            versions = ["4.0.0", "3.5.8"];
            break;
        case "Micronaut":
            versions = ["4.3.0", "4.1.0", "3.9.2"];
            break;
        case "Quarkus":
            versions = ["3.9.0", "3.5.2", "3.2.4"];
            break;
    }

    return vscode.window.showQuickPick(versions, {
        placeHolder: `Choose ${framework} version`
    });
}

async function chooseBuildTool(): Promise<"maven" | "gradle" | undefined> {
    const selected = await vscode.window.showQuickPick(
        [{ label: "Maven" }, { label: "Gradle" }],
        { placeHolder: "Choose a build tool" }
    );

    return selected?.label.toLowerCase() as "maven" | "gradle" | undefined;
}

async function generateJavaProject(
    framework: string,
    version: string,
    buildTool: "maven" | "gradle",
    projectPath: string
) {
    const srcMain = path.join(projectPath, "src", "main", "java", "com", "example", "app");
    const resources = path.join(projectPath, "src", "main", "resources");

    fs.mkdirSync(srcMain, { recursive: true });
    fs.mkdirSync(resources, { recursive: true });

    fs.writeFileSync(path.join(srcMain, "Application.java"), generateJavaMainClass(framework));
    fs.writeFileSync(path.join(resources, "application.properties"), "server.port=8080");

    if (buildTool === "maven") {
        fs.writeFileSync(path.join(projectPath, "pom.xml"), generatePom(framework, version));
    } else {
        fs.writeFileSync(path.join(projectPath, "build.gradle"), generateGradle(framework, version));
    }

    fs.writeFileSync(path.join(projectPath, "README.md"), generateJavaReadme(framework, buildTool));

    vscode.window.showInformationMessage(
        `${framework} project created with ${buildTool} (${version})`
    );
}

function generateJavaMainClass(framework: string): string {
    switch (framework) {
        case "Spring Boot":
            return `package com.example.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}`;
        case "Micronaut":
            return `package com.example.app;

import io.micronaut.runtime.Micronaut;

public class Application {
    public static void main(String[] args) {
        Micronaut.run(Application.class, args);
    }
}`;
        case "Quarkus":
            return `package com.example.app;

import io.quarkus.runtime.Quarkus;

public class Application {
    public static void main(String[] args) {
        Quarkus.run(args);
    }
}`;
        default:
            return "// Unsupported Java framework";
    }
}

function generatePom(framework: string, version: string): string {
    if (framework === "Spring Boot") {
        return `<project>
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>${version}</version>
  </parent>

  <groupId>com.example</groupId>
  <artifactId>app</artifactId>
  <version>1.0.0</version>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  </dependencies>
</project>`;
    }

    if (framework === "Micronaut") {
        return `<project>
  <modelVersion>4.0.0</modelVersion>

  <properties>
    <micronaut.version>${version}</micronaut.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>io.micronaut</groupId>
      <artifactId>micronaut-inject</artifactId>
    </dependency>
  </dependencies>
</project>`;
    }

    if (framework === "Quarkus") {
        return `<project>
  <modelVersion>4.0.0</modelVersion>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-bom</artifactId>
        <version>${version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>io.quarkus</groupId>
      <artifactId>quarkus-resteasy</artifactId>
    </dependency>
  </dependencies>
</project>`;
    }

    return "";
}

function generateGradle(framework: string, version: string): string {
    if (framework === "Spring Boot") {
        return `plugins {
    id 'java'
    id 'org.springframework.boot' version '${version}'
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
}

group = 'com.example'
version = '1.0.0'
`;
    }

    if (framework === "Micronaut") {
        return `plugins {
    id "io.micronaut.application" version "${version}"
}

micronaut {
    runtime("netty")
}
`;
    }

    if (framework === "Quarkus") {
        return `plugins {
    id 'java'
    id 'io.quarkus'
}

dependencies {
    implementation "io.quarkus:quarkus-resteasy"
}

group = 'com.example'
version = '1.0.0'
`;
    }

    return "";
}

function generateJavaReadme(framework: string, buildTool: string): string {
    return `# ${framework} Project

Project generated automatically.

## Build Tool
${buildTool}

## Run
\`\`\`bash
${buildTool === "maven" ? "mvn spring-boot:run" : "./gradlew run"}
\`\`\`
`;
}
