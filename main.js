const { app, BrowserWindow } = require("electron");
const path = require("path");
//setup server path
const server = require("./server/app");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    // },
    autoHideMenuBar: true,
    // icon: path.join(__dirname, "telephone.png"),
    // icon: path.join(app.getAppPath(), "telephone.png"),
  });
  win.setMenu(null);
  // and load the index.html of the app.
  win.loadFile(path.join(__dirname, "client", "build", "index.html"));

  // const uploadsPath = path.join(__dirname, "..", "client", "public", "uploads");
  // app.setPath("userData", uploadsPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
