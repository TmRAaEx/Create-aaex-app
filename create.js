#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";


import createSrcFolder from "./templates/src-folder.js";
import createRootFolder from "./templates/root-folder.js";

import { exec } from "child_process";

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
  console.log("Installing dependencies...");
  const packageManager = fs.existsSync(path.join(projectDir, "yarn.lock")) ? "yarn" : "npm";
  exec(`${packageManager} install`, { cwd: projectDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing dependencies: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`);
    }
    console.log(stdout);
    console.log("Dependencies installed successfully!");
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
