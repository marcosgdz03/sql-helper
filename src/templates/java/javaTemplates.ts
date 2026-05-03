import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface Template {
  name: string;
  description: string;
  structure: {
    controllers: string[];
    models: string[];
    services: string[];
  };
  dependencies: string[];
}

export async function chooseSpringTemplate(): Promise<Template> {
  const templates: vscode.QuickPickItem[] = [
    { label: "📄 REST API Template", description: "Simple REST controllers" },
    { label: "🏛️ Clean Architecture", description: "Ports and adapters pattern" },
    { label: "🔗 Microservices", description: "Spring Cloud services" },
    { label: "⚙️ Project Structure", description: "Customizable structure" },
  ];

  const result = await vscode.window.showQuickPick(templates, {
    placeHolder: "Choose Spring Boot template",
  });

  if (!result) {
    return {
      name: "basic",
      description: "Basic project structure",
      structure: {
        controllers: ["HelloController.java"],
        models: ["User.java"],
        services: ["UserService.java"],
      },
      dependencies: ["spring-boot-starter-web"],
    } as Template;
  }

  // Parse templates from JSON files
  const template = await loadTemplate(result.label);
  return template;
}

async function loadTemplate(name: string): Promise<Template> {
  const templatesDir = path.join(__dirname, "../../templates/java");
  const templatesPath = await findTemplatesAsync(templatesDir);
  
  const jsonPath = templatesPath.find((p) => path.basename(p) === `${name}.json`);
  
  if (!jsonPath) {
    throw new Error(`Template ${name} not found`);
  }

  const templateData = await fs.promises.readFile(jsonPath, "utf-8");
  const template = JSON.parse(templateData);
  
  return {
    name: template.templateName,
    description: template.description,
    structure: template.config || {},
    dependencies: template.dependencies || [],
  } as Template;
}

async function findTemplatesAsync(dir: string): Promise<string[]> {
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  try {
    const files = fs.readdirSync(dir);
    return files
      .filter(file => file.endsWith(".json"))
      .map(file => path.join(dir, file));
  } catch (error) {
    return [];
  }
}