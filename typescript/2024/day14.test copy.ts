import { stdout } from 'bun'
import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day14.input.txt').text()

const example = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`

test('day12', () => {
  // expect(part1(example, 11, 7)).toBe(12)
  expect(part1(input, 101, 103)).toBe(12)
})

const part1 = (input: string, width: number, height: number) => {
  const robots = input
    .trim()
    .split('\n')
    .map((line) => {
      const matches = line.matchAll(/-?\d+/g)
      const [x, y, vx, vy] = matches.map((m) => parseInt(m[0]))

      return { x, y, vx, vy }
    })

  for (let i = 0; i < 1000000; i++) {
    for (const r of robots) {
      r.x = (r.x + r.vx + width) % width
      r.y = (r.y + r.vy + height) % height
    }

    // let lines = Array.from({ length: height }).fill('.'.repeat(width))

    const start = 20
    const window = 10

    // if (i >= start && i < start + window) {
    // console.log(i)
    if (i % 10000 === 0) {
      console.log(i)
    }
    let ja = false
    let lines = Array.from({ length: height }).fill('.'.repeat(width))
    for (const robot of robots) {
      const line = Array.from(lines[robot.y])
      line[robot.x] = 'X'
      const joined = line.join('')
      lines[robot.y] = joined
      if (joined.includes('XXXXXXX')) {
        ja = true
      }
    }
    if (ja) {
      console.log(i, i, i, i)
      console.log(lines.join('\n'))
      ja = false
    }
    // }
  }
  console.log('---')

  // const cuads = [0, 0, 0, 0]
  // for (const r of robots) {
  //   if (r.x < Math.floor(width / 2)) {
  //     if (r.y < Math.floor(height / 2)) {
  //       cuads[0]++
  //     } else if (r.y >= Math.ceil(height / 2)) {
  //       cuads[2]++
  //     }
  //   }
  //   if (r.x >= Math.ceil(width / 2)) {
  //     if (r.y < Math.floor(height / 2)) {
  //       cuads[1]++
  //     } else if (r.y >= Math.ceil(height / 2)) {
  //       cuads[3]++
  //     }
  //   }
  // }

  // return cuads.reduce((a, b) => a * b)
}
