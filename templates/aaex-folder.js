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

  const aaexDir = path.join(baseDir, ".aaex");
  const serverDir = path.join(aaexDir, "server");
  const frameworkDir = path.join(aaexDir, "framework");

  // Skapa .aaex och undermappar
  ensureDir(aaexDir);
  ensureDir(serverDir);
  ensureDir(frameworkDir);

  // Kopiera hela server-mappen in i .aaex/server
  fs.cpSync(path.resolve(__dirname, "../server"), serverDir, {
    recursive: true,
  });

  // Kopiera hela framework-mappen in i .aaex/framework
  fs.cpSync(path.resolve(__dirname, "../framework"), frameworkDir, {
    recursive: true,
  });

  // Skriva över eller skapa client-entry.tsx och server-entry.tsx i framework-mappen
  fs.writeFileSync(
    path.join(frameworkDir, "client-entry.tsx"),
    clientEntryContent
  );
  fs.writeFileSync(
    path.join(frameworkDir, "server-entry.tsx"),
    serverEntryContent
  );
}
