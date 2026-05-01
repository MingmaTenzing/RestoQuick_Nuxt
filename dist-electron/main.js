import { app as n, BrowserWindow as t } from "electron";
import i from "node:path";
import { fileURLToPath as r } from "node:url";
const l = r(import.meta.url);
i.dirname(l);
let o = null;
function a() {
  o = new t({
    width: 1e3,
    height: 700
  });
  const e = process.env.VITE_DEV_SERVER_URL || "http://localhost:3000";
  console.log("Loading:", e), o.loadURL(e), process.env.VITE_DEV_SERVER_URL && o.webContents.openDevTools();
}
n.whenReady().then(a);
