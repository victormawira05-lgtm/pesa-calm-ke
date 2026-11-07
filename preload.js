require('@smartspectra/node-sdk/preload');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pesaCalm', {
  getPresageApiKey: () => ipcRenderer.invoke('config:presage-api-key'),
});
