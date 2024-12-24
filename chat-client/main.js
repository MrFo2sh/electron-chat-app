const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");

let mainWindow;
const createWindow = () => {
  //   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: 800, // Full screen width
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  //   mainWindow.webContents.openDevTools();

  mainWindow.loadFile("./index/index.html");
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.on("join-chat", (event, username) => {
    mainWindow.loadFile("./chat/page.html"); // Load the chat page
    mainWindow.webContents.on("did-finish-load", () => {
      console.log("Sending login-info event to renderer...");
      mainWindow.webContents.send("login-info", { username });
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("window-all-closed", () => {
  app.quit();
});
