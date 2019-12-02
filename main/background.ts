import { app, Menu, ipcMain, dialog } from 'electron'
import serve from 'electron-serve'
import fs from 'fs'
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
    width: 640,
    height: 960
    // resizable: false,
    // maximizable: false
  })

  if (isProd) {
    await mainWindow.loadURL('app://./index.html')
    Menu.setApplicationMenu(null)
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
        if (result !== undefined && !result.canceled) {
          event.returnValue = result.filePaths
        } else {
          event.returnValue = []
        }
      })
      .catch(err => {
        console.log(err)
      })
  })

  ipcMain.on('save-rom', (event, romPath: string, framePath: Array<any>) => {
    const reply = (success: boolean, message: string) => {
      return { success: success, message: message }
    }

    if (romPath === '') {
      event.returnValue = reply(false, 'Please select a ROM')
      return
    }

    let data: Buffer = fs.readFileSync(romPath)

    if (data.slice(0xac, 0xac + 4).toString() !== 'BPRE') {
      event.returnValue = reply(false, 'Selected ROM is not Pokemon Fire Red')
      return
    }

    event.returnValue = reply(true, 'Save to ROM successfully')
  })
})()

app.on('window-all-closed', () => {
  app.quit()
})
