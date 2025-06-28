import { contextBridge, ipcRenderer } from 'electron'
import { noteData } from '../../resources/types'
// Custom APIs for renderer

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

contextBridge.exposeInMainWorld('titleBar', {
  windowControl: (action: 'minimize' | 'maximize' | 'close') =>
    ipcRenderer.send('window-control', action),
  closeAppWhenTabsEqualZero: () => ipcRenderer.send('window-control', 'close')
})
contextBridge.exposeInMainWorld('DataSave', {
  handleChooseSaveDir: () => ipcRenderer.send('data-save'),
  handleSaveNotes: (notes: noteData[]) => ipcRenderer.invoke('save-notes',notes)
})
