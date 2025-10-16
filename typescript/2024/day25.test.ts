import { expect, test } from 'bun:test'
import { transpose } from 'ramda'

const input = await Bun.file('day25.input.txt').text()

const example = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`

test('day20', () => {
  expect(part1(example)).toEqual(3)
  expect(part1(input)).toEqual(3508)
})

const part1 = (input: string) => {
  const grids = input.trim().split('\n\n')

  let keys: number[][] = []
  let locks: number[][] = []

  grids.map((grid) => {
    const lines = transpose(
      grid
        .trim()
        .split('\n')
        .map((line) => line.split(''))
    ).map((line) => line.join(''))

    let nums = lines.map((line) => {
      return line.match(/#/g)?.length! - 1
    })

    if (lines[0][0] === '#') {
      locks.push(nums)
    } else {
      keys.push(nums)
    }
  })

  let stuff = 0

  for (const key of keys) {
    lock: for (const lock of locks) {
      for (let i = 0; i < 7; i++) {
        if (key[i] + lock[i] > 5) continue lock
      }
      stuff++
    }
  }

  return stuff
}
