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
  height: 336px;
  padding: 8px;
`

const CustomButton = styled(Button)`
  width: 100%;
`

const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
    width: '10%'
  },
  {
    title: 'Path',
    dataIndex: 'path'
  }
]

export const Frames = () => {
  const framePath = useStoreState(state => state.framePath)
  const addFramePath = store.getActions().addFramePath
  const setFramePath = store.getActions().setFramePath
  const [row, setRow] = useState([])

  const rowSelection = {
    selectedRowKeys: row,
    onChange: selectedRowKeys => {
      setRow(selectedRowKeys)
    }
  }

  const addFrames = () => {
    if (ipcRenderer) {
      let value = ipcRenderer.sendSync('open-frames')
      if (framePath.length + value.length > 255) {
        message.error('The number of frames exceeds 255')
        return
      }
      addFramePath(value)
    }
  }

  const deleteFrames = () => {
    let newPath = []
    framePath.forEach((value, i) => {
      if (!row.includes(i)) {
        newPath.push(value)
      }
    })
    setFramePath(newPath)
    setRow([])
  }

  return (
    <Col>
      <TableWrapper>
        {framePath.length ? (
          <Table
            size="small"
            bordered
            columns={columns}
            dataSource={framePath}
            rowSelection={rowSelection}
            scroll={{ x: 720, y: 240 }}
          />
        ) : (
          <Col
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
          >
            Please add your animation frames
          </Col>
        )}
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
