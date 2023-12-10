import { expect, test } from 'bun:test'
import {
  map,
  pipe,
  range,
  reduce,
  split,
} from 'ramda'

const input = await Bun.file(
  'day3.input.txt'
).text()

const part1 = (input: string) => {
  return 2
}

const EXAMPLE_INPUT =
  'R8,U5,L5,D3\nU7,R6,D4,L4'

test('part1', () => {
  expect(part1(EXAMPLE_INPUT)).toBe(2)

  // const real = part1(input)
  // expect(real).toBe(308)
})
