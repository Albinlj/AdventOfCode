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

type p2Node = {
  x: number
  y: number
  ch: string
  dir: number
  cameFrom: p2Node[]
  points: number | undefined
}

test('day10', () => {
  expect(part1(example1)).toBe(7036)
  expect(part1(example2)).toBe(11048)
  expect(part1(input)).toBe(114476)

  expect(part2(example1)).toBe(45)
  expect(part2(example2)).toBe(64)
  expect(part2(input)).toBe(508)
})

const part1 = (input: string) => {
  const grid = parse(input)

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
  const grid = parse(input)
  const map = new Map<string, p2Node>(
    grid.flatMap(({ x, y, ch }) =>
      [0, 1, 2, 3].map((dir) => [
        x + ',' + y + ',' + dir,
        {
          x,
          y,
          ch,
          dir,
          cameFrom: [],
          points: undefined,
        },
      ])
    )
  )
  const allCells = map.values().toArray()
  const start = allCells.find((cell) => cell.ch === 'S' && cell.dir === 0)!

  let open: p2Node[] = [start]
  let closed: p2Node[] = []

  while (open.length > 0) {
    const current = open.shift()!

    if (current.ch === 'E') continue

    const x = current.x
    const y = current.y

    const dirs = [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ]

    const [dx, dy] = dirs[current.dir]
    const move = [x + dx, y + dy, current.dir, 1]

    const spins = [0, 1, 2, 3]
      .filter((dir) => dir !== current.dir)
      .map((newDir) => [x, y, newDir, 1000])

    for (const [nx, ny, ndir, cost] of [...spins, move]) {
      const n = map.get([nx, ny, ndir].join(','))
      if (!n) continue

      const newPoints = (current.points ?? 0) + cost
      if (n.points && newPoints > n.points) continue
      if (n.points && newPoints < n.points) {
        n.cameFrom = []
      }

      n.points = newPoints

      n.cameFrom.push(current)

      if (n.cameFrom.length > 1) continue

      const indexToPut = open.findIndex((o) => o.points! > n.points!)
      if (indexToPut === -1) {
        open.push(n)
      } else {
        open.splice(indexToPut, 0, n)
      }
    }

    closed.push(current)
  }

  const ends = allCells
    .filter((cell) => cell.ch === 'E')
    .sort((a, b) => a.points! - b.points!)
  const lowestPoints = ends.at(0)?.points
  const bestEnds = ends.filter((e) => e.points === lowestPoints)

  let best = new Set<p2Node>()
  let open2 = new Set(bestEnds)
  let closed2 = new Set()

  while (open2.size > 0) {
    const now = Array.from(open2).pop()!
    open2.delete(now)
    closed2.add(now)
    best.add(now)
    for (const element of now.cameFrom) {
      if (!closed2.has(element)) open2.add(element)
    }
  }

  const uniqueCoords = new Set(Array.from(best).map((b) => b.x + ',' + b.y))
  return uniqueCoords.size
}

function parse(input: string) {
  return input
    .trim()
    .split('\n')
    .flatMap((line, y) =>
      line
        .trim()
        .split('')
        .map((ch, x) => ({ x, y, ch }))
    )
    .filter(({ ch }) => ch !== '#')
}
