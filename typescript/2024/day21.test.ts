import { expect, test } from 'bun:test'
import { countBy } from 'lodash'
import { init, insert } from 'ramda'

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
  expect(computeDirection('7', '6')).toEqual(['v>>', '>>v'])

  expect(calculateCodeComplexity('029A')).toEqual(68 * 29)
  expect(part1(example)).toEqual(126384)
})

const part1 = (input: string) =>
  input
    .trim()
    .split('\n')
    .map(calculateCodeComplexity)
    .reduce((a, b) => a + b)

const calculateCodeComplexity = (code: string) => {
  // get which buttons needs to be pressed

  const myButtons = '><A.A>A.a.a>AA'

  return myButtons.length * parseInt(code.slice(0, -1))
}

// const map = {
//   A0: ['<'],
//   A1: ['^<<'],
//   A2: ['^<'],
//   A3: ['^'],
//   A4: ['^^<<'],
//   A5: ['^^<', '<^^'],
//   A6: ['^^'],
//   A7: ['^^^<<'],
//   A8: ['^^^<'],
//   A9: ['^^^'],
//   '0A': ['>'],
// }

interface Position {
  row: number
  col: number
}

const positions: Record<string, Position> = {
  '7': { row: 0, col: 0 },
  '8': { row: 0, col: 1 },
  '9': { row: 0, col: 2 },
  '4': { row: 1, col: 0 },
  '5': { row: 1, col: 1 },
  '6': { row: 1, col: 2 },
  '1': { row: 2, col: 0 },
  '2': { row: 2, col: 1 },
  '3': { row: 2, col: 2 },
  '0': { row: 3, col: 1 },
  A: { row: 3, col: 2 },
}

function computeDirection(from: string, to: string): string[] {
  const dr: number = positions[to].row - positions[from].row
  const dc: number = positions[to].col - positions[from].col
  const vertical: string =
    dr < 0 ? '^'.repeat(-dr) : dr > 0 ? 'v'.repeat(dr) : ''
  const horizontal: string =
    dc < 0 ? '<'.repeat(-dc) : dc > 0 ? '>'.repeat(dc) : ''

  // Return both possible orders if both vertical and horizontal moves are required.
  if (vertical && horizontal) {
    return [vertical + horizontal, horizontal + vertical]
  }
  return [vertical + horizontal]
}
