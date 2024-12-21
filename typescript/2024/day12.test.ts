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

const example1 = `
AAAA
BBCD
BBCC
EEEC
`

test('day12', () => {
  expect(part1(example)).toBe(1930)
  expect(part1(input)).toBe(1363682)

  expect(part2(example1)).toBe(80)
  expect(part2(example)).toBe(1206)
  expect(part2(input)).toBe(1206)
})

const part1 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''))

  const width = grid[0].length
  const height = grid.length

  let finishedRegions = new Set()
  let price = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (finishedRegions.has(x + ',' + y)) continue
      const char = grid[y][x]

      let open = [[x, y]]
      let region = new Set()
      let borders = 0
      let area = 0

      while (open.length > 0) {
        const [x, y] = open.pop()!
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
          const newCh = grid[newY][newX]
          if (
            region.has(hash) ||
            open.some(([x, y]) => x === newX && y === newY)
          ) {
            continue
          } else {
            if (char === newCh) {
              open.push([newX, newY])
            } else {
              borders++
            }
          }
        }
      }

      price += borders * area

      for (const coord of region) {
        finishedRegions.add(coord)
      }
    }
  }

  return price
}

const part2 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .map((line) => line.split(''))

  const width = grid[0].length
  const height = grid.length

  let finishedRegions = new Set()
  let price = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (finishedRegions.has(x + ',' + y)) continue
      const char = grid[y][x]

      let open = [[x, y]]
      let region = new Set<string>()

      while (open.length > 0) {
        const [x, y] = open.pop()!
        region.add(x + ',' + y)

        for (let [dx, dy] of [
          [1, 0],
          [0, -1],
          [-1, 0],
          [0, 1],
        ]) {
          const [newX, newY] = [x + dx, y + dy]
          if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
            continue
          }

          const hash = newX + ',' + newY
          const newCh = grid[newY][newX]
          if (
            region.has(hash) ||
            open.some(([x, y]) => x === newX && y === newY)
          ) {
            continue
          } else if (char === newCh) {
            open.push([newX, newY])
          }
        }
      }

      let corners = 0

      const reg = region
        .values()
        .map((reg) => {
          const [x, y] = reg.split(',').map((a) => parseInt(a))
          return { x, y }
        })
        .toArray()

      for (const square of reg) {
        const { x, y } = square

        const n = region.has(x + ',' + (y - 1))
        const nw = region.has(x - 1 + ',' + (y - 1))
        const w = region.has(x - 1 + ',' + y)
        const sw = region.has(x - 1 + ',' + (y + 1))
        const s = region.has(x + ',' + (y + 1))
        const se = region.has(x + 1 + ',' + (y + 1))
        const e = region.has(x + 1 + ',' + y)
        const ne = region.has(x + 1 + ',' + (y - 1))

        if (!n && !e) corners++
        if (!s && !e) corners++
        if (!n && !w) corners++
        if (!s && !w) corners++

        if (n && e && !ne) corners++
        if (s && e && !se) corners++
        if (n && w && !nw) corners++
        if (s && w && !sw) corners++
      }

      price += region.size * corners

      for (const coord of region) {
        finishedRegions.add(coord)
      }
    }
  }
  return price
}
