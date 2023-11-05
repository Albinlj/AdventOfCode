import { expect, test } from 'bun:test'

const part1 = (input: string) => {
  const layerCount =
    input.length / layerSize

  let layerWithFewestZeroes = -1
  let fewestZeroes = Infinity
  for (let i = 0; i < layerCount; i++) {
    const layer = input.slice(
      i * layerSize,
      (i + 1) * layerSize
    )

    let zeros = 0
    for (const ch of layer) {
      if (ch === '0') zeros++
    }

    if (zeros < fewestZeroes) {
      fewestZeroes = zeros
      layerWithFewestZeroes = i
    }
  }

  const layer = input.slice(
    layerWithFewestZeroes * layerSize,
    (layerWithFewestZeroes + 1) *
      layerSize
  )

  let ones = 0
  let twos = 0

  for (const ch of layer) {
    if (ch === '1') ones++
    if (ch === '2') twos++
  }

  return ones * twos
}

const part2 = (input: string) => {
  const layerCount =
    input.length / layerSize

  const layers = []
  for (let i = 0; i < layerCount; i++) {
    const layer = input.slice(
      i * layerSize,
      (i + 1) * layerSize
    )
    layers.push(layer)
  }

  let message = ''
  a: for (
    let char = 0;
    char < layerSize - 1;
    char++
  ) {
    for (let layer = 0; true; layer++) {
      const color = layers[layer][char]
      if (color !== '2') {
        if (color === '0')
          message = message + '.'
        else {
          message = message + 'X'
        }
        continue a
      }
    }
  }

  for (let line = 0; line < 6; line++) {
    console.log(
      message.slice(
        line * 25,
        (line + 1) * 25
      )
    )
  }

  return message
}
const input = await Bun.file(
  'day8.input.txt'
).text()

const example = '123456789012'

const layerSize = 25 * 6

test('part1', () => {
  const a = part1(input)
  expect(a).toBe(1742)
})

test('part2', () => {
  const a = part2(input)
  expect(a).toBe(
    '.XX....XX.X...XXXXX..XX..X..X....X.X...XX....X..X.X.......X..X.X.XXX..X..X.X.XX....X...X..X....XXXX.X..X.X..X...X..X....X..X..XXX..XX....X..XXXX.X..X'
  )
})
