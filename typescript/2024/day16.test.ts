import { expect, test } from 'bun:test'

const input = await Bun.file('day16.input.txt').text()

const example1 = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`

const example2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`

test('day10', () => {
  expect(part1(example1)).toBe(7036)
  expect(part1(example2)).toBe(11048)
  expect(part1(input)).toBe(114476)

  // expect(part2(example1)).toBe(45)
  // expect(part2(example2)).toBe(64)
})

const part1 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .flatMap((line, y) =>
      line
        .trim()
        .split('')
        .map((ch, x) => ({ x, y, ch }))
    )
    .filter(({ ch }) => ch !== '#')

  const map = new Map(grid.map(({ x, y, ch }) => [x + ',' + y, { x, y, ch }]))
  const allCells = map.values().toArray()
  const start = allCells.find((cell) => cell.ch === 'S')
  start.direction = 0
  start.points = 0

  let open = [start]
  let closed = []

  while (open.length > 0) {
    const current = open.shift()!
    const x = current.x
    const y = current.y

    for (const [dx, dy, dir] of [
      [1, 0, 0],
      [0, -1, 1],
      [-1, 0, 2],
      [0, 1, 3],
    ]) {
      const n = map.get([x + dx, y + dy].join(','))
      if (!n || closed.includes(n)) continue

      const directionDiff = Math.abs(current.direction - dir)
      const newPoints =
        current.points + 1 + (directionDiff === 3 ? 1 : directionDiff) * 1000

      if (n.ch === 'E') return newPoints

      n.points = newPoints
      n.direction = dir

      const indexToPut = open.findIndex((o) => o.points > n.points)
      if (indexToPut === -1) {
        open.push(n)
      } else {
        open.splice(indexToPut, 0, n)
      }
    }
    closed.push(current)
  }
}

const part2 = (input: string) => {
  const grid = input
    .trim()
    .split('\n')
    .flatMap((line, y) =>
      line
        .trim()
        .split('')
        .map((ch, x) => ({ x, y, ch }))
    )
    .filter(({ ch }) => ch !== '#')

  const map = new Map(
    grid.map(({ x, y, ch }) => [x + ',' + y, { x, y, ch, cameFrom: [] }])
  )
  const allCells = map.values().toArray()
  const start = allCells.find((cell) => cell.ch === 'S')
  start.direction = 0
  start.points = 0

  let open = [start]
  let closed = []
  let best = new Set()

  while (open.length > 0) {
    const current = open.shift()!
    const x = current.x
    const y = current.y

    for (const [dx, dy, dir] of [
      [1, 0, 0],
      [0, -1, 1],
      [-1, 0, 2],
      [0, 1, 3],
    ]) {
      const n = map.get([x + dx, y + dy].join(','))
      if (!n) continue

      const newPoints =
        current.points + 1 + (current.direction !== dir ? 1000 : 0)
      if (newPoints > n.points) continue

      n.points = newPoints
      n.cameFrom.push({ direction: dir, parent: current })

      const indexToPut = open.findIndex((o) => o.points > n.points)
      if (indexToPut === -1) {
        open.push(n)
      } else {
        open.splice(indexToPut, 0, n)
      }
    }

    closed.push(current)
  }

  print(best)

  return best.size
}

function print(best: Set<unknown>) {
  for (let y = 0; y < 15; y++) {
    let string = ''
    for (let x = 0; x < 15; x++) {
      if (
        best
          .values()
          .toArray()
          .some((b) => b.x === x && b.y === y)
      ) {
        string += 'O'
      } else {
        string += ' '
      }
    }
    console.log(string)
  }
}
