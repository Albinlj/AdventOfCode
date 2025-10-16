import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day08.input.txt').text()

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
  expect(part1(input)).toBe(301)
  expect(part2(example)).toBe(34)
  expect(part2(input)).toBe(1019)
})

const part1 = (input: string) => {
  const grid = input.trim().split('\n')
  const width = grid[0].length
  const height = grid.length

  const towers = grid.flatMap((line, y) =>
    line
      .trim()
      .split('')
      .map((ch, x) => ({ x, y, ch }))
      .filter(({ ch }) => ch !== '.' && ch !== ' ')
  )

  const frequencies = new Set([...towers.map(({ ch }) => ch)])
  const antiNodes = new Set('')

  for (const frequency of frequencies) {
    const towersOfFrequency = towers.filter(({ ch }) => ch === frequency)

    for (let i = 0; i < towersOfFrequency.length; i++) {
      for (let j = 0; j < towersOfFrequency.length; j++) {
        if (i === j) continue
        const a = towersOfFrequency[i]
        const b = towersOfFrequency[j]

        const deltaX = a.x - b.x
        const deltaY = a.y - b.y

        const cx = b.x - deltaX
        const cy = b.y - deltaY

        if (cx < width && cx >= 0 && cy < height && cy >= 0) {
          antiNodes.add('' + cx + ',' + cy)
        }
      }
    }
  }

  return antiNodes.size
}

const part2 = (input: string) => {
  const grid = input.trim().split('\n')
  const width = grid[0].length
  const height = grid.length

  const towers = grid.flatMap((line, y) =>
    line
      .trim()
      .split('')
      .map((ch, x) => ({ x, y, ch }))
      .filter(({ ch }) => ch !== '.' && ch !== ' ')
  )

  const frequencies = new Set([...towers.map(({ ch }) => ch)])

  const antiNodes = new Set('')

  for (const frequency of frequencies) {
    const towersOfFrequency = towers.filter(({ ch }) => ch === frequency)

    for (let i = 0; i < towersOfFrequency.length; i++) {
      for (let j = 0; j < towersOfFrequency.length; j++) {
        if (i === j) continue
        const a = towersOfFrequency[i]
        const b = towersOfFrequency[j]

        const deltaX = a.x - b.x
        const deltaY = a.y - b.y

        let nodeX = b.x
        let nodeY = b.y

        while (nodeX < width && nodeX >= 0 && nodeY < height && nodeY >= 0) {
          antiNodes.add('' + nodeX + ',' + nodeY)
          nodeX += deltaX
          nodeY += deltaY
        }
      }
    }
  }

  return antiNodes.size
}
