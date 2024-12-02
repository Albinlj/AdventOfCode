import { expect, test } from 'bun:test'

const input = await Bun.file(
  'day01.input.txt'
).text()

const example = `
3   4
4   3
2   5
1   3
3   9
3   3
`

test('day01', () => {
  expect(part1(example)).toBe(11)
  expect(part1(input)).toBe(2176849)

  expect(part2(example)).toBe(31)
  expect(part2(input)).toBe(23384288)
})

const part1 = (input: string) => {
  const { a, b } = parse(input)

  let val = 0
  for (let i = 0; i < a.length; i++) {
    val += Math.abs(a[i] - b[i])
  }
  return val
}

const part2 = (input: string) => {
  const { a, b } = parse(input)

  const map = new Map<number, number>()

  for (const item of b) {
    const val = map.get(item)
    map.set(item, val ? val + 1 : 1)
  }

  let val = 0
  for (let i = 0; i < a.length; i++) {
    const me = a[i]
    val += me * (map.get(me) ?? 0)
  }
  return val
}

function parse(input: string) {
  const list = input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .split('   ')
        .map((a) => parseInt(a.trim()))
    )

  const a = list.map((a) => a[0]).sort()
  const b = list.map((a) => a[1]).sort()

  return { a, b }
}
