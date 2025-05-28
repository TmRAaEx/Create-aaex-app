import path from "path";

export default function setupReloader(vite, pageHandler, apiHandler) {
  vite.watcher.on("add", (file) => {
    if (file.startsWith(path.resolve("src/pages"))) {
      console.log("📄 New page file added:", file);
      pageHandler.updateRoutes();
    }
    if (file.startsWith(path.resolve("src/api"))) {
      console.log("📄 New API file added:", file);
      apiHandler.updateApiRoutes();
    }
  });

  vite.watcher.on("addDir", (dir) => {
    if (dir.startsWith(path.resolve("src/pages"))) {
      console.log("📁 New page directory added:", dir);
      pageHandler.updateRoutes();
    }
    if (dir.startsWith(path.resolve("src/api"))) {
      console.log("📁 New API directory added:", dir);
      apiHandler.updateApiRoutes();
    }
  });

  vite.watcher.on("unlink", (file) => {
    if (file.startsWith(path.resolve("src/pages"))) {
      console.log("🗑️ Page file removed:", file);
      pageHandler.updateRoutes();
    }
    if (file.startsWith(path.resolve("src/api"))) {
      console.log("🗑️ API file removed:", file);
      apiHandler.updateApiRoutes();
    }
  });

  vite.watcher.on("unlinkDir", (dir) => {
    if (dir.startsWith(path.resolve("src/pages"))) {
      console.log("🗑️ Page directory removed:", dir);
      pageHandler.updateRoutes();
    }
    if (dir.startsWith(path.resolve("src/api"))) {
      console.log("🗑️ API directory removed:", dir);
      apiHandler.updateApiRoutes();
    }
  });
}
