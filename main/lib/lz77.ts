const searchBytes = (data: Buffer, index: number, length: number) => {
  let pos: number = 2,
    match: number = 0,
    found: number = -1

  if (index + 2 < data.length) {
    while (pos < length + 1 && match != 18) {
      if (
        data[index - pos] == data[index] &&
        data[index - pos + 1] == data[index + 1]
      ) {
        if (index > 2) {
          if (data[index - pos + 2] == data[index + 2]) {
            let _match: number = 2
            let compatible: boolean = true

            while (
              compatible &&
              _match < 18 &&
              _match + index < data.length - 1
            ) {
              ++_match
              if (data[index + _match] != data[index - pos + _match])
                compatible = false
            }

            if (_match > match) {
              match = _match
              found = pos
            }
          }
          ++pos
        } else {
          found = pos
          match = -1
          ++pos
        }
      } else ++pos
    }

    return { actualMatch: found, match: match }
  } else return { actualMatch: -1, match: match }
}

const compress = (data: Buffer) => {
  let file: Array<number> = [
    0x10,
    data.length & 0xff,
    (data.length >> 8) & 0xff,
    (data.length >> 16) & 0xff
  ]
  let preBytes: Array<number> = [data[0], data[1]]

  let watch: number = 0,
    shortPosition: number = 2,
    actualPosition: number = 2,
    match: number = -1,
    bestLength: number = 0

  while (actualPosition < data.length) {
    if (shortPosition === 8) {
      file.push(watch)
      preBytes.forEach(value => file.push(value))

      watch = 0
      shortPosition = 0
      preBytes = []
    } else {
      if (actualPosition + 1 < data.length) {
        let search = searchBytes(
          data,
          actualPosition,
          Math.min(4096, actualPosition)
        )
        match = search.actualMatch
        bestLength = search.match
      } else match = -1

      if (match == -1) {
        preBytes.push(data[actualPosition])
        watch = (watch << 1) & 0xff
        ++actualPosition
      } else {
        let length: number = -1
        let start: number = match

        if (bestLength == -1) {
          start = match
          let compatible: boolean = true

          while (
            compatible &&
            length < 18 &&
            length + actualPosition < data.length - 1
          ) {
            ++length
            if (
              data[actualPosition + length] !=
              data[actualPosition - start + length]
            )
              compatible = false
          }
        } else length = bestLength

        let b: number = ((length - 3) << 12) + (start - 1)

        preBytes.push((b >> 8) & 0xff)
        preBytes.push(b & 0xff)

        actualPosition += length

        watch = ((watch << 1) + 1) & 0xff
      }
      ++shortPosition
    }
  }

  if (shortPosition != 0) {
    watch = (watch << (8 - shortPosition)) & 0xff
    file.push(watch)
    preBytes.forEach(value => file.push(value))
  }

  return Buffer.from(file)
}

export default compress
