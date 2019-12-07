import electron from 'electron'
import React from 'react'
import { useStoreState } from 'easy-peasy'

import { Button, message } from 'antd'

const ipcRenderer = electron.ipcRenderer || false

export const Save = () => {
  const [romPath, framePath, palette] = useStoreState(state => [
    state.romPath,
    state.framePath,
    state.palette
  ])

  const onClick = () => {
    if (ipcRenderer) {
      let msg = ipcRenderer.sendSync('save-rom', romPath, framePath, palette)

      if (msg.success) message.success(msg.message)
      else message.error(msg.message)
    }
  }

  return (
    <Button type="primary" style={{ width: '100%' }} onClick={onClick}>
      Save ROM
    </Button>
  )
}
