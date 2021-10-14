const {ipcRenderer} = require('electron');

ipcRenderer.on('message', (param1) => {
  console.log(param1);
});