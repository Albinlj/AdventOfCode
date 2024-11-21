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

// test('part1', () => {
//   expect(part1(testInput)).toBe(136)
//   expect(part1(input)).toBe(111339)
// })

test('part2', () => {
  expect(part2(testInput)).toBe(64)
  // expect(part1(input)).toBe(111339)
})

const part2 = (input: string) => {
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

  const sizeY = lines.length
  const sizeX = lines[0].length

  const directions = [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ]

  let prevShit: string[] = []

  struten: for (
    let i = 0;
    i < 1_000_000_000;
    i++
  ) {
    if (i % 100000 === 0) console.log(i)
    for (let [
      rollX,
      rollY,
    ] of directions) {
      let isFinished
      do {
        let didMoveThisIteration = false

        for (let rock of rocks) {
          const newX = rock.x + rollX
          const newY = rock.y + rollY

          if (
            rock.ch === '#' ||
            newX < 0 ||
            newY < 0 ||
            newX === sizeX ||
            newY === sizeY
          ) {
            continue
          }

          const hitRock = rocks.find(
            (r) =>
              r.x === newX &&
              r.y === newY
          )

          if (!hitRock) {
            didMoveThisIteration = true
            rock.y += -1
          }
        }

        if (!didMoveThisIteration) {
          isFinished = true
        }
      } while (!isFinished)

      const newShit = rocks
        .filter(({ ch }) => ch !== '#')
        .map(
          ({ x, y, ch }) => x + ',' + y
        )
        .toSorted()
        .join('.')

      console.log(newShit)

      if (prevShit.includes(newShit)) {
        console.log('SHIT FOUND!')
        console.log('SHIT FOUND!')
        console.log('SHIT FOUND!')
        console.log(prevShit.length)
        console.log(
          prevShit.findLastIndex(
            (a) => a === newShit
          )
        )

        break struten
      }

      prevShit.push(newShit)
    }
  }

  console.log(rocks)

  return rocks
    .filter((r) => r.ch !== '#')
    .map((r) => lines.length - r.y)
    .reduce((a, b) => a + b)
}

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
