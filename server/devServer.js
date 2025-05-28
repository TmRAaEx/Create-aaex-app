import express from "express";
import { createServer as createViteServer } from "vite";
import getRoutes from "../framework/Routing/parseRoutes.js";
import { setupApiHandler } from "../framework/Middlewares/apiHandler.js";
import { setupPageHandler } from "../framework/Middlewares/pageHandler.js";
import path from "path";


export async function startDevServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  //important to register api before pages
  const apiHandler = setupApiHandler(app, vite);
  const pageHandler = setupPageHandler(app, vite, getRoutes);

  //important to register api before pages
  vite.watcher.on("change", (file) => {
    if (file.startsWith(path.resolve("src/pages"))) {
      pageHandler.updateRoutes();
    }
    if (file.startsWith(path.resolve("src/api"))) {
      apiHandler.updateApiRoutes();
    }
  });

  app.listen(3000, () => {
    console.log("✅ Dev server running at http://localhost:3000");
  });
}

startDevServer();
