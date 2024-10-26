import { expect, test } from 'bun:test'
import {
  Grid,
  gridFromString,
} from './grid'
import { transpose, xprod } from 'ramda'

const EXAMPLE_INPUT_1 = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`

const input = await Bun.file(
  'day11.input.txt'
).text()

test('part1', () => {
  expect(part1(input)).toBe(
    357134560737
  )
})

const part1 = (input: string) => {
  const rows = input
    .trim()
    .split('\n')
    .map((c) => c.trim().split(''))
  const cols = transpose(rows)

  const emptyRows = rows.reduce(
    (acc, curr, i) => {
      if (!curr.includes('#')) {
        acc.push(i)
      }
      return acc
    },
    [] as number[]
  )
  const emptyCols = cols.reduce(
    (acc, curr, i) => {
      if (!curr.includes('#')) {
        acc.push(i)
      }
      return acc
    },
    [] as number[]
  )

  const stuff = rows
    .flatMap((row, y) =>
      row.map((ch, x) => ({
        item: ch,
        coords: [x, y],
      }))
    )
    .filter((a) => a.item === '#')

  const grid = new Grid(stuff)
  const items = [...grid.map.values()]

  let dist = 0

  for (
    let i = 0;
    i < items.length - 1;
    i++
  ) {
    const a = items[i]

    for (
      let j = i + 1;
      j < items.length;
      j++
    ) {
      const b = items[j]

      let xdist = Math.abs(a.x - b.x)
      let xextras =
        emptyCols.filter(
          (ci) =>
            (ci > a.x && ci < b.x) ||
            (ci > b.x && ci < a.x)
        ).length *
        (1_000_000 - 1)

      let ydist = Math.abs(a.y - b.y)
      let yextras =
        emptyRows.filter(
          (ri) =>
            (ri > a.y && ri < b.y) ||
            (ri > b.y && ri < a.y)
        ).length *
        (1_000_000 - 1)

      dist +=
        xdist +
        xextras +
        ydist +
        yextras
    }
  }

  return dist
}
