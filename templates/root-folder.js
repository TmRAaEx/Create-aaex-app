import fs from "fs-extra";
import path from "path";

export default async function createRootFolder(
  projectDir,
  projectName,
  useTailwind
) {
  // Skapa package.json med dynamiskt projectName

  let dependencies = {
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    express: "^4.18.2",
    "path-to-regexp": "^6.2.0",
    "react-router-dom": "^6.14.0",
    "react-router": "^7.6.1",
    chokidar: "^3.5.3",
  };

  if (useTailwind) {
    dependencies = {
      ...dependencies,
      tailwindcss: "^4.1.7",
      "@tailwindcss/vite": "^4.1.7",
    };
  }
  
  const packageJson = {
    name: projectName,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "node .aaex/server/devServer.js",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: dependencies,

    devDependencies: {
      vite: "^5.2.0",
      "@vitejs/plugin-react": "^4.2.1",
      typescript: "^5.4.0",
      "@types/react": "^18.2.20",
      "@types/react-dom": "^18.2.7",
    },
    engines: {
      node: ">=16.0.0",
    },
  };

  await fs.writeFile(
    path.join(projectDir, "package.json"),
    JSON.stringify(packageJson, null, 2),
    "utf-8"
  );

  // Skapa vite.config.ts med eller utan Tailwind
  const viteConfigPath = path.join(projectDir, "vite.config.ts");

  const viteConfigBase = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;

  const viteConfigTailwind = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

  await fs.writeFile(
    viteConfigPath,
    useTailwind ? viteConfigTailwind : viteConfigBase,
    "utf-8"
  );

  // Skapa index.html i root (om du vill)
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${projectName}</title>
    <link href="./src/index.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"><!--app--></div>
    <script type="module" src="/.aaex/framework/client-entry.tsx"></script>
  </body>
</html>
`;

  await fs.writeFile(
    path.join(projectDir, "index.html"),
    indexHtmlContent,
    "utf-8"
  );
}
