import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import getRoutes from "../framework/parseRoutes.js";
import matchRoute from "../framework/matchRoutes.js";
import chokidar from "chokidar";

export async function startDevServer() {
  const app = express();

  // Skapa Vite server i middlewareMode med React-plugin
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    plugins: [await import("@vitejs/plugin-react").then((m) => m.default())],
  });

  // Vite middleware för hot reload etc
  app.use(vite.middlewares);

  let routes = getRoutes();

  const watcher = chokidar.watch("src/pages", {
    ignoreInitial: true,
    depth: 1,
    awaitWriteFinish: true,
  });

  watcher.on("add", () => {
    console.log("Route added, refreshing routes...");
    routes = getRoutes();
  });

  watcher.on("unlink", () => {
    console.log("Route removed, refreshing routes...");
    routes = getRoutes();
  });

  // Hantera API-rutter under /api
  app.use("/api", async (req, res, next) => {
    try {
      // Mappa req.path till src/api-fil
      const routePath = req.path.replace(/\/$/, "") || "/index";
      const fullPath = path.join(
        process.cwd(),
        "src",
        "api",
        `${routePath}.ts`
      );
      const viteModulePath = `/src/api${routePath}.ts`;

      if (fs.existsSync(fullPath)) {
        try {
          const module = await vite.ssrLoadModule(viteModulePath);
          return module.default(req, res);
        } catch (err) {
          console.error("Error loading API module:", err);
          return res
            .status(500)
            .json({ error: "Internal server error while loading module" });
        }
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      next(err);
    }
  });

  // Hämta routes (file routing)

  // Hantera alla andra requests (SSR React)
  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const matchResult = matchRoute(url, routes);

      if (!matchResult) {
        res.status(404).send("Not Found");
        return;
      }

      const { fullPath, params } = matchResult;

      // Konvertera filväg till Vite-url (posix slashar)
      const viteModulePath =
        "/" + path.relative(process.cwd(), fullPath).replace(/\\/g, "/");

      // Ladda sidan via Vite SSR
      const pageModule = await vite.ssrLoadModule(viteModulePath);

      // Kör load-funktion om den finns
      const data = pageModule.load
        ? await pageModule.load({ params, req })
        : {};

      // Ladda server-entry (render-funktionen)
      const renderModule = await vite.ssrLoadModule(
        "/.aaex/framework/server-entry.tsx"
      );
      const render = renderModule.default;

      // Rendera app med URL och data
      const appHtml = await render(url, data, pageModule);

      // Läs template och injicera appHtml
      const template = fs.readFileSync(path.resolve("index.html"), "utf-8");
      const html = template.replace("<!--app-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  app.listen(3000, () => {
    console.log("Dev server running at http://localhost:3000");
  });
}

startDevServer();
