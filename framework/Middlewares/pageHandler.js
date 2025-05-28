import fs from "fs";
import path from "path";
import matchRoute from "../Routing/matchRoutes.js";

export function setupPageHandler(app, vite, getRoutes) {
  let routes = getRoutes();

  console.log(`✅ Setting up page handler with ${routes.length} routes`);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;
      const matchResult = matchRoute(url, routes);

      if (!matchResult) {
        res.status(404).send("Not Found");
        return;
      }

      const { fullPath, params } = matchResult;

      // Konvertera till Vite-path
      const viteModulePath =
        "/" + path.relative(process.cwd(), fullPath).replace(/\\/g, "/");

      // Ladda React-sidan via SSR
      const pageModule = await vite.ssrLoadModule(viteModulePath);

      // Ladda data via load-funktionen om den finns
      const data = pageModule.load
        ? await pageModule.load({ params, req })
        : {};

      // Rendera sidan via server-entry
      const renderModule = await vite.ssrLoadModule(
        "/.aaex/framework/server-entry.tsx"
      );
      const render = renderModule.default;

      const appHtml = await render(url, data, pageModule);
      const template = fs.readFileSync(path.resolve("index.html"), "utf-8");
      const html = template.replace("<!--app-->", appHtml);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  return {
    updateRoutes() {
      routes = getRoutes();
    },
  };
}
