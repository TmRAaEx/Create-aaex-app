#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";

import createAaexFolder from "./templates/aaex-folder.js";
import createSrcFolder from "./templates/src-folder.js";
import { exec } from "child_process";

async function main() {
  const answers = await inquirer.prompt([
    {
      name: "projectName",
      message: "Vad ska projektet heta?",
      default: "my-aaex-app",
    },
    {
      name: "useTailwind",
      type: "confirm",
      message: "Vill du använda Tailwind CSS?",
      default: true,
    },
  ]);

  const projectDir = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`Mappen "${answers.projectName}" finns redan! Avbryter.`);
    process.exit(1);
  }

  await fs.ensureDir(projectDir);

  createAaexFolder(projectDir);
  createSrcFolder(projectDir, answers.useTailwind);

  // Skapa vite.config.ts med tailwind-plugin om användaren vill ha
  await createViteConfig(projectDir, answers.useTailwind);

  if (answers.useTailwind) {
    await createTailwindConfig(projectDir);
  } else {
    // Skapa src/index.css utan tailwind direktiv
    const cssDir = path.join(projectDir, "src");
    await fs.ensureDir(cssDir);
    const cssContent = `html, body {
  margin: 0; padding: 0; box-sizing: border-box;}`;
    await fs.writeFile(path.join(cssDir, "index.css"), cssContent, "utf-8");
  }

  console.log(`Projektet "${answers.projectName}" är klart!`);
  console.log(`  cd ${answers.projectName}`);
  console.log("  npm install");
  console.log("  npm run dev");
}

async function createViteConfig(projectDir, useTailwind) {
  const viteConfigPath = path.join(projectDir, "vite.config.ts");
  const viteConfigContent = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;

  const viteConfigWithTailwind = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

});
`;

  await fs.writeFile(
    viteConfigPath,
    useTailwind ? viteConfigWithTailwind : viteConfigContent,
    "utf-8"
  );
}

async function createTailwindConfig(projectDir) {
  // Skapa också src/index.css med tailwind directives
  const cssDir = path.join(projectDir, "src");
  await fs.ensureDir(cssDir);
  const cssContent = `
@import "tailwindcss";
html, body {
  margin: 0; padding: 0; box-sizing: border-box;}
`;
  await fs.writeFile(path.join(cssDir, "index.css"), cssContent, "utf-8");
  exec("npm install tailwindcss @tailwindcss/vite", { cwd: projectDir });
}

// Anpassa createAaexFolder och createSrcFolder så att t.ex. i client-entry.tsx
// importera index.css om tailwind används

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
