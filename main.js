const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

async function setIsDev() {
  let isDev = false;
  if (process.env.NODE_ENV !== 'production') {
    isDev = (await import('electron-is-dev')).default;
  }
  return isDev;
}

async function createWindow() {
  const isDev = await setIsDev();
  
  // Define the path for the icon
  const iconPath = path.join(__dirname, 'iam.png'); // Adjust 'app-icon.png' to your icon's filename if different

  // Include the icon in the BrowserWindow options
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath, // Set the window icon here
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  const appURL = isDev
    ? 'http://localhost:3000' // Dev URL
    : `file://${path.join(__dirname, 'build/index.html')}`; // Prod build URL
  win.loadURL(appURL);

  if (isDev) {
    win.webContents.openDevTools(); // Open the DevTools if in development mode
  } else {
    checkForUpdates();
  }
}

function checkForUpdates() {
  autoUpdater.checkForUpdates();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of the app is available. Do you want to update now?',
      buttons: ['Update', 'Later']
    }).then(result => {
      if (result.response === 0) { // The user selected 'Update'
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Install and restart now?',
      buttons: ['Yes', 'Later']
    }).then(result => {
      if (result.response === 0) { // The user selected 'Yes'
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Update Error', `An error occurred while updating the application: ${error.message}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
