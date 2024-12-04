import { expect, test } from 'bun:test'

const input = await Bun.file('day04.input.txt').text()
const example1 = `
....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX
`

const example2 = `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`

test('day04', () => {
  expect(part1(example1)).toBe(18)
  expect(part1(input)).toBe(2567)
  expect(part2(example2)).toBe(9)
  expect(part2(input)).toBe(2029)
})

const xmas = 'XMAS'

const makeGridMap = (input: string) =>
  new Map(
    input
      .trim()
      .split('\n')
      .flatMap((line, y) =>
        line
          .trim()
          .split('')
          .map((ch, x) => [x + ',' + y, { x, y, ch }])
      )
  )

const part1 = (input: string) => {
  const map = makeGridMap(input)

  const Xs = map
    .values()
    .filter((cell) => cell.ch === 'X')
    .toArray()

  let xmasCount = 0
  for (const X of Xs) {
    dirloop: for (const [dx, dy] of [
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
    ]) {
      for (let i = 1; i < xmas.length; i++) {
        const newcoord = [X.x + dx * i, X.y + dy * i]
        const foundChar = map.get(newcoord.join(','))?.ch

        if (foundChar !== xmas[i]) {
          continue dirloop
        }
      }

      xmasCount++
    }
  }

  return xmasCount
}

const part2 = (input: string) => {
  const map = makeGridMap(input)

  const As = map
    .values()
    .filter((cell) => cell.ch === 'A')
    .toArray()

  const words = ['SSMM', 'MSSM', 'MMSS', 'SMMS']
  const dirs = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]

  let count = 0

  for (let A of As) {
    word: for (const word of words) {
      for (let i = 0; i < 4; i++) {
        const [dx, dy] = dirs[i]
        const newcoord = [A.x + dx, A.y + dy]
        const neighbor = map.get(newcoord.join(','))

        if (word[i] !== neighbor?.ch) {
          continue word
        }
      }

      count++
    }
  }

  return count
}
