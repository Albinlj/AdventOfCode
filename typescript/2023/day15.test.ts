import { expect, test } from 'bun:test'
import { o } from 'ramda'

const testInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`

const input = await Bun.file(
  'day15.input.txt'
).text()

test('part1', () => {
  expect(part1(testInput)).toBe(1320)
  expect(hashAlg('ot')).toBe(3)
  expect(part1(testInput)).toBe(512283)
})

test('part2', () => {
  expect(part2(testInput)).toBe(3)
})

const hashAlg = (
  str: string
): number => {
  let currVal = 0

  for (let i = 0; i < str.length; i++) {
    currVal += str.charCodeAt(i)
    currVal *= 17
    currVal %= 256
  }

  return currVal
}

const part1 = (input: string) => {
  return input
    .trim()
    .split(',')
    .map(hashAlg)
    .map((c) => {
      console.log(c)
      return c
    })
    .reduce((a, b) => a + b)
}

const part2 = (input: string) => {
  const stuff = input.trim().split(',')
}
