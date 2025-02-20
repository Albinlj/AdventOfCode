import { stdout } from 'bun'
import { expect, test } from 'bun:test'
import chalk from 'chalk'

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
  // expect(part1(example)).toBe(2028)
  // expect(part1(example2)).toBe(10092)
  // expect(part1(input)).toBe(1497888)

  expect(part2(example2)).toBe(9021)
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
    console.log(move, direction, dirs[direction])
    attemptToMove(robot.x, robot.y, direction)
    console.log(robot)
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

  const grid = _grid.split('\n').flatMap((line, y) =>
    line
      .trim()
      .split('')
      .flatMap((ch, x) => {
        if (ch == '#')
          return [
            { x: x * 2, y, ch },
            { x: x * 2 + 1, y, ch },
          ]
        if (ch == '@') return [{ x: x * 2, y, ch }]
        if (ch == 'O')
          return [
            { x: x * 2, y, ch: '[' },
            { x: x * 2 + 1, y, ch: ']' },
          ]
        return []
      })
  )

  const print = () => {
    const yo = Array.from({ length: 10 }, () => '.'.repeat(20))

    for (const cell of grid) {
      const line = yo[cell.y]
      const array = Array.from(line)
      array[cell.x] = cell.ch
      yo[cell.y] = array.join('')
    }
    console.log(yo.join('\n'))
  }

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

  const attemptToMove = (
    x: number,
    y: number,
    direction: number,
    isOtherHalf: boolean = false,
    onlyCheck: boolean = true
  ): boolean => {
    // console.log('attempt', x, y, direction)
    const atPos = find(x, y)
    if (atPos === undefined) {
      return true
    }
    if (atPos.ch === '#') {
      return false
    }

    let couldMoveOtherHalf = true
    const isLateralMove = direction === 1 || direction === 3
    if (!isOtherHalf && isLateralMove) {
      if (atPos.ch === '[') {
        couldMoveOtherHalf = attemptToMove(x + 1, y, direction, true, true)
      }
      if (atPos.ch === ']') {
        couldMoveOtherHalf = attemptToMove(x - 1, y, direction, true, true)
      }
    }
    const [dx, dy] = dirs[direction]

    const newX = x + dx
    const newY = y + dy
    const couldMoveNext = attemptToMove(newX, newY, direction, false, true)

    const couldMove = couldMoveNext && couldMoveOtherHalf

    if (onlyCheck) {
      // console.log('only')
      return couldMove
    }

    if (couldMove) {
      attemptToMove(newX, newY, direction)
      if (!isOtherHalf && isLateralMove) {
        if (atPos.ch === '[') {
          attemptToMove(x + 1, y, direction, true)
        }
        if (atPos.ch === ']') {
          attemptToMove(x - 1, y, direction, true)
        }
      }

      atPos.x = newX
      atPos.y = newY
    }

    return couldMoveNext
  }

  let movec = 0
  for (const move of moves) {
    const direction = '>^<v'.indexOf(move)
    attemptToMove(robot.x, robot.y, direction)

    // MOVE 194 ballar ur!
    if (movec < 200) {
      console.log(movec, move)
      print()
    }
    movec++
  }

  return grid.reduce((acc, { x, y, ch }) => {
    if (ch !== '[') return acc
    else {
      return acc + y * 100 + x
    }
  }, 0)
}
