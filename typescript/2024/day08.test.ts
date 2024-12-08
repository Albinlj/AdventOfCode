import { expect, test } from 'bun:test'

const input = await Bun.file('day07.input.txt').text()

const example = `
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`

test('day07', () => {
  expect(part1(example)).toBe(14)
  // expect(part1(input)).toBe(14)
})

const part1 = (input: string) => {
  const grid = input.trim().split('\n')

  const width = grid[0].length
  const height = grid.length

  console.log({ width, height })

  const towers = grid.flatMap((line, y) =>
    line
      .split('')
      .map((ch, x) => ({ x, y, ch }))
      .filter(({ ch }) => ch !== '.')
  )

  const frequencies = new Set([...towers.map(({ ch }) => ch)])
  const antiNodes = new Set()

  for (const frequency of frequencies) {
    const towersOfFrequency = towers.filter(({ ch }) => ch === frequency)

    for (let i = 0; i < towersOfFrequency.length - 1; i++) {
      for (let j = i + 1; j < towersOfFrequency.length; j++) {
        const a = towersOfFrequency[i]
        const b = towersOfFrequency[j]

        const deltaX = a.x - b.x
        const deltaY = a.y - b.y

        const cx = b.x - deltaX
        const cy = b.y - deltaY

        const dx = a.x + deltaX
        const dy = a.y + deltaY

        console.log({ a, b, deltaX, deltaY, cx, cy, dx, dy })

        if (cx < width && cx >= 0 && cy < height && cy >= 0) {
          antiNodes.add(cx + ',' + cy)
        }

        if (dx < width && dx >= 0 && dy < height && dy >= 0) {
          antiNodes.add(dx + ',' + dy)
        }
      }
    }
  }

  return antiNodes.size
}
