import { expect, test } from 'bun:test'

const testInput = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`

const input = await Bun.file(
  'day14.input.txt'
).text()

test('part1', () => {
  expect(part1(testInput)).toBe(136)
  expect(part1(input)).toBe(111339)
})

const part1 = (input: string) => {
  const lines = input.trim().split('\n')
  const rocks = lines
    .flatMap((line, y) =>
      line.split('').map((ch, x) => {
        return {
          x,
          y,
          ch,
        }
      })
    )
    .filter((rock) => rock.ch !== '.')

  let isFinished
  do {
    let didMoveThisIteration = false

    for (let rock of rocks) {
      if (
        rock.ch === '#' ||
        rock.y == 0
      ) {
        // console.log(rock)
        continue
      }

      const hitRock = rocks.find(
        (r) =>
          r.x === rock.x &&
          r.y === rock.y - 1
      )

      // console.log(hitRock)

      if (!hitRock) {
        console.log('wee')
        didMoveThisIteration = true
        rock.y += -1
      }
    }

    if (!didMoveThisIteration) {
      isFinished = true
    }
  } while (!isFinished)

  return rocks
    .filter((r) => r.ch !== '#')
    .map((r) => lines.length - r.y)
    .reduce((a, b) => a + b)
}
