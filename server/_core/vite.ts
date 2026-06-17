import type { Express } from "express";
import type { Server } from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express, server: Server) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: path.resolve(__dirname, "../../vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
    root: path.resolve(__dirname, "../../client"),
  });
  app.use(vite.middlewares);
  return vite;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../../dist/public");
  app.use(express.static(distPath));
  app.get("*", (_req: any, res: any) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
