import { expect, test } from 'bun:test'

const input = await Bun.file('day15.input.txt').text()

const example = `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`

const example2 = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`

const examplePart2 = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`

test('day12', () => {
  expect(part1(example)).toBe(2028)
  expect(part1(example2)).toBe(10092)
  expect(part1(input)).toBe(1497888)

  expect(part2(example2)).toBe(9021)
  expect(part2(input)).toBe(1522420)
})

const part1 = (input: string) => {
  const [_grid, _moves] = input.trim().split('\n\n')

  const grid = _grid
    .split('\n')
    .flatMap((line, y) =>
      line
        .trim()
        .split('')
        .map((ch, x) => ({ x, y, ch }))
    )
    .filter(({ ch }) => ch !== '.')

  const moves = _moves.trim().replaceAll('\n', '')
  const find = (_x: number, _y: number) =>
    grid.find(({ x, y }) => x === _x && y === _y)

  const robot = grid.find(({ ch }) => ch === '@')!

  const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ]

  const attemptToMove = (x: number, y: number, direction: number): boolean => {
    const atPos = find(x, y)
    if (atPos === undefined) {
      return true
    }
    if (atPos.ch === '#') {
      return false
    }

    const [dx, dy] = dirs[direction]

    const newX = x + dx
    const newY = y + dy
    const isSuccess = attemptToMove(newX, newY, direction)

    if (isSuccess) {
      atPos.x = newX
      atPos.y = newY
    }

    return isSuccess
  }

  for (const move of moves) {
    const direction = '>^<v'.indexOf(move)
    attemptToMove(robot.x, robot.y, direction)
  }

  return grid.reduce((acc, { x, y, ch }) => {
    if (ch !== 'O') return acc
    else {
      return acc + y * 100 + x
    }
  }, 0)
}

const part2 = (input: string) => {
  const [_grid, _moves] = input.trim().split('\n\n')

  const grid: {
    x: number
    y: number
    ch: string
    shouldMove: boolean
  }[] = _grid.split('\n').flatMap((line, y) =>
    line
      .trim()
      .split('')
      .flatMap((ch, x) => {
        if (ch == '#')
          return [
            { x: x * 2, y, ch, shouldMove: false },
            { x: x * 2 + 1, y, ch, shouldMove: false },
          ]
        if (ch == '@') return [{ x: x * 2, y, ch, shouldMove: false }]
        if (ch == 'O')
          return [
            { x: x * 2, y, ch: '[', shouldMove: false },
            { x: x * 2 + 1, y, ch: ']', shouldMove: false },
          ]
        return []
      })
  )

  const moves = _moves.trim().replaceAll('\n', '')
  const find = (_x: number, _y: number) =>
    grid.find(({ x, y }) => x === _x && y === _y)

  const robot = grid.find(({ ch }) => ch === '@')!

  const dirs = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ]

  const checkMove = ({
    x,
    y,
    direction,
  }: {
    x: number
    y: number
    direction: number
  }): boolean => {
    const el = find(x, y)
    if (el === undefined) return true
    if (el.shouldMove) return true
    if (el.ch === '#') return false

    const [dx, dy] = dirs[direction]

    const newX = x + dx
    const newY = y + dy
    const couldMoveNext = checkMove({
      x: newX,
      y: newY,
      direction,
    })
    if (!couldMoveNext) return false

    el.shouldMove = true

    const isLateralMove =
      (el.ch == '[' || el.ch == ']') && (direction === 1 || direction === 3)
    if (isLateralMove) {
      let couldMoveOtherHalf = checkMove({
        x: x + (el.ch === '[' ? 1 : -1),
        y,
        direction,
      })
      if (!couldMoveOtherHalf) return false
    }

    return true
  }

  for (let move = 0; move < moves.length; move++) {
    for (const move of moves) {
      const direction = '>^<v'.indexOf(move)
      const canMove = checkMove({
        x: robot.x,
        y: robot.y,
        direction,
      })

      if (canMove) {
        const [dx, dy] = dirs[direction]

        for (const element of grid) {
          if (element.shouldMove) {
            element.x += dx
            element.y += dy
          }
        }
      }

      for (const element of grid) {
        element.shouldMove = false
      }
    }

    return grid.reduce((acc, { x, y, ch }) => {
      if (ch !== '[') return acc
      else {
        return acc + y * 100 + x
      }
    }, 0)
  }
}
