import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ✅ FIX for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
  });

  const url = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";

  console.log("Loading:", url);

  win.loadURL(url);

  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);
