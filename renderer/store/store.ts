import { createStore, action, Action } from 'easy-peasy'

export interface FramePath {
  key: number
  path: string
}

export interface StoreType {
  romPath: string
  framePath: Array<FramePath>

  setRomPath: Action<StoreType, string>
  setFramePath: Action<StoreType, Array<FramePath>>
}

export const initialState: StoreType = {
  romPath: '',
  framePath: [],

  setRomPath: action((state, value) => {
    state.romPath = value
  }),
  setFramePath: action((state, value) => {
    state.framePath = value
  })
}

const store = createStore(initialState)

export default store
