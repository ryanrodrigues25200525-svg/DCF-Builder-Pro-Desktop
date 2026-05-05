const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dcfDesktop', {
  getIdentity: () => ipcRenderer.invoke('get-identity'),
  saveIdentity: (identity) => ipcRenderer.invoke('save-identity', identity),
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url')
});
