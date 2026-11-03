import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { initDB } from './db';
import { setupIpcHandlers } from './ipcHandlers';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isAppQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    title: 'WhatsApp AI Assistant',
    backgroundColor: '#0a0a0c', 
    autoHideMenuBar: true, 
    show: false, 
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true, 
      nodeIntegration: false, 
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // dist/main/main.js -> dist/renderer/index.html
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('close', (event) => {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
    return false;
  });
}

function createTray() {
  // Packagé : extraResources copie "resources" dans process.resourcesPath ; en dev : dossier du projet.
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'resources', 'icon.png')
    : path.join(__dirname, '../../resources/icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  tray.setToolTip('WhatsApp AI Assistant - Léa');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Ouvrir WhatsApp AI', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Suspendre Léa (Pause)', type: 'checkbox', checked: false },
    { type: 'separator' },
    { label: 'Quitter', click: () => {
        isAppQuitting = true;
        app.quit();
      } 
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow?.show());
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    initDB(); 
    setupIpcHandlers(); 
    createWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
