import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ensureDir from "../helpers/ensure-dir.js";

export default function createAaexFolder(baseDir) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const clientEntryContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../src/App';
import "../../src/index.css"; 

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
`;

  const serverEntryContent = `import React from 'react';
import ReactDOMServer from 'react-dom/server';

export default async function render(url, data, pageModule) {
  const PageComponent = pageModule.default;
  const appHtml = ReactDOMServer.renderToString(<PageComponent {...data} />);
  return appHtml;
}
`;

  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>aaex app</title>
    <link href="./src/index.css" rel="stylesheet" />
  </head>
  <body>
    <div id="root"><!--app--></div>
    <script type="module" src="/.aaex/framework/client-entry.tsx"></script>
  </body>
</html>

`;

  // Paths baserat på baseDir
  const aaexDir = path.join(baseDir, ".aaex");
  const serverDir = path.join(aaexDir, "server");
  const frameworkDir = path.join(aaexDir, "framework");

  // Skapa mappar
  ensureDir(serverDir);
  ensureDir(frameworkDir);

  // Kopiera filer från .aaex-källan (relativt denna fil) till baseDir
  const serverSrc = path.resolve(__dirname, "../server/devServer.js");
  const serverDest = path.join(serverDir, "devServer.js");

  const srcMatchRoutes = path.resolve(__dirname, "../framework/matchRoutes.js");
  const destMatchRoutes = path.join(frameworkDir, "matchRoutes.js");

  const srcParseRoutes = path.resolve(__dirname, "../framework/parseRoutes.js");
  const destParseRoutes = path.join(frameworkDir, "parseRoutes.js");

  fs.copyFileSync(serverSrc, serverDest);
  fs.copyFileSync(srcMatchRoutes, destMatchRoutes);
  fs.copyFileSync(srcParseRoutes, destParseRoutes);

  // Skriv ut nya filer i rätt folder (inuti baseDir)
  fs.writeFileSync(
    path.join(frameworkDir, "client-entry.tsx"),
    clientEntryContent
  );
  fs.writeFileSync(
    path.join(frameworkDir, "server-entry.tsx"),
    serverEntryContent
  );

  fs.writeFileSync(path.join(baseDir, "index.html"), indexHtmlContent);

  const userPackageJson = {
    name: "my-aaex-app",
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "node .aaex/server/devServer.js",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      express: "^4.18.2",
      "path-to-regexp": "^6.2.0",
      "react-router-dom": "^6.14.0",
      "react-router": "^7.6.1",
      chokidar: "^3.5.3",
    },
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

  fs.writeFileSync(
    path.join(baseDir, "package.json"),
    JSON.stringify(userPackageJson, null, 2)
  );
}
