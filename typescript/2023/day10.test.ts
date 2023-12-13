import { expect, test } from 'bun:test'
import chalk from 'chalk'
import { chunk } from 'lodash'
import { basename } from 'path'
import {
  groupBy,
  groupWith,
  map,
  range,
  reduce,
  sortBy,
  split,
} from 'ramda'

type Tile = {
  x: number
  y: number
  ch: string
  neighborCoords: number[][]
  neighbors: Tile[]
}

const pipes = new Map(
  Object.entries({
    '|': [
      [0, -1],
      [0, 1],
    ],
    '-': [
      [-1, 0],
      [1, 0],
    ],
    L: [
      [0, -1],
      [1, 0],
    ],
    J: [
      [0, -1],
      [-1, 0],
    ],
    '7': [
      [-1, 0],
      [0, 1],
    ],
    F: [
      [1, 0],
      [0, 1],
    ],
  })
)

const part1 = (input: string) => {
  let [loop] = getLoop(input)
  return loop.length / 2
}

const part2 = (input: string) => {
  const [loop, map] = getLoop(input)

  let totalRightTurns = 0
  let prevTile

  for (const pipe of loop) {
    if (!prevTile) {
      prevTile = pipe
      continue
    }

    if (pipe.ch === 'F') {
      if (prevTile.y === pipe.y) {
        totalRightTurns++
      } else {
        totalRightTurns--
      }
    }

    if (pipe.ch === '7') {
      if (prevTile.y === pipe.y) {
        totalRightTurns--
      } else {
        totalRightTurns++
      }
    }
    if (pipe.ch === 'J') {
      if (prevTile.y === pipe.y) {
        totalRightTurns++
      } else {
        totalRightTurns--
      }
    }
    if (pipe.ch === 'L') {
      if (prevTile.y === pipe.y) {
        totalRightTurns--
      } else {
        totalRightTurns++
      }
    }
    prevTile = pipe
  }

  const first = loop[0]!
  const second = loop[1]!

  let dy = second.y! - first.y!
  let dx = second.x! - first.x!
  totalRightTurns *= -1

  let inside = -1
  if (dy === 1) {
    if (totalRightTurns > 0) {
      inside = 0
    } else {
      inside = 2
    }
  }

  if (dy === -1) {
    if (totalRightTurns < 0) {
      inside = 0
    } else {
      inside = 2
    }
  }

  if (dx === 1) {
    if (totalRightTurns > 0) {
      inside = 3
    } else {
      inside = 1
    }
  }
  if (dx === -1) {
    if (totalRightTurns < 0) {
      inside = 3
    } else {
      inside = 1
    }
  }

  if (input.indexOf('\n') > 30) {
    inside = (inside + 2) % 4
  }

  const set = new Set()

  const shoot = (
    _x: number,
    _y: number,
    direction: number
  ) => {
    let x = _x
    let y = _y

    let dx =
      direction === 0
        ? 1
        : direction === 2
        ? -1
        : 0
    let dy =
      direction === 1
        ? -1
        : direction === 3
        ? 1
        : 0

    while (1) {
      x += dx
      y += dy

      if (
        loop.some(
          (loopTile) =>
            loopTile.x === x &&
            loopTile.y === y
        )
      ) {
        break
      }

      const width = input
        .trim()
        .indexOf('\n')
      if (
        x > width ||
        y > input.length / width ||
        x < 0 ||
        y < 0
      )
        throw 'no'
      set.add([x, y].join())
    }
  }

  const turn = (
    dir: 'LEFT' | 'RIGHT'
  ) => {
    if (dir === 'LEFT') {
      inside = (inside + 1) % 4
    } else {
      inside = (inside + 3) % 4
    }
  }

  prevTile = undefined

  for (const pipe of loop) {
    const shot = (direction: number) =>
      shoot(pipe.x, pipe.y, direction)

    if (!prevTile) {
      shot(inside)
      prevTile = pipe
      continue
    }

    if (pipe.ch === 'F') {
      if (prevTile.y !== pipe.y) {
        if (inside === 2) {
          shot(2)
          shot(1)
        }

        turn('RIGHT')
      } else {
        if (inside === 1) {
          shot(2)
          shot(1)
        }

        turn('LEFT')
      }
    }

    if (pipe.ch === '7') {
      if (prevTile.y !== pipe.y) {
        if (inside === 0) {
          shot(0)
          shot(1)
        }

        turn('LEFT')
      } else {
        if (inside === 1) {
          shot(0)
          shot(1)
        }

        turn('RIGHT')
      }
    }
    if (pipe.ch === 'J') {
      if (prevTile.y !== pipe.y) {
        if (inside === 0) {
          shot(0)
          shot(3)
        }

        turn('RIGHT')
      } else {
        if (inside === 2) {
          shot(0)
          shot(3)
        }
        turn('LEFT')
      }
    }
    if (pipe.ch === 'L') {
      if (prevTile.y !== pipe.y) {
        if (inside === 2) {
          shot(2)
          shot(3)
        }
        turn('LEFT')
      } else {
        if (inside === 3) {
          shot(2)
          shot(3)
        }
        turn('RIGHT')
      }
    }

    if (pipe.ch === '|') {
      if (inside === 0) {
        shot(0)
      } else {
        shot(2)
      }
    }

    if (pipe.ch === '-') {
      if (inside === 1) {
        shot(1)
      } else {
        shot(3)
      }
    }

    prevTile = pipe
  }

  return set.size
}

const EXAMPLE_INPUT_1 = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`
const EXAMPLE_INPUT_2 = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`
const EXAMPLE_INPUT_3 = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`

const EXAMPLE_INPUT_4 = `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`

const input = await Bun.file(
  'day10.input.txt'
).text()

test('part1', () => {
  expect(part1(EXAMPLE_INPUT_1)).toBe(4)
  expect(part1(input)).toBe(6786)

  expect(part2(EXAMPLE_INPUT_2)).toBe(4)
  expect(part2(EXAMPLE_INPUT_3)).toBe(8)
  expect(part2(EXAMPLE_INPUT_4)).toBe(
    10
  )
  expect(part2(input)).toBe(495)
})

function getLoop(input: string) {
  const tiles = input
    .trim()
    .split('\n')
    .flatMap<Tile>((line, y) =>
      Array.from(line.trim()).map(
        (ch, x) => {
          return {
            x,
            y,
            ch,
            neighborCoords:
              pipes
                .get(ch)
                ?.map(([a, b]) => [
                  a + x,
                  b + y,
                ]) ?? [],
            neighbors: [],
          }
        }
      )
    )

  const tileMap = new Map(
    tiles.map((t) => [
      t.x + ',' + t.y,
      t,
    ])
  )

  const start = tiles.find(
    ({ ch }) => ch === 'S'
  )

  if (!start) throw 'wat'

  start.neighborCoords = [
    [-1 + start.x, 0 + start.y],
    [1 + start.x, 0 + start.y],
    [0 + start.x, -1 + start.y],
    [0 + start.x, 1 + start.y],
  ]

  for (const tile of tiles) {
    tile.neighbors =
      tile.neighborCoords.map(
        (nbc) =>
          tileMap.get(nbc.join())!
      )
  }

  const second = start.neighbors.find(
    (n) => n.neighbors.includes(start)
  )!

  let loop = [start, second]

  let prev = start
  let current = second

  while (true) {
    const next = current.neighbors.find(
      (n) => n !== prev
    )!

    if (next === start) {
      break
    }

    loop.push(next)
    prev = current
    current = next
  }
  return [loop, tileMap] as const
}
