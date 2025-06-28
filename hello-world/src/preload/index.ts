import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('helloWorldApi', {
  printHelloWorld: (name: string) => ipcRenderer.invoke('print-hello-world', name)
});
