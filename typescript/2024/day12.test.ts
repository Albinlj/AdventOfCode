import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day12.input.txt').text()

const example = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`

test('day10', () => {
  expect(part1(example)).toBe(1930)
})

const part1 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''))

  const width = grid[0].length
  const height = grid.length

  let totalBorders = 0
  let totalArea = 0

  let finishedRegions = new Set()
  let stuff = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (finishedRegions.has(x + ',' + y)) continue
      const char = grid[y][x]

      let toSearch = [[x, y]]
      let region = new Set()
      let borders = 0
      let area = 0

      while (toSearch.length > 0) {
        const [x, y] = toSearch.pop()!

        const val = grid[y][x]
        // console.log('curr', x, y, val)

        if (val !== char) {
          borders++
          continue
        } else {
          region.add(x + ',' + y)
          area++

          for (let [dx, dy] of [
            [1, 0],
            [0, -1],
            [-1, 0],
            [0, 1],
          ]) {
            const [newX, newY] = [x + dx, y + dy]
            if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
              borders++
              continue
            }

            const hash = newX + ',' + newY
            if (region.has(hash)) {
              continue
            } else {
              if (!toSearch.some(([x, y]) => x === newX && y === newY)) {
                toSearch.push([newX, newY])
              }
            }
          }
        }
      }
      console.log(char, area, borders)
      totalBorders += borders
      totalArea += area
      stuff += borders * area

      for (const coord of region) {
        finishedRegions.add(coord)
      }
    }
  }

  return stuff
}
