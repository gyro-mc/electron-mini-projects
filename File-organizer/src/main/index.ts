import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
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
ipcMain.handle('choose-dir', () => {
  return dialog
    .showOpenDialog({ properties: ['openDirectory'] })
    .then(({ canceled, filePaths }) => {
      if (canceled || filePaths.length === 0) {
        return null
      }

      const targetDir = filePaths[0]
      // 1) Read all files
      return fs.promises.readdir(targetDir).then((files) => {
        // 2) Build a Set of unique extensions (no dot, no empty)
        const extSet = new Set<string>()
        files.forEach((f) => {
          const e = path.extname(f).slice(1)
          if (e) extSet.add(e)
        })

        // 3) For each extension, create folder and move matching files
        const allOps: Promise<void>[] = []
        extSet.forEach((ext) => {
          const folderPath = path.join(targetDir, `${ext} folder`)

          // mkdir → then move all files with that ext
          const op = fs.promises
            .mkdir(folderPath, { recursive: true })
            .then(() => {
              // collect rename promises for this extension
              const moves = files
                .filter((f) => path.extname(f).slice(1) === ext)
                .map((f) => {
                  const src = path.join(targetDir, f)
                  const dest = path.join(folderPath, f)
                  return fs.promises
                    .rename(src, dest)
                    .then(() => console.log(`Moved ${f} → ${ext} folder`))
                    .catch((err) => console.error(`Failed to move ${f}:`, err))
                })
              // wait for all moves of this extension
              return Promise.all(moves).then(() => {})
            })
            .catch((err) => console.error(`Error creating folder for .${ext}:`, err))

          allOps.push(op)
        })

        // wait until every mkdir+move sequence is done
        return Promise.all(allOps).then(() => targetDir)
      })
    })
    .catch((err) => {
      console.error('Error in choose-dir handler:', err)
      return null
    })
})
