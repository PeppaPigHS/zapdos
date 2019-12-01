import { app, Menu, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })

  if (isProd) {
    await mainWindow.loadURL('app://./index.html')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/index`)
    mainWindow.webContents.openDevTools()
  }

  // Menu.setApplicationMenu(null)

  ipcMain.on('open-rom', event => {
    dialog
      .showOpenDialog(mainWindow, {
        title: 'Open ROM',
        filters: [{ name: 'GBA Rom', extensions: ['gba'] }],
        properties: ['openFile']
      })
      .then(result => {
        if (result !== undefined && !result.canceled) {
          event.returnValue = result.filePaths[0]
        } else {
          event.returnValue = ''
        }
      })
      .catch(err => {
        console.log(err)
        event.returnValue = ''
      })
  })

  ipcMain.on('open-frames', event => {
    dialog
      .showOpenDialog(mainWindow, {
        title: 'Open Frames',
        filters: [{ name: 'PNG Image', extensions: ['png'] }],
        properties: ['openFile', 'multiSelections']
      })
      .then(result => {
        if (result !== undefined && !result.canceled) {
          let filePaths = []
          result.filePaths.forEach(file => {
            filePaths.push({ key: 0, path: file })
          })
          event.returnValue = filePaths
        } else {
          event.returnValue = []
        }
      })
      .catch(err => {
        console.log(err)
        event.returnValue = []
      })
  })
})()

app.on('window-all-closed', () => {
  app.quit()
})
