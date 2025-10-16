import { expect, test } from 'bun:test'

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
  expect(part1(example)).toBe(143)
  expect(part1(input)).toBe(7024)

  expect(part2(example)).toBe(123)
  expect(part2(input)).toBe(4151)
})

const part1 = (input: string) => {
  const { updates, rules } = parse(input)
  const correct = updates.filter((update) => isCorrect(update, rules))

  return calculateSumOfMiddlePages(correct)
}

const part2 = (input: string) => {
  const { updates, rules } = parse(input)
  const incorrect = updates.filter((update) => !isCorrect(update, rules))

  const correcteds = incorrect.map((inc) => {
    let corrected = structuredClone(inc)

    do {
      lol: for (let i = 0; i < corrected.length; i++) {
        const page = corrected[i]

        for (const [before, after] of rules) {
          if (page === before) {
            const afterIndex = corrected.indexOf(after)
            if (afterIndex !== -1 && afterIndex < i) {
              corrected.splice(i + 1, 0, after)
              corrected.splice(afterIndex, 1)
              break lol
            }
          }
          if (page === after) {
            const beforeIndex = corrected.indexOf(before)
            if (beforeIndex !== -1 && beforeIndex > i) {
              corrected.splice(beforeIndex, 1)
              corrected.splice(i, 0, before)

              break lol
            }
          }
        }
      }
    } while (!isCorrect(corrected, rules))

    return corrected
  })

  return calculateSumOfMiddlePages(correcteds)
}

function calculateSumOfMiddlePages(correct: number[][]) {
  return correct
    .map((update) => update.at(Math.floor(update.length / 2))!)
    .reduce((a, b) => a + b)
}

function parse(input: string) {
  const [_rules, _updates] = input.trim().split('\n\n')

  const rules = _rules
    .split('\n')
    .map((line) => line.split('|').map((num) => parseInt(num)))

  const updates = _updates
    .split('\n')
    .map((line) => line.split(',').map((num) => parseInt(num)))

  return { updates, rules }
}

function isCorrect(update: number[], rules: number[][]) {
  return update.every((page, i, update) => {
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
}
