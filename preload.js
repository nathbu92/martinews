const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title, body, tag) => {
    ipcRenderer.send('show-notification', { title, body, tag });
  },
  platform: process.platform,
});
