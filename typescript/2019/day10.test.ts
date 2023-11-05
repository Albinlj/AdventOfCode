import { expect, test } from 'bun:test'
import {
  collectBy,
  groupBy,
} from 'ramda'

const part1 = (input: string) => {
  const lines = input.split('\n')
  const height = lines.length
  const width = lines.at(0)!.length

  const asteroids = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const ch = lines[y][x]
      if (ch === '#')
        asteroids.push([x, y])
    }
  }

  let maxVis = 0

  for (
    let i = 0;
    i < asteroids.length;
    i++
  ) {
    const visible = new Set()
    const [x, y] = asteroids[i]

    for (
      let j = 0;
      j < asteroids.length;
      j++
    ) {
      if (i === j) continue
      const [compB, compY] =
        asteroids[j]

      const [relX, relY] = [
        compB - x,
        compY - y,
      ]

      const gcd = greatestCommonDivisor(
        relX,
        relY
      )
      visible.add(
        relX / gcd + ',' + relY / gcd
      )
    }

    if (visible.size > maxVis)
      maxVis = visible.size
  }

  return maxVis
}

const part2 = (input: string) => {
  const lines = input.split('\n')
  const height = lines.length
  const width = lines.at(0)!.length

  let asteroids = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const ch = lines[y][x]
      if (ch !== '.')
        asteroids.push([x, y])
    }
  }

  let maxVis = 0
  let laserPos = [Infinity, Infinity]

  for (
    let i = 0;
    i < asteroids.length;
    i++
  ) {
    const visible = new Set()
    const [x, y] = asteroids[i]

    for (
      let j = 0;
      j < asteroids.length;
      j++
    ) {
      if (i === j) continue
      const [compB, compY] =
        asteroids[j]

      const [relX, relY] = [
        compB - x,
        compY - y,
      ]

      const gcd = greatestCommonDivisor(
        relX,
        relY
      )
      visible.add(
        relX / gcd + ',' + relY / gcd
      )
    }

    if (visible.size > maxVis) {
      maxVis = visible.size
      laserPos = asteroids[i]
    }
  }

  asteroids = asteroids.filter(
    (a) => a !== laserPos
  )

  for (const asteroid of asteroids) {
    const [relX, relY] = [
      asteroid[0] - laserPos[0],
      asteroid[1] - laserPos[1],
    ]

    asteroid[2] =
      Math.abs(relX) + Math.abs(relY)

    const gcd = greatestCommonDivisor(
      relX,
      relY
    )

    asteroid[3] =
      (Math.atan2(
        relY / gcd,
        relX / gcd
      ) +
        Math.PI / 2 +
        2 * Math.PI) %
      (2 * Math.PI)
  }

  asteroids.sort(
    (
      [x1, y1, distance1, ang1],
      [x2, y2, distance2, ang2]
    ) =>
      (ang1 - ang2) * 1000 +
      (distance1 - distance2)
  )
  const anglesToAsteroid = new Map<
    number,
    number[]
  >()

  const sortedAsteroids = collectBy(
    (a) => a[3],
    asteroids
  )

  // console.log(sortedAsteroids)

  let i = 0
  let blown = 0
  while (true) {
    const currAngleAstroids =
      sortedAsteroids[
        i % sortedAsteroids.length
      ]
    if (i < 5) {
      // console.log(currAngleAstroids)
    }
    const toBlow =
      currAngleAstroids.shift()

    if (toBlow) {
      if (
        toBlow[0] === laserPos[0] &&
        toBlow[1] === laserPos[1]
      ) {
        console.log('ASIDJIODJQIOWE')
      } else {
        blown++
      }

      // console.log(toBlow)
      if (blown === 51) {
        console.log(currAngleAstroids)
        return [toBlow[0], toBlow[1]]
      }
    }

    i++
  }

  return sortedAsteroids[0]
}

const input = await Bun.file(
  'day10.input.txt'
).text()

const example1 = await Bun.file(
  'day10.example1.txt'
).text()

const example2 = await Bun.file(
  'day10.example2.txt'
).text()

test('part1', () => {
  const a = part1(example1)
  expect(a).toBe(8)

  const b = part1(example2)
  expect(b).toBe(210)

  const c = part1(input)
  expect(c).toBe(274)
})

test('part2', () => {
  const b = part2(example2)
  expect(b).toEqual([8, 2])

  // const c = part2(input)
  // expect(c).toBe(274)
})

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
