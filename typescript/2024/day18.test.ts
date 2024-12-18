import { expect, test } from 'bun:test'
import { insert } from 'ramda'

const input = await Bun.file('day18.input.txt').text()

const example = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`

test('day18', () => {
  expect(part1(example, 7, 7, 12)).toEqual(22)
  expect(part1(input, 71, 71, 1024)).toBe(292)

  expect(part2(example, 7, 7)).toBe('6,1')
  expect(part2(input, 71, 71)).toBe('6,1')
})

type Node = {
  x: number
  y: number
  steps?: number
  cameFrom?: Node
}

const part2 = (input: string, width: number, height: number) => {
  let limit = 0

  leup: while (true) {
    limit++

    const bytes = input
      .trim()
      .split('\n')
      .slice(0, limit)
      .map((line) => {
        const [x, y] = line.split(',').map((x) => parseInt(x))
        return { x, y }
      })

    const byteSet = new Set(bytes.map(({ x, y }) => x + ',' + y))
    const nodes = new Map<string, Node>()

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!byteSet.has(x + ',' + y)) nodes.set(x + ',' + y, { x, y })
      }
    }

    const start = nodes.get('0,0')!
    start.steps = 0
    const end = nodes.get(`${width - 1},${height - 1}`)

    const open = [start]

    let i = 0
    while (open.length > 0) {
      const current = open.shift()!

      for (const [dx, dy] of [
        [1, 0],
        [0, -1],
        [-1, 0],
        [0, 1],
      ]) {
        const newX = current.x + dx
        const newY = current.y + dy

        const node = nodes.get(newX + ',' + newY)

        if (!node || node.steps !== undefined) continue

        const newSteps = current.steps! + 1
        node.steps = newSteps

        if (node === end) {
          continue leup
        }

        let insertIndex = open.findIndex((n) => n.steps! > node.steps!)
        if (insertIndex == -1) {
          insertIndex = open.length
        }

        open.splice(insertIndex, 0, node)
      }
    }
    const last = bytes.at(-1)

    return last?.x + ',' + last?.y
  }
}

const part1 = (input: string, width: number, height: number, limit: number) => {
  const bytes = input
    .trim()
    .split('\n')
    .slice(0, limit)
    .map((line) => {
      const [x, y] = line.split(',').map((x) => parseInt(x))
      return { x, y }
    })

  const byteSet = new Set(bytes.map(({ x, y }) => x + ',' + y))
  const nodes = new Map<string, Node>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!byteSet.has(x + ',' + y)) nodes.set(x + ',' + y, { x, y })
    }
  }

  const start = nodes.get('0,0')!
  start.steps = 0
  const end = nodes.get(`${width - 1},${height - 1}`)

  const open = [start]

  let i = 0
  while (open.length > 0) {
    const current = open.shift()!

    for (const [dx, dy] of [
      [1, 0],
      [0, -1],
      [-1, 0],
      [0, 1],
    ]) {
      const newX = current.x + dx
      const newY = current.y + dy

      const node = nodes.get(newX + ',' + newY)

      if (!node || node.steps !== undefined) continue

      const newSteps = current.steps! + 1
      node.steps = newSteps

      if (node === end) {
        return node.steps
      }

      let insertIndex = open.findIndex((n) => n.steps! > node.steps!)
      if (insertIndex == -1) {
        insertIndex = open.length
      }

      open.splice(insertIndex, 0, node)
    }
  }

  return undefined
}
