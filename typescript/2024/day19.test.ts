import { expect, test } from 'bun:test'
import { insert } from 'ramda'

const input = await Bun.file('day19.input.txt').text()

const example = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`

test('day19', () => {
  expect(part1(example)).toEqual(6)
  expect(part1(input)).toEqual(371)

  expect(part2(example)).toEqual(16)
  expect(part2(input)).toEqual(650354687260341)
})

const part1 = (input: string) => {
  const [_towels, _designs] = input.trim().split('\n\n')
  const towels = _towels.trim().split(', ')
  const designs = _designs.trim().split('\n')

  let validCount = 0
  for (const design of designs) {
    const isDoableTowel = (design: string): boolean => {
      if (design.length === 0) {
        return true
      }

      for (const towel of towels) {
        if (design.startsWith(towel)) {
          if (isDoableTowel(design.slice(towel.length))) {
            return true
          }
        }
      }

      return false
    }

    const isValid = isDoableTowel(design)

    if (isValid) {
      validCount++
    }
  }

  return validCount
}

const part2 = (input: string) => {
  const [_towels, _designs] = input.trim().split('\n\n')
  const towels = _towels.trim().split(', ')
  const designs = _designs.trim().split('\n')

  let totalWays = 0

  for (const design of designs) {
    const spots = Array.from({ length: design.length + 1 }, () => 0)
    spots[0] = 1

    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i]
      if (spot == 0) continue

      const remainder = design.slice(i)

      for (const towel of towels) {
        if (remainder.startsWith(towel)) {
          spots[i + towel.length] += spot
        }
      }
    }

    totalWays += spots.at(-1)!
  }

  return totalWays
}
