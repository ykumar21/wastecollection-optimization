const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		// Create the browser window.
		width: 1000, 
		height: 800,
		'minWidth': 700,
		'minHeight': 700
	});

  // and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	// Only show window when page has loaded
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.show();
		mainWindow.focus();
	});

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => app.quit());

// Dock icon clicked
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
	}
	else {
		mainWindow.focus();
	}
});