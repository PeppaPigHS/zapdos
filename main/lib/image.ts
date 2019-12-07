import PNG from 'pngjs'

export interface Color {
  r: number
  g: number
  b: number
}

export const checkDimension = (data: Buffer) => {
  let width: number = 0,
    height: number = 0

  for (let i = 0x10; i < 0x10 + 4; i++) width = (width << 8) + data[i]
  for (let i: number = 0x14; i < 0x14 + 4; i++) height = (height << 8) + data[i]

  return width % 8 == 0 && height % 8 == 0
}

export const checkType = (data: Buffer) => {
  return data[0x18] == 0x4 && data[0x19] == 0x3
}

export const getPalette = (data: Buffer) => {
  let palette: Array<Color> = []
  let position: number = 0,
    size: number = 0

  for (let i = 0; i < data.length; i++)
    if (data.slice(i, i + 4).toString() === 'PLTE') {
      position = i
      break
    }
  for (let i = position - 4; i < position; i++) size = (size << 8) + data[i]

  for (let i = position + 4; i < position + 4 + size; i += 3) {
    let currentColor: Color = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    }
    palette.push(currentColor)
  }

  while (palette.length < 16) palette.push({ r: 0, g: 0, b: 0 })

  return palette
}

export const encode = (data: Buffer, palette: Array<Color>) => {
  let image: Array<number> = []
  let png = PNG.PNG.sync.read(data)

  const getPixel = (x: number, y: number) => {
    let idx = (png.width * y + x) << 2
    let currentColor: Color = {
      r: png.data[idx],
      g: png.data[idx + 1],
      b: png.data[idx + 2]
    }
    return currentColor
  }

  const getIndex = (color: Color) => {
    let ret: number = 0
    for (let i = 0; i < palette.length; i++)
      if (
        palette[i].r == color.r &&
        palette[i].g == color.g &&
        palette[i].b == color.b
      )
        ret = i
    return ret
  }

  for (let l = 0; l < png.height / 8; l++) {
    for (let k = 0; k < png.width / 8; k++) {
      for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 8; i += 2) {
          let color_1 = getIndex(getPixel((k << 3) + i, (l << 3) + j))
          let color_2 = getIndex(getPixel((k << 3) + i + 1, (l << 3) + j))

          image.push((color_1 & 0xf) + ((color_2 & 0xf) << 4))
        }
      }
    }
  }

  return Buffer.from(image)
}
