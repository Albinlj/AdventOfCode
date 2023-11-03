import { expect, test } from 'bun:test'
import {
  map,
  pipe,
  range,
  reduce,
  split,
} from 'ramda'

const input = await Bun.file(
  'day1.input.txt'
).text()

const part1 = (input: string) => {}

test('part1', () => {
  const a = part1('256310-732736')
  expect(a).toBe(30)
})

// test('part2', () => {
//   const thyng = part2(
//     'R8,U5,L5,D3\nU7,R6,D4,L4'
//   )
//   expect(thyng).toBe(30)

//   const thing = part2(
//     'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'
//   )
//   expect(thing).toBe(610)

//   const thong = part1(
//     'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
//   )
//   expect(thong).toBe(410)

//   const real = part2(input)
//   expect(real).toBe(Infinity)
// })
