import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day06.input.txt').text()

const example = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`

test('day06', () => {
  // expect(part1(example)).toBe(41)
  // expect(part1(input)).toBe(5239)
  // expect(part2(example)).toBe(6)
  // expect(part2(input)).toBe(1753)
})

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

const part1 = (input: string) => {
  const lines = input.trim().split('\n')
  const width = lines[0].length
  const height = lines.length
  const grid = lines.flatMap((line, y) =>
    line
      .trim()
      .split('')
      .map((ch, x) => ({ ch, x, y }))
  )

  let { x, y } = grid.find(({ ch }) => ch === '^')!

  const rocks = new Set(
    grid.filter(({ ch }) => ch === '#').map(({ x, y }) => x + ',' + y)
  )

  const visited = new Set()
  visited.add(x + ',' + y)

  let direction = 0
  while (true) {
    const [dx, dy] = directions[direction]
    const newX = x + dx
    const newY = y + dy

    if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
      break
    }
    if (rocks.has(newX + ',' + newY)) {
      direction = (direction + 1) % 4
      continue
    }

    x = newX
    y = newY
    visited.add(x + ',' + y)
  }

  return visited.size
}

const part2 = (input: string) => {
  const lines = input.trim().split('\n')
  const width = lines[0].length
  const height = lines.length
  const grid = lines.flatMap((line, y) =>
    line
      .trim()
      .split('')
      .map((ch, x) => ({ ch, x, y }))
  )

  let { x: startX, y: startY } = grid.find(({ ch }) => ch === '^')!
  const rocks = new Set(
    grid.filter(({ ch }) => ch === '#').map(({ x, y }) => x + ',' + y)
  )

  const checkIfCreatesLoopyLoopThing = (rockX: number, rockY: number) => {
    let x = startX
    let y = startY

    const rockz = new Set([...rocks])
    rockz.add(rockX + ',' + rockY)
    const visited = new Set()
    let direction = 0

    visited.add(x + ',' + y + ',' + direction)

    while (true) {
      const [dx, dy] = directions[direction]
      const newX = x + dx
      const newY = y + dy

      if (newX < 0 || newX >= width || newY < 0 || newY >= height) {
        return false
      }
      if (rockz.has(newX + ',' + newY)) {
        direction = (direction + 1) % 4
        continue
      }

      x = newX
      y = newY

      const oldSize = visited.size
      visited.add(x + ',' + y + ',' + direction)

      if (visited.size === oldSize) {
        return true
      }
    }
  }

  let possiblePositions = 0

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (checkIfCreatesLoopyLoopThing(x, y)) {
        possiblePositions++
      }
    }
  }

  return possiblePositions
}
