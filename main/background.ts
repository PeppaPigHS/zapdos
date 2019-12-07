import { app, Menu, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'

import { createWindow } from './helpers'
import main from './main'

const isProd: boolean = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 400,
    height: 600,
    resizable: false,
    maximizable: false
  })

  if (isProd) {
    Menu.setApplicationMenu(null)
    await mainWindow.loadURL('app://./index.html')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/index`)
    mainWindow.webContents.openDevTools()
  }

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
        if (result !== undefined && !result.canceled)
          event.returnValue = result.filePaths
        else event.returnValue = []
      })
      .catch(err => {
        console.log(err)
      })
  })

  ipcMain.on(
    'save-rom',
    (event, romPath: string, framePath: Array<any>, palette: boolean) => {
      let frame: Array<string> = []
      framePath.forEach(path => frame.push(path.path))

      dialog
        .showSaveDialog(mainWindow, {
          title: 'Save ROM',
          filters: [{ name: 'GBA Rom', extensions: ['gba'] }]
        })
        .then(result => {
          if (result !== undefined && !result.canceled) {
            event.returnValue = main(romPath, result.filePath, frame, palette)
          } else {
            event.returnValue = {
              success: false,
              message: 'Please select your new ROM destination'
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  )
})()

app.on('window-all-closed', () => {
  app.quit()
})
