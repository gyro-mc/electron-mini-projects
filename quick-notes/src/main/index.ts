import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store'
import fs from 'fs'
const store = new Store()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.showInactive()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('window-control', (event, action) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (!window) return
  switch (action) {
    case 'minimize':
      window.minimize()
      break
    case 'maximize':
      window.isMaximized() ? window.unmaximize() : window.maximize()
      break
    case 'close':
      window.close()
      break
  }
})
async function askUserForFolder(): Promise<string | null> {
  const result = await dialog.showOpenDialog({
    title: 'Choose a folder to save your notes',
    properties: ['openDirectory', 'createDirectory']
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0] // selected folder path
  }

  return null
}

ipcMain.on('data-save', async () => {
  if (!store.get('notesDir')) {
    const folder = await askUserForFolder()
    if (folder) {
      store.set('notesDir', folder)
    }
  }
  console.log(store.get('notesDir'))
})
ipcMain.handle('save-notes', async (event, data) => {
  if (!store.has('noteDir')) {
    await askUserForFolder()
  }
  const dir = store.get('noteDir') as string
  const filePath = path.join(dir, 'quick-notes.json')
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return { success: true }
  } catch (error) {
    console.error('failed to write nots', error)
    return { success: false }
  }
})
