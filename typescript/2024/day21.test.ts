import { expect, test } from 'bun:test'
import { memoize } from 'lodash'

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

test('day21', () => {
  const a = '<A^A>^^AvvvA'
  const b = 'v<<A>>^A<A>AvA<^AA>A<vAAA>^A'
  const c =
    '<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'

  expect(part1(example)).toEqual(126384)
  expect(part1(input)).toEqual(182844)

  expect(findLeastPresses(a, 1)).toEqual(b.length)
  expect(findLeastPresses(b, 1)).toEqual(c.length)
  expect(findLeastPresses(a, 2)).toEqual(c.length)
  expect(part2(input, 25)).toEqual(226179529377982)
})

const findLeastPresses = memoize(
  (move: string, depth: number): number => {
    if (depth == 0) {
      return move.length
    }

    const arr = regex(move)
    if (arr.length > 1) {
      return arr.map((a) => findLeastPresses(a, depth)).reduce((a, b) => a + b)
    } else {
      return getPaths(arr.at(0)!, arrowMap)
        .map((seq) => findLeastPresses(seq, depth - 1))
        .sort((a, b) => a - b)
        .at(0)!
    }
  },
  (move, depth) => move + depth
)

const part1 = (input: string) =>
  input
    .trim()
    .split('\n')
    .map((code: string) => {
      let paths = getPaths(code, numberMap)
      let paths2 = paths.flatMap((path) => getPaths(path, arrowMap))
      let paths3 = paths2.flatMap((path) => getPaths(path, arrowMap))

      const shortestSequenceLength = paths3
        .map((p) => p.length)
        .sort((a, b) => a - b)
        .at(0)!
      return shortestSequenceLength * parseInt(code.slice(0, -1))
    })
    .reduce((a, b) => a + b)

const part2 = (input: string, depth: number) =>
  input
    .trim()
    .split('\n')
    .map((code: string) => {
      let paths = getPaths(code, numberMap)

      const leastPresses = paths
        .map((path) => findLeastPresses(path, depth))
        .sort((a, b) => a - b)
        .at(0)!

      return leastPresses * parseInt(code.slice(0, -1))
    })
    .reduce((a, b) => a + b)

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

function regex(move: string) {
  return move.match(/\D*?A/g) || []
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

const numberMap = createMap(numberCoords)
const arrowMap = createMap(arrowCoords)
