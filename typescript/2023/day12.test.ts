import { expect, test } from 'bun:test'
import {
  Grid,
  gridFromString,
} from './grid'
import {
  transpose,
  trim,
  uniq,
  xprod,
} from 'ramda'

const testInput = ` ???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`

const input = await Bun.file(
  'day12.input.txt'
).text()

test('part1', () => {
  expect(
    calcArrangementCount(
      '???.### 1,1,3'
    )
  ).toBe(1)
  expect(
    calcArrangementCount(
      '.??..??...?##. 1,1,3'
    )
  ).toBe(4)
  expect(
    calcArrangementCount(
      '?#?#?#?#?#?#?#? 1,3,1,6'
    )
  ).toBe(1)
  expect(
    calcArrangementCount(
      '????.#...#... 4,1,1'
    )
  ).toBe(1)
  expect(
    calcArrangementCount(
      '????.######..#####. 1,6,5'
    )
  ).toBe(4)
  expect(
    calcArrangementCount(
      '?###???????? 3,2,1'
    )
  ).toBe(10)
  expect(part1(testInput)).toBe(21)
  expect(part1(input)).toBe(1337)
})

const part1 = (input: string) =>
  input
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(trim)
    .map(calcArrangementCount)
    .reduce((a, b) => a + b)

const calcArrangementCount = (
  input: string
) => {
  const [_springs, _groupSizes] = input
    .trim()
    .split(' ')
    .map((a) => a.trim())

  const groupSizes = _groupSizes
    .split(',')
    .map((a) => parseInt(a))

  const uniqSizes = uniq(groupSizes)

  const possiblePositions =
    Object.fromEntries(
      uniqSizes.map((size) => {
        let possiblePositions = []
        pos: for (
          let i = 0;
          i + size <= _springs.length;
          i++
        ) {
          if (
            _springs[i - 1] === '#' || // Before is broken
            _springs[i + size] === '#' // after is broken
          ) {
            continue pos
          }

          for (
            let j = i;
            j < i + size;
            j++
          ) {
            if (_springs[j] === '.') {
              continue pos
            }
          }

          possiblePositions.push(i)
        }
        return [size, possiblePositions]
      })
    )

  console.log(
    _springs,
    _groupSizes,
    possiblePositions
  )

  let count = 0

  const recurse = (
    groupIndex: number,
    startFrom: number
  ) => {
    const groupLength =
      groupSizes[groupIndex]

    if (groupLength === undefined) {
      count++
      return
    }

    const thisGroupsPosibilities =
      possiblePositions[
        groupLength
      ].filter(
        (pos) => pos >= startFrom
      )

    console.log(
      groupIndex,
      groupLength,
      thisGroupsPosibilities
    )

    for (const pos of thisGroupsPosibilities) {
      recurse(
        groupIndex + 1,
        pos + groupLength + 1
      )
    }
  }

  recurse(0, 0)

  console.log(count)
  return count
}
