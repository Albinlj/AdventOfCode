import { expect, test } from 'bun:test'
import { insert } from 'ramda'

const input = await Bun.file('day10.input.txt').text()

const example = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`

test('day10', () => {
  expect(part1(example)).toEqual(36)
  expect(part1(input)).toEqual(682)

  expect(part2(example)).toEqual(81)
  expect(part2(input)).toEqual(1511)
})

const part1 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((a) => parseInt(a)))

  const height = grid.length
  const width = grid[0].length

  const getTrailHeadScore = (startX: number, startY: number) => {
    let nines = new Set()

    const doit = (x: number, y: number, expected: number) => {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        const num = grid[y][x]

        if (num === expected) {
          if (num === 9) {
            nines.add(x + ',' + y)
          } else {
            doit(x + 1, y, expected + 1)
            doit(x - 1, y, expected + 1)
            doit(x, y + 1, expected + 1)
            doit(x, y - 1, expected + 1)
          }
        }
      }
    }

    doit(startX, startY, 0)
    return nines.size
  }

  let score = 0

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      if (grid[y][x] === 0) {
        score += getTrailHeadScore(x, y)
      }
    }
  }

  return score
}

const part2 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split('').map((a) => parseInt(a)))

  const height = grid.length
  const width = grid[0].length

  const getTrailHeadScore = (startX: number, startY: number) => {
    let nines = 0

    const doit = (x: number, y: number, expected: number) => {
      if (y >= 0 && y < height && x >= 0 && x < width) {
        const num = grid[y][x]

        if (num === expected) {
          if (num === 9) {
            nines += 1
          } else {
            doit(x + 1, y, expected + 1)
            doit(x - 1, y, expected + 1)
            doit(x, y + 1, expected + 1)
            doit(x, y - 1, expected + 1)
          }
        }
      }
    }

    doit(startX, startY, 0)
    return nines
  }

  let score = 0

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      if (grid[y][x] === 0) {
        score += getTrailHeadScore(x, y)
      }
    }
  }

  return score
}
