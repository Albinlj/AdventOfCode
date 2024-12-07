import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day07.input.txt').text()

const example = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`

test('day07', () => {
  // expect(part1(example)).toBe(3749)
  expect(part1(input)).toBe(932137732557)
})

const part1 = (input: string) => {
  const equations = input
    .trim()
    .split('\n')
    .map((line) => {
      const [_result, _nums] = line.split(': ')

      const result = parseInt(_result)
      const nums = _nums
        .split(' ')
        .map((num) => parseInt(num))

      return { result, nums }
    })

  let working: number[] = []

  const recurse = (
    current: number,
    nums: number[],
    goal: number
  ) => {
    if (nums.length === 0) {
      if (current === goal) {
        if (working.at(-1) !== current)
          working.push(current)
      }
      return
    }

    {
      const next = nums[0]
      const remaining = nums.slice(1)
      recurse(current + next, remaining, goal)
      recurse(current * next, remaining, goal)
      recurse(
        parseInt('' + current + next),
        remaining,
        goal
      )
    }
  }

  for (const { nums, result } of equations) {
    recurse(nums[0], nums.slice(1), result)
  }

  return working.reduce((a, b) => a + b)
  // return working
}
