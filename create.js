#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";


import createSrcFolder from "./templates/src-folder.js";
import createRootFolder from "./templates/root-folder.js";

async function main() {
  const answers = await inquirer.prompt([
    {
      name: "projectName",
      message: "What will the project be named?",
      default: "my-aaex-app",
    },
    {
      name: "useTailwind",
      type: "confirm",
      message: "Do you want tailwindcss?",
      default: true,
    },
  ]);

  const projectDir = path.resolve(process.cwd(), answers.projectName);

  if (fs.existsSync(projectDir)) {
    console.error(`Mappen "${answers.projectName}" finns redan! Avbryter.`);
    process.exit(1);
  }

  await fs.ensureDir(projectDir);


  // Skapa src-mappen
  createSrcFolder(projectDir, answers.useTailwind);

  // Skapa root-filer (package.json, vite.config.ts, index.html, css)
  await createRootFolder(projectDir, answers.projectName, answers.useTailwind);

  console.log(`Project setup for "${answers.projectName}" done!`);
  console.log(`  cd ${answers.projectName}`);
  console.log("  npm install");
  console.log("  npm run dev");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
