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

test('day13', () => {
  expect(part1(example)).toBe(480)
  expect(part1(input)).toBe(31897)

  expect(solveSystem(94, 34, 22, 67, 8400, 5400)).toEqual({
    A: 80,
    B: 40,
  })

  expect(part2(input)).toBe(480)

  // expect(
  //   solveSystem(
  //     26n,
  //     66n,
  //     67n,
  //     21n,
  //     8400_000_000_000_000_0n,
  //     5400_000_000_000_000_0n
  //   )
  // ).toEqual({ A: 40n, B: 80n })
})

const doit = ({
  ax,
  ay,
  bx,
  by,
  px,
  py,
}: {
  ax: number
  ay: number
  bx: number
  by: number
  px: number
  py: number
}) => {}

function solveSystem(
  a: number,
  b: number,
  c: number,
  d: number,
  Xtarget: number,
  Ytarget: number
): { A: number; B: number } | null {
  // Determinant of the 2×2 matrix
  // | a   c |
  // | b   d | = a*d - b*c
  const det = a * d - b * c

  // If determinant is 0, no unique solution
  if (det === 0) {
    return null
  }

  // Numerators for A and B (Cramer's rule)
  // A_num = Xtarget*d - Ytarget*c
  // B_num = Ytarget*a - Xtarget*b
  const A_num = Xtarget * d - Ytarget * c
  const B_num = Ytarget * a - Xtarget * b

  // A = A_num / det
  // B = B_num / det
  // Must check exact divisibility:
  if (A_num % det !== 0 || B_num % det !== 0) {
    return null // not an integer solution
  }

  const A = A_num / det
  const B = B_num / det

  return { A, B }
}

const part2 = (input: string) => {
  const machines = input.trim().split('\n\n')

  let total = 0

  for (const element of machines) {
    const matches = element.matchAll(/\d+/g)

    const [ax, ay, bx, by, px, py] = matches.map((m) => parseInt(m[0]))

    const result = solveSystem(
      ax,
      ay,
      bx,
      by,
      px + 10000000000000,
      py + 10000000000000
    )

    if (result == null) continue

    total = total + result.A * 3 + result.B
  }

  return total
}

// 2830000000000000 maybe
// 1210000000000000 high
// 657423972007 low
// 657423972007

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

// A*94 + B*22 = 8400
// A*34 + B*67 = 5400

// B*67 = 5400 - A*34
// B = (5400 - A*34) / 67

// A*94 + ((5400 - A*34)/67)*22 = 8400
// A*94 + ((5400 - A*34)*22/67) = 8400
// A*94 + ((5400 * 22 - A*34 * 22)/67) = 8400
// A*94 + ((118800 - A*748)/67) = 8400
// A*94 + ((118800 - A*748)/67) = 8400
// A + (118800 - A*748)/6298 = 8400 / 94
// A + 118800/6298 - A*748/6298 = 8400 / 94
// A + 118800/6298 - A*748/6298 = 8400 / 94
// A  - A*748/6298 = 8400 / 94- 118800/6298
// A(1  - 748/6298) = 8400 / 94- 118800/6298
// A = 8400 / 94- 118800/6298 / (1  - 748/6298)
//

/**
 * Solves the system of linear equations:
 *     a*A + c*B = Xtarget
 *     b*A + d*B = Ytarget
 *
 * Returns an object { A, B } if a unique solution exists,
 * or null if there is no unique solution (the determinant is zero).
 *
 * Note: This returns real (floating-point) solutions. If you need
 * both A and B to be integers, check Number.isInteger(A) and
 * Number.isInteger(B) afterward.
 */
