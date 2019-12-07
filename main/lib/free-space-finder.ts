import fs from 'fs'

const chunkSize: number = 65536
const freeSpaceByte: number = 0xff

const findFreeSpace = (offset: number, count: number, path: string) => {
  offset = offset - (offset % 4)
  count = count + 4 - (count % 4)

  let fd = fs.openSync(path, 'r')

  let buffer: Buffer = new Buffer(chunkSize)
  let maxLoop: number = fs.statSync(path).size / chunkSize

  let maxBuffer: number = 0
  let match: boolean = false

  for (
    let i = 0, currentOffset = offset;
    i < maxLoop;
    i++, currentOffset += chunkSize
  ) {
    let size: number = fs.readSync(fd, buffer, 0, chunkSize, currentOffset)

    if (size < count) return -1

    maxBuffer = size > count ? size - count : 1

    for (let j = 0; j < maxBuffer; j += count) {
      if (buffer[j + (count - 1)] == freeSpaceByte) {
        if (buffer[j] == freeSpaceByte) {
          match = true

          for (let k = j + (count - 2); k > j; k--) {
            if (buffer[k] != freeSpaceByte) {
              match = false
              break
            }
          }

          if (match) {
            fs.closeSync(fd)
            return offset + j + chunkSize * i
          }
        }
      }
    }
  }

  fs.closeSync(fd)
  return -1
}

export default findFreeSpace
