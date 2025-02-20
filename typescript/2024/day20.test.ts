import { expect, test } from 'bun:test'
import { countBy } from 'lodash'
import { insert } from 'ramda'

const input = await Bun.file('day20.input.txt').text()

const example = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`

type Node = {
  ch: string
  x: number
  y: number
  picos?: number
}

test('day20', () => {
  // expect(part1(example)).toEqual(6)
  // expect(part1(input)).toEqual(1441)
  // expect(part2(example, 50)).toEqual(6)
  // expect(part2(input, 100)).toEqual(6)
})

const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]

const part1 = (input: string) => {
  const { nodes, find } = findUnCheatyPath(input)

  let cheats = new Map()
  for (const node of nodes) {
    const { x, y, picos } = node

    for (const [dx, dy] of dirs) {
      const xa = x + dx
      const ya = y + dy
      const found = find(xa, ya)
      if (found) continue

      for (const [dx, dy] of dirs) {
        const xb = xa + dx
        const yb = ya + dy
        const found = find(xb, yb)
        if (!found) continue

        const diff = found.picos! - (picos! + 2)

        if (diff > 0) {
          const hash = [xa, ya, xb, yb].join(',')
          const exists = cheats.get(hash)
          if (exists == undefined || exists < diff) {
            cheats.set(hash, diff)
          }
        }
      }
    }
  }

  return cheats
    .values()
    .filter((v) => v >= 100)
    .toArray().length
}

const part2 = (input: string, limit: number) => {
  const { nodes } = findUnCheatyPath(input)
  let cheatsCount = 0

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i]
    for (let j = i + limit; j < nodes.length; j++) {
      const b = nodes[j]
      const normalDistance = b.picos! - a.picos!
      const cheatDistance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
      if (cheatDistance > 20) continue
      const cheatDiff = normalDistance - cheatDistance
      if (cheatDiff >= limit) cheatsCount++
    }
  }
  return cheatsCount
}

function findUnCheatyPath(input: string) {
  const nodes = input
    .trim()
    .split('\n')
    .flatMap<Node>((line, y) => line.split('').map((ch, x) => ({ x, y, ch })))
    .filter(({ ch }) => ch !== '#')

  const start = nodes.find(({ ch }) => ch === 'S')!
  start.picos = 0

  const find = (_x: number, _y: number) =>
    nodes.find(({ x, y }) => x === _x && y === _y)

  const open = [start]
  const closed = []

  while (open.length > 0) {
    const curr = open.pop()!
    const { x, y, picos } = curr
    closed.push(curr)

    for (let [dx, dy] of dirs) {
      const found = find(x - dx, y - dy)
      if (found) {
        if (closed.includes(found)) continue
        found.picos = picos! + 1
        open.push(found)
      }
    }
  }
  nodes.sort((a, b) => a.picos - b.picos)
  return { nodes, find }
}
