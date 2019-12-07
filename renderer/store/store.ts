import { createStore, action, Action } from 'easy-peasy'

export interface FramePath {
  key: number
  path: string
}

export interface StartOffset {
  custom: boolean
  offset: number
}

export interface StoreType {
  romPath: string
  framePath: Array<FramePath>
  palette: boolean
  startOffset: StartOffset

  setRomPath: Action<StoreType, string>
  setFramePath: Action<StoreType, Array<FramePath>>
  setPalette: Action<StoreType, boolean>
  setStartOffset: Action<StoreType, StartOffset>
}

export const initialState: StoreType = {
  romPath: '',
  framePath: [],
  palette: false,
  startOffset: { custom: false, offset: 0x800000 },

  setRomPath: action((state, value) => {
    state.romPath = value
  }),
  setFramePath: action((state, value) => {
    state.framePath = value
  }),
  setPalette: action((state, value) => {
    state.palette = value
  }),
  setStartOffset: action((state, value) => {
    state.startOffset = value
  })
}

const store = createStore(initialState)

export default store
