const { app, BrowserWindow, Menu } = require('electron');

const path = require('path');

function startNodeJsServer() {
    var { spawn } = require('child_process');

    var serverProcess = spawn('node', ['server.js']);

    serverProcess.stdout.on('data', (data) => {
        console.log(`Server stdout: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Server stderr: ${data}`);
    });

    serverProcess.on('exit', (code, signal) => {
        console.log(`Server process exited with code ${code} and signal ${signal}`);
    });
}

  //Start the Node.js server
  startNodeJsServer();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1100,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
      enableRemoteModule: true,
      icon: path.join(__dirname, 'otaku.png'),
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  Menu.setApplicationMenu(null);

  // Open DevTools if you want to debug your application
  mainWindow.webContents.openDevTools();

  // Event when the window is closed.
  mainWindow.on('closed', function () {});
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});




  