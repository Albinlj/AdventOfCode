import { expect, test } from 'bun:test'
import { countBy } from 'lodash'
import { insert, memoizeWith } from 'ramda'

const input = '4610211 4 0 59 3907 201586 929 33750'

const example = `125 17`

test('day18', () => {
  expect(part1(example, 6)).toEqual(22)
  expect(part1(example, 25)).toEqual(55312)
  expect(part1(input, 25)).toEqual(197357)
  expect(part2(input)).toEqual(234568186890978)
})

const part1 = (input: string, blinks: number) => {
  const _stones = input
    .trim()
    .split(' ')
    .map((a) => parseInt(a))

  for (let blink = 0; blink < blinks; blink++) {
    let stoneIndex = 0
    while (stoneIndex < _stones.length) {
      const num = _stones[stoneIndex]

      if (num === 0) {
        _stones[stoneIndex] = 1
        stoneIndex++
        continue
      }

      const str = num.toString()
      if (str.length % 2 === 0) {
        const midpoint = Math.floor(str.length / 2)
        _stones.splice(
          stoneIndex,
          1,
          parseInt(str.slice(0, midpoint)),
          parseInt(str.slice(midpoint))
        )
        stoneIndex += 2
        continue
      }

      _stones[stoneIndex] = num * 2024

      stoneIndex++
    }
  }

  return _stones.length
}

const part2 = (input: string) => {
  const stones = input
    .trim()
    .split(' ')
    .map((a) => parseInt(a))

  let counts = countBy(stones)

  for (let i = 0; i < 75; i++) {
    const newCounts: Record<string, number> = {}
    for (let [stone, count] of Object.entries(counts)) {
      const num = parseInt(stone)

      if (num === 0) {
        newCounts[1] = (newCounts[1] ?? 0) + count
        continue
      }

      if (stone.length % 2 === 0) {
        const midpoint = Math.floor(stone.length / 2)
        const a = parseInt(stone.slice(0, midpoint))
        const b = parseInt(stone.slice(midpoint))

        newCounts[a] = (newCounts[a] ?? 0) + count
        newCounts[b] = (newCounts[b] ?? 0) + count
        continue
      }

      const multiplied = num * 2024
      newCounts[multiplied] = (newCounts[multiplied] ?? 0) + count
    }

    counts = newCounts
  }

  return Object.values(counts).reduce((a, b) => a + b)
}
