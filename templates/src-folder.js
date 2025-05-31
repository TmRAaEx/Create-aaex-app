import fs from "fs";
import path from "path";
import ensureDir from "../helpers/ensure-dir.js";

export default function createSrcFolder(baseDir, useTailwind = false) {
  const srcDir = path.join(baseDir, "src");
  const pagesDir = path.join(srcDir, "pages");
  const apiDir = path.join(srcDir, "api");
  const componentsDir = path.join(srcDir, "components");
  const publicDir = path.join(srcDir, "public");

  const cssDir = path.join(srcDir, "styles");
  // create directories if they don't exist
  ensureDir(srcDir);
  ensureDir(pagesDir);
  ensureDir(componentsDir);
  ensureDir(apiDir);
  ensureDir(publicDir);
  if (!useTailwind) {
    ensureDir(cssDir);
  }

  // App.tsx
  const appTsxContent = `import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "../.aaex/framework/Routing/Router";

interface RouteInfo {
  path: string;
  fullPath: string;
}

interface AppProps {
  routes: RouteInfo[];
  initialData?: any;
}

export default function App({ routes, initialData }: AppProps) {
  return (
    <BrowserRouter>
      <AppRoutes routes={routes} initialData={initialData} />
    </BrowserRouter>
  );
}

`;

  // API-file: hello.ts
  const apiContent = `// src/api/hello.ts

// Shared function to get a hello message
export function getHelloMessage() {
  //here you can have any logic to fetch data, e.g., from a database or an external API
  return { message: "Hello from the API!" };
}

// API endpoint accessible at /api/hello
export default function handler(req, res) {
  const data = getHelloMessage();
  res.status(200).json(data);
}
`;

  // Home page
  const homePageContent = `// src/pages/index.tsx \n
import { getHelloMessage } from "../api/hello";
import "../styles/Home.css";

export function load() {
  const data = getHelloMessage();
  return { message: data.message };
}

export default function Home({ message }) {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Home Page</h1>
      <p className="home-text">This is the home page of your application.</p>
      <p className="home-subtext">API server rendered test: {message}</p>
    </div>
  );
}

`;

  const homePageContentWithTailwind = `// src/pages/index.tsx \n
 import { getHelloMessage } from "../api/hello";

export function load() {
  const data = getHelloMessage();
  return { message: data.message };
}

export default function Home({ message }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to the Home Page</h1>
      <p className="text-lg mb-2 text-gray-700">This is the home page of your application.</p>
      <p className="text-md text-gray-600 italic">API server rendered test: {message}</p>
    </div>
  );
}
`;

  const css = `/* Home.css */
.home-container {
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem;
}

.home-title {
  font-size: 2.25rem; /* 36px */
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a202c; /* gray-900 */
}

.home-text {
  font-size: 1.125rem; /* 18px */
  margin-bottom: 0.5rem;
  color: #4a5568; /* gray-700 */
}

.home-subtext {
  font-size: 1rem;
  color: #718096; /* gray-600 */
  font-style: italic;
}
`;

  const cssTailwind = `@import "tailwindcss";
html, body {
margin: 0;
padding: 0;}

*{
  box-sizing: border-box;
}
`;

  const indexCss = `
html, body {
margin: 0;
padding: 0;}

*{
  box-sizing: border-box;
}

`;

  // Create files in src folder
  fs.writeFileSync(path.join(srcDir, "App.tsx"), appTsxContent);
  fs.writeFileSync(path.join(apiDir, "hello.ts"), apiContent);
  fs.writeFileSync(
    path.join(srcDir, "index.css"),
    useTailwind ? cssTailwind : indexCss
  );
  fs.writeFileSync(
    path.join(pagesDir, "index.tsx"),
    useTailwind ? homePageContentWithTailwind : homePageContent
  );
  if (!useTailwind) {
    fs.writeFileSync(path.join(cssDir, "Home.css"), css);
  }
}
