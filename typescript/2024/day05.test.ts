import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day05.input.txt').text()

const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

test('day05', () => {
  // expect(part1(example)).toBe(143)
  // expect(part1(input)).toBe(7024)
  expect(part2(example)).toBe(123)
})

const part1 = (input: string) => {
  const [_rules, _updates] = input.trim().split('\n\n')

  const rules = _rules
    .split('\n')
    .map((line) =>
      line.split('|').map((num) => parseInt(num))
    )

  const updates = _updates
    .split('\n')
    .map((line) =>
      line.split(',').map((num) => parseInt(num))
    )

  const correct = updates.filter((update) =>
    update.every((page, i, update) => {
      for (const [before, after] of rules) {
        if (page === before) {
          const other = update.indexOf(after)
          if (other !== -1 && other < i) {
            return false
          }
        }
        if (page === after) {
          const other = update.indexOf(before)
          if (other !== -1 && other > i) {
            return false
          }
        }
      }
      return true
    })
  )

  return correct
    .map(
      (update) => update.at(Math.floor(update.length / 2))!
    )
    .reduce((a, b) => a + b)
}

const part2 = (input: string) => {
  const [_rules, _updates] = input.trim().split('\n\n')

  const rules = _rules
    .split('\n')
    .map((line) =>
      line.split('|').map((num) => parseInt(num))
    )

  const updates = _updates
    .split('\n')
    .map((line) =>
      line.split(',').map((num) => parseInt(num))
    )

  const correct = updates.filter((update) =>
    update.every((page, i, update) => {
      for (const [before, after] of rules) {
        if (page === before) {
          const other = update.indexOf(after)
          if (other !== -1 && other < i) {
            return false
          }
        }
        if (page === after) {
          const other = update.indexOf(before)
          if (other !== -1 && other > i) {
            return false
          }
        }
      }
      return true
    })
  )

  return correct
    .map(
      (update) => update.at(Math.floor(update.length / 2))!
    )
    .reduce((a, b) => a + b)
}
