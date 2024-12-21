import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day13.input.txt').text()

const example = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`

test('day12', () => {
  expect(part1(example)).toBe(480)
  expect(part1(input)).toBe(31897)
})

const part1 = (input: string) => {
  const machines = input.trim().split('\n\n')
  let bestFinishes = []

  for (const element of machines) {
    const matches = element.matchAll(/\d+/g)
    const [ax, ay, bx, by, px, py] = matches.map((m) => parseInt(m[0]))

    let finishes = []

    a: for (let a = 0; a < 100; a++) {
      const tax = a * ax
      const tay = a * ay
      if (tax > px || tay > py) break a

      b: for (let b = 0; b < 100; b++) {
        const tbx = b * bx
        const tby = b * by
        if (tax + tbx === px && tay + tby === py) {
          finishes.push(a * 3 + b * 1)
        }
      }
    }

    finishes.sort()

    bestFinishes.push(finishes.at(-1))
  }

  return bestFinishes.filter(Boolean).reduce((a, b) => a + b)
}
