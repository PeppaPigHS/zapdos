import electron from 'electron'
import React, { useState } from 'react'
import { useStoreState } from 'easy-peasy'

import { Table, Button, message } from 'antd'
import styled from 'styled-components'
import store from '../store/store'

const ipcRenderer = electron.ipcRenderer || false

const Row = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const Col = styled.div`
  display: flex;
  flex-direction: column;
`

const TableWrapper = styled.div`
  height: 256px;
  padding: 8px;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
`

const CustomButton = styled(Button)`
  width: 100%;
`

const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
    width: '48px'
  },
  {
    title: 'Path',
    dataIndex: 'path'
  }
]

export const Frames = () => {
  const framePath = useStoreState(state => state.framePath)
  const setFramePath = store.getActions().setFramePath
  const [row, setRow] = useState([])

  const rowSelection = {
    selectedRowKeys: row,
    onChange: selectedRowKeys => setRow(selectedRowKeys)
  }

  const addFrames = () => {
    if (ipcRenderer) {
      let newPath = []
      framePath.forEach(file => newPath.push(file))
      ipcRenderer
        .sendSync('open-frames')
        .forEach(file => newPath.push({ key: newPath.length, path: file }))
      if (newPath.length > 255) {
        message.error('The number of frames exceeds 255')
        return
      }
      setFramePath(newPath)
    }
  }

  const deleteFrames = () => {
    let newPath = []
    framePath.forEach(file => {
      if (!row.includes(file.key))
        newPath.push({ key: newPath.length, path: file.path })
    })
    setFramePath(newPath)
    setRow([])
  }

  return (
    <Col>
      <TableWrapper>
        <Table
          size="small"
          bordered
          columns={columns}
          dataSource={framePath}
          rowSelection={rowSelection}
          pagination={{ pageSize: 255 }}
          scroll={framePath.length > 0 ? { x: 720, y: 160 } : {}}
        />
      </TableWrapper>
      <Row>
        <CustomButton style={{ marginRight: '8px' }} onClick={addFrames}>
          Add Frame
        </CustomButton>
        <CustomButton onClick={deleteFrames}>Delete Frame</CustomButton>
      </Row>
    </Col>
  )
}
