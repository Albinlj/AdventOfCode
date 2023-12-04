import { expect, test } from 'bun:test'
import chalk from 'chalk'
import { gcd, lcm } from './utils'

const part1 = (
  input: string,
  steps: number
) => {
  const asteroids = input
    .split('\n')
    .map((line) =>
      line
        .split(',')
        .map((a) => parseInt(a))
    )
    .map((asteroid) => [
      asteroid,
      [0, 0, 0],
    ])

  for (let i = 0; i < steps; i++) {
    //
    for (
      let a = 0;
      a < asteroids.length - 1;
      a++
    ) {
      for (
        let b = a + 1;
        b < asteroids.length;
        b++
      ) {
        const [posA, velA] =
          asteroids[a]
        const [posB, velB] =
          asteroids[b]

        const [ax, ay, az] = posA
        const [bx, by, bz] = posB

        const [dx, dy, dz] = [
          -Math.sign(ax - bx),
          -Math.sign(ay - by),
          -Math.sign(az - bz),
        ]

        velA[0] += dx
        velA[1] += dy
        velA[2] += dz

        velB[0] -= dx
        velB[1] -= dy
        velB[2] -= dz
      }
    }

    for (const [
      pos,
      vel,
    ] of asteroids) {
      pos[0] += vel[0]
      pos[1] += vel[1]
      pos[2] += vel[2]
    }
  }

  let tot = 0
  for (const [pos, vel] of asteroids) {
    let pot = 0
    let kin = 0

    pot += Math.abs(pos[0])
    pot += Math.abs(pos[1])
    pot += Math.abs(pos[2])

    kin += Math.abs(vel[0])
    kin += Math.abs(vel[1])
    kin += Math.abs(vel[2])

    tot += pot * kin
  }

  return tot
}

const part2 = (input: string) => {
  const asteroids = input
    .split('\n')
    .map((line) =>
      line
        .split(',')
        .map((a) => parseInt(a))
    )
    .map((asteroid) => [
      asteroid,
      [0, 0, 0],
    ])

  const calcAxis = (axis: number) => {
    const oneDimAsteroids =
      asteroids.map(([pos, vel]) => [
        pos[axis],
        vel[axis],
      ])

    const hasch = new Set()
    let steps = 0

    while (true) {
      steps++

      const hash = JSON.stringify(
        oneDimAsteroids
      )
      console.log(hash)
      if (hasch.has(hash)) {
        console.log(chalk.bgCyan(steps))
        return steps
      } else {
        hasch.add(hash)
      }

      for (let a = 0; a < 3; a++) {
        for (
          let b = a + 1;
          b < 4;
          b++
        ) {
          const A = oneDimAsteroids[a]
          const B = oneDimAsteroids[b]

          const d = Math.sign(
            A[0] - B[0]
          )

          if (axis === 1)
            console.log(A, B, d)

          A[1] -= d
          B[1] += d

          if (axis === 1) {
            console.log(A, B, d)
            console.log('----')
          }
        }
      }

      console.log(chalk.red('xxxxxx'))
      for (const ast of oneDimAsteroids) {
        if (axis === 1) console.log(ast)
        ast[0] += ast[1]
        if (axis === 1) {
          console.log(ast)
          console.log(',,,,,;,;,;')
        }
      }
    }
  }

  let stepsX = calcAxis(0)
  let stepsY = calcAxis(1)
  let stepsZ = calcAxis(2)

  const grej = stepsX * stepsY * stepsZ

  return lcm([stepsX, stepsY, stepsZ])
}

test('part1', () => {
  expect(part1(example1, 10)).toEqual(
    179
  )
  expect(part1(example2, 100)).toEqual(
    1940
  )
  expect(part1(input, 1000)).toEqual(
    6490
  )
})

test('part2', () => {
  expect(part2(example1)).toEqual(2772)
  // expect(part2(example2)).toEqual(
  //   4686774924
  // )
  // expect(part2(input)).toEqual(Infinity)
})

const input = await Bun.file(
  'day12.input.txt'
).text()

const example1 = await Bun.file(
  'day12.example1.txt'
).text()

const example2 = await Bun.file(
  'day12.example2.txt'
).text()

function greatestCommonDivisor(
  a: number,
  b: number
) {
  if (b) {
    return greatestCommonDivisor(
      b,
      a % b
    )
  } else {
    return Math.abs(a)
  }
}
function gcm(arg0: number[]) {
  throw new Error(
    'Function not implemented.'
  )
}
