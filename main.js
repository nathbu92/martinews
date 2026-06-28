const { app, BrowserWindow, Tray, Menu, nativeImage, Notification, ipcMain, shell } = require('electron');
const path = require('path');

let win = null;
let tray = null;

// ── Empêche plusieurs instances ──
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) { app.quit(); process.exit(0); }
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 360,
    minHeight: 500,
    title: 'WebRadio',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('https://nathbu92.github.io/martinews/');

  // Ouvre les liens externes dans le vrai navigateur
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Minimise dans la barre système au lieu de fermer
  win.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      win.hide();
    }
  });

  win.on('closed', () => { win = null; });
}

function createTray() {
  const img = nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.ico'));
  tray = new Tray(img.resize({ width: 16, height: 16 }));

  const menu = Menu.buildFromTemplate([
    { label: 'Ouvrir WebRadio', click: () => { win?.show(); win?.focus(); } },
    { type: 'separator' },
    { label: 'Quitter', click: () => { app.isQuiting = true; app.quit(); } },
  ]);

  tray.setToolTip('WebRadio Chat');
  tray.setContextMenu(menu);
  tray.on('click', () => { win?.show(); win?.focus(); });
}

// ── Notif système depuis le renderer ──
ipcMain.on('show-notification', (_, { title, body, tag }) => {
  const notif = new Notification({
    title: title || 'WebRadio',
    body: body || '',
    icon: path.join(__dirname, 'build', 'icon.ico'),
    silent: false,
  });
  notif.on('click', () => { win?.show(); win?.focus(); });
  notif.show();
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

// Ne quitte pas quand toutes les fenêtres sont fermées (reste dans le tray)
app.on('window-all-closed', (e) => { e.preventDefault(); });
app.on('activate', () => { if (!win) createWindow(); else win.show(); });
