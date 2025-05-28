import registerApiRoutes from "../Routing/registerApiRoutes.js";

export function setupApiHandler(app, vite) {
  let apiRoutes = registerApiRoutes(); // <-- Hämta routes direkt

  console.log(`✅ Setting up API handler with ${apiRoutes.length} routes`);

  app.use("/api", async (req, res, next) => {

    try {
      const route = apiRoutes.find((r) => r.matcher(req.path));
      if (!route) {
        return res.status(404).json({ error: "API route not found" });
      }

      const matchResult = route.matcher(req.path);
      const params = matchResult.params;

      try {
        const mod = await vite.ssrLoadModule(route.viteModulePath);
        if (typeof mod.default !== "function") {
          return res.status(500).json({ error: "Invalid API handler" });
        }

        req.params = params;
        return mod.default(req, res);
      } catch (err) {
        console.error("❌ Failed to load API module:", err);
        return res.status(500).json({ error: "Error loading API route" });
      }
    } catch (err) {
      next(err);
    }
  });

  return {
    updateApiRoutes() {
      apiRoutes = registerApiRoutes();
    },
  };
}
