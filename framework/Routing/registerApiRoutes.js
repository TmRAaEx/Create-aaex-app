import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { match } from "path-to-regexp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseApiRoute(filePath) {
  return (
    (
      "/" +
      filePath
        .replace(/\\/g, "/") // Windows: backslash -> slash
        .replace(/\.(tsx?|jsx?|js)$/, "") // ta bort filändelser
        .replace(/\[([^\]]+)\]/g, ":$1") // [id] => :id
        .replace("index", "") // index.ts => "/"
        .replace(/\/$/, "")
    ) // ta bort trailing slash
      .toLowerCase() || "/"
  );
}

export default function registerApiRoutes() {
  const apiDir = path.resolve("src/api");

  function walk(dir = apiDir, routes = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath, routes);
      } else if (/\.(tsx?|jsx?|js)$/.test(file)) {
        const relativePath = path.relative(apiDir, fullPath);
        const route = parseApiRoute(relativePath);
        routes.push({
          route,
          matcher: match(route, { decode: decodeURIComponent }),
          filePath: fullPath,
          viteModulePath: "/src/api/" + relativePath.replace(/\\/g, "/"),
        });
      }
    }
    return routes;
  }

  const routes = walk();
  console.log(
    "✅ Registered API routes:",
    routes.map((r) => r.route)
  );
  return routes;
}
