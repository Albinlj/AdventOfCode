import { expect, test } from 'bun:test'

const input = await Bun.file('day03.input.txt').text()
const example1 = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`
const example2 = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`

test('day02', () => {
  expect(part1(example1)).toBe(161)
  expect(part1(input)).toBe(178794710)
  expect(part2(example2)).toBe(48)
  expect(part2(input)).toBe(76729637)
})

function findMulMatches(input: string) {
  return [
    ...input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g),
  ]
}

const part1 = (input: string) =>
  findMulMatches(input)
    .map(([, a, b]) => parseInt(a) * parseInt(b))
    .reduce((a, b) => a + b)

const part2 = (input: string) =>
  findMulMatches(input)
    .map((m) => {
      const doIndex = input.lastIndexOf('do()', m.index)
      const dontIndex = input.lastIndexOf(
        "don't()",
        m.index
      )

      return dontIndex === -1 || doIndex > dontIndex
        ? parseInt(m[1]) * parseInt(m[2])
        : 0
    })
    .reduce((a, b) => a + b)
