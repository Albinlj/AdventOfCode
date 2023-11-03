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
  const [from, to] = input
    .split('-')
    .map((str) => parseInt(str))

  let test = from
  let numPass = 0
  do {
    const str = test.toString()
    if (
      Array.from(str).some(
        (c, i, arr) =>
          c === arr[i + 1] &&
          (i === 5 ||
            c !== arr[i + 2]) &&
          (i === 0 || c !== arr[i - 1])
      ) &&
      !Array.from(str).some(
        (c, i, arr) =>
          i != 0 && c < arr[i - 1]
      )
    ) {
      console.log(str)
      numPass++
    }

    test++
  } while (test <= to)

  return numPass
}

// 838

test('part1', () => {
  const a = part1('256310-732736')
  expect(a).toBe(30)
})
