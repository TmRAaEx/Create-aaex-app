import { log } from "console";
import fs from "fs";
import path from "path";

function parseRoute(filePath) {
  // filePath är relativt till src/pages, t.ex. "index.tsx" eller "blog/[id].tsx"

  let route =
    "/" +
    filePath
      .replace(/\\/g, "/") // Windows backslash -> slash
      .replace(/\.(tsx|jsx|ts|js)$/, "") // ta bort filändelse
      .replace(/\[([^\]]+)\]/g, ":$1") // dynamiska segment
      .replace(/\/index$/, "") // ta bort trailing /index
      .replace(/\/$/, ""); // ta bort trailing slash

  if (route === "") route = "/";

  return route.toLowerCase();
}

export default function getRoutes() {
  const pagesDir = path.resolve("src/pages");
  const walk = (dir = pagesDir, routes = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, routes);
      } else if (/\.(tsx|jsx|ts|js)$/.test(file)) {
        const route = parseRoute(path.relative(pagesDir, fullPath));
        routes.push({ route, fullPath });
      }
    }
    return routes;
  };
  return walk();
}
