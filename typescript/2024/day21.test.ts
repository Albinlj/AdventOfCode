import { expect, test } from 'bun:test'

const example = `
029A
980A
179A
456A
379A
`

const input = `
671A
826A
670A
085A
283A
`

test('day20', () => {
  expect(calculateCodeComplexity('029A')).toEqual(68 * 29)
  expect(part1(example)).toEqual(126384)
  expect(part1(input)).toEqual(182844)
})

const part1 = (input: string) =>
  input
    .trim()
    .split('\n')
    .map(calculateCodeComplexity)
    .reduce((a, b) => a + b)

const calculateCodeComplexity = (code: string) => {
  const numberMap = createMap(numberCoords)
  const arrowMap = createMap(arrowCoords)

  let paths = getPaths(code, numberMap)
  let paths2 = paths.flatMap((path) => getPaths(path, arrowMap))
  let paths3 = paths2.flatMap((path) => getPaths(path, arrowMap))

  const shortestSequenceLength = paths3
    .map((p) => p.length)
    .sort()
    .at(0)!
  return shortestSequenceLength * parseInt(code.slice(0, -1))
}

const createMap = (keypad: Keypad) => {
  const map = keypad.flatMap(([key1, [y1, x1]]) =>
    keypad.map(([key2, [y2, x2]]) => {
      const moves: string[] = []
      if (y1 < y2) moves.push('v'.repeat(y2 - y1))
      if (y1 > y2) moves.push('^'.repeat(y1 - y2))
      if (x1 < x2) moves.push('>'.repeat(x2 - x1))
      if (x1 > x2) moves.push('<'.repeat(x1 - x2))
      const moveString = moves.join('')
      const rev = moveString.split('').reverse().join('')

      const stringMoves = [...new Set([moveString, rev])].filter((moves) =>
        isValid(moves, y1, x1, keypad)
      )

      return [`${key1}${key2}`, stringMoves] as const
    })
  )
  return Object.fromEntries(map)
}
function getPaths(code: string, numberMap: { [k: string]: string[] }) {
  let pos = 'A'
  let paths = ['']
  for (const digit of code) {
    const moves = numberMap[pos + digit]
    paths = paths.flatMap((p) => moves.map((m) => p + m + 'A'))
    pos = digit
  }
  return paths
}

function isValid(
  moves: string,
  y1: number,
  x1: number,
  keypad: Keypad
): boolean {
  const validCoords = keypad.map(([key, coords]) => coords)

  for (const move of moves) {
    if (move === '<') x1--
    if (move === '>') x1++
    if (move === '^') y1--
    if (move === 'v') y1++

    if (!validCoords.some(([vy, vx]) => vy == y1 && vx == x1)) {
      return false
    }
  }
  return true
}

type Keypad = [string, [number, number]][]

const numberCoords: Keypad = [
  ['7', [0, 0]],
  ['8', [0, 1]],
  ['9', [0, 2]],
  ['4', [1, 0]],
  ['5', [1, 1]],
  ['6', [1, 2]],
  ['1', [2, 0]],
  ['2', [2, 1]],
  ['3', [2, 2]],
  ['0', [3, 1]],
  ['A', [3, 2]],
]

const arrowCoords: Keypad = [
  ['^', [0, 1]],
  ['<', [1, 0]],
  ['v', [1, 1]],
  ['>', [1, 2]],
  ['A', [0, 2]],
]
