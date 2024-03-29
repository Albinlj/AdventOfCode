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
  const wires = input
    .split('\n')
    .map((str) =>
      str.split(',').map((str) => ({
        dir: str[0] as
          | 'R'
          | 'L'
          | 'U'
          | 'D',
        dist: parseInt(str.slice(1)),
      }))
    )

  const coords = wires.map((w) =>
    w.reduce(
      (coords, segment) => {
        const [startX, startY] =
          coords.at(-1)!

        const length = coords.length - 1

        const relativeCoords = range(
          1,
          segment.dist + 1
        ).map((i) => {
          switch (segment.dir) {
            case 'R':
              return [
                startX + i,
                startY,
                length + i,
              ]
            case 'L':
              return [
                startX - i,
                startY,
                length + i,
              ]
            case 'U':
              return [
                startX,
                startY + i,
                length + i,
              ]
            case 'D':
              return [
                startX,
                startY - i,
                length + i,
              ]
          }
        })

        return [
          ...coords,
          ...relativeCoords,
        ]
      },
      [[0, 0, 0]]
    )
  )

  const [coordsA, coordsB] = coords

  const crosses = coordsA.reduce(
    (acc, ca) => {
      for (let cb of coordsB) {
        // console.log(ca, cb)

        if (
          ca[0] === cb[0] &&
          ca[1] === cb[1] &&
          ca[2] !== 0
        ) {
          return [...acc, ca[2] + cb[2]]
        }
      }
      return acc
    },
    []
  )
  crosses.sort((a, b) => a - b)

  return crosses.at(0)
}

test('part1', () => {
  const thyng = part1(
    'R8,U5,L5,D3\nU7,R6,D4,L4'
  )
  expect(thyng).toBe(30)

  const thing = part1(
    'R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83'
  )
  expect(thing).toBe(610)

  const thong = part1(
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7'
  )
  expect(thong).toBe(410)

  const real = part1(input)
  expect(real).toBe(308)
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
