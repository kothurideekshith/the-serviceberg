import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");
const DATA_BACKUP = path.join(__dirname, "data_backup.json");
const AREAS_FILE = path.join(__dirname, "areas.json");
const AREAS_BACKUP = path.join(__dirname, "areas_backup.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      if (!data || data.trim() === "" || data === "{}") {
        throw new Error("Empty data file");
      }
      res.json(JSON.parse(data));
    } catch (err) {
      console.log("Data file missing or empty, trying backup...");
      try {
        const backup = await fs.readFile(DATA_BACKUP, "utf-8");
        res.json(JSON.parse(backup));
      } catch (backupErr) {
        res.status(404).json({ error: "No data found" });
      }
    }
  });

  app.post("/api/data", async (req, res) => {
    try {
      const dataStr = JSON.stringify(req.body, null, 2);
      await fs.writeFile(DATA_FILE, dataStr);
      await fs.writeFile(DATA_BACKUP, dataStr); // Always keep a backup
      console.log("Data saved successfully");
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save data:", err);
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  app.get("/api/areas", async (req, res) => {
    try {
      const data = await fs.readFile(AREAS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      try {
        const backup = await fs.readFile(AREAS_BACKUP, "utf-8");
        res.json(JSON.parse(backup));
      } catch (backupErr) {
        res.status(404).json({ error: "No areas found" });
      }
    }
  });

  app.post("/api/areas", async (req, res) => {
    try {
      const dataStr = JSON.stringify(req.body, null, 2);
      await fs.writeFile(AREAS_FILE, dataStr);
      await fs.writeFile(AREAS_BACKUP, dataStr);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save areas" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
