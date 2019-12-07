import React from 'react'

import { Checkbox } from 'antd'

import store from '../store/store'

export const Configure = () => {
  const setPalette = store.getActions().setPalette

  return (
    <>
      <Checkbox onChange={e => setPalette(e.target.checked)}>
        Save Palette
      </Checkbox>
    </>
  )
}
