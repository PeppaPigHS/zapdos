import fs from 'fs'

import {
  checkDimension,
  checkType,
  getPalette,
  encode,
  Color
} from './lib/image'
import compress from './lib/lz77'
import findFreeSpace from './lib/free-space-finder'
import { HOOK, ANIMATION_ROUTINE } from './lib/asm'

const reply = (success: boolean, message: string) => {
  return { success: success, message: message }
}

const checkHeader = (path: string) => {
  let fd: number = fs.openSync(path, 'r')
  let header: Buffer = new Buffer(4)

  fs.readSync(fd, header, 0, 4, 0xac)
  if (header.toString() !== 'BPRE') return false
  fs.closeSync(fd)

  return true
}

const main = (
  romPath: string,
  destPath: string,
  frame: Array<any>,
  savePalette: boolean,
  startOffset: number = 0x800000
) => {
  if (romPath === '') return reply(false, 'Please select a ROM')
  if (frame.length === 0) return reply(false, 'No frame has been added')

  let fd: number = fs.openSync(destPath, 'w+')
  fs.copyFileSync(romPath, destPath)

  const writeBytes = (data: Buffer, offset: number) => {
    fs.writeSync(fd, data, 0, data.length, offset)
  }

  if (!checkHeader(destPath))
    return reply(false, 'Selected ROM is not Pokemon Fire Red')

  let valid: boolean = true,
    message
  let palette: Array<Color> = null
  let imgOffset: Array<number> = []

  frame.forEach(imgPath => {
    let img: Buffer = fs.readFileSync(imgPath)

    if (!checkDimension(img)) {
      valid = false
      message = reply(false, 'Image width and height must be divisible by 8')
      return
    }
    if (!checkType(img)) {
      valid = false
      message = reply(false, 'Image must be 4-bit depth and has palette')
      return
    }

    if (palette == null) palette = getPalette(img)

    let compressedImg: Buffer = compress(encode(img, palette))

    let offset: number = findFreeSpace(
      startOffset,
      compressedImg.length,
      destPath
    )

    if (offset == -1) {
      valid = false
      message = reply(false, 'Not enough free space in ROM')
      return
    }

    imgOffset.push(offset)
    writeBytes(compressedImg, offset)
  })

  if (!valid) return message

  if (savePalette) {
    let gbaPalette: Array<number> = []
    palette.forEach(color => {
      let gbaColor: number =
        ((color.r >> 3) & 0x1f) +
        (((color.g >> 3) & 0x1f) << 5) +
        (((color.b >> 3) & 0x1f) << 10)
      gbaPalette.push(gbaColor & 0xff)
      gbaPalette.push((gbaColor >> 8) & 0xff)
    })

    writeBytes(Buffer.from(gbaPalette), 0xead5e8)
  }

  let animationTable: Array<number> = []

  imgOffset.forEach((offset, i) => {
    animationTable.push(offset & 0xff)
    animationTable.push((offset >> 8) & 0xff)
    animationTable.push((offset >> 16) & 0xff)
    animationTable.push(0x8)
    animationTable.push(0x3)
    animationTable.push(i == imgOffset.length - 1 ? 0x0 : i + 1)
    animationTable.push(0xff)
    animationTable.push(0xff)
  })

  let animationTableOffset: number = findFreeSpace(
    startOffset,
    animationTable.length,
    destPath
  )

  if (animationTableOffset == -1)
    return reply(false, 'Not enough free space in ROM')

  writeBytes(Buffer.from(animationTable), animationTableOffset)

  let animationRoutine: Array<number> = ANIMATION_ROUTINE
  let hook: Array<number> = HOOK

  animationRoutine[52] = animationTableOffset & 0xff
  animationRoutine[53] = (animationTableOffset >> 8) & 0xff
  animationRoutine[54] = (animationTableOffset >> 16) & 0xff

  let routineOffset: number = findFreeSpace(
    startOffset,
    animationRoutine.length,
    destPath
  )

  if (routineOffset == -1) return reply(false, 'Not enough free space in ROM')

  writeBytes(Buffer.from(animationRoutine), routineOffset)
  writeBytes(Buffer.from(hook), 0x78bfc)

  let repoint: Array<number> = [
    (routineOffset + 1) & 0xff,
    ((routineOffset + 1) >> 8) & 0xff,
    ((routineOffset + 1) >> 16) & 0xff,
    0x8
  ]

  writeBytes(Buffer.from(repoint), 0x78c1c)

  fs.closeSync(fd)

  return reply(true, 'Save to ROM successfully')
}

export default main
