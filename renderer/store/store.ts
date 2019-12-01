import { createStore, action, Action } from 'easy-peasy'

export interface FramePath {
  key: number
  path: string
}

export interface StoreType {
  romPath: string
  framePath: Array<FramePath>

  setRomPath: Action<StoreType, string>
  addFramePath: Action<StoreType, Array<FramePath>>
  setFramePath: Action<StoreType, Array<FramePath>>
}

export const initialState: StoreType = {
  romPath: '',
  framePath: [],

  setRomPath: action((state, value) => {
    state.romPath = value
  }),
  addFramePath: action((state, value) => {
    value.forEach(file => {
      state.framePath.push(file)
    })
    state.framePath.forEach((file, i) => {
      state.framePath[i] = { key: i, path: file.path }
    })
  }),
  setFramePath: action((state, value) => {
    state.framePath = value
    state.framePath.forEach((file, i) => {
      state.framePath[i] = { key: i, path: file.path }
    })
  })
}

const store = createStore(initialState)

export default store
