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

  const incorrect = updates
    .filter((update) =>
      update.some((page, i, update) => {
        for (const [before, after] of rules) {
          if (page === before) {
            const other = update.indexOf(after)
            if (other !== -1 && other < i) {
              return true
            }
          }
          if (page === after) {
            const other = update.indexOf(before)
            if (other !== -1 && other > i) {
              return true
            }
          }
        }
        return false
      })
    )
    .slice(0, 1)

  const doStuff = (
    current: number[],
    rest: number[]
  ): number[] | false => {
    if (rest.length === 0) {
      console.log(chalk.green('WOOOOOOOO'), current)
      return current
    }

    const next = rest.at(0)
    if (next === undefined) {
      throw 'LOL'
    }

    let firstIndex = 0
    let lastIndex = current.length

    for (const [a, b] of rules) {
      if (a === next) {
        console.log('rule', a, b)
        firstIndex = Math.max(
          firstIndex,
          current.lastIndexOf(b)
        )
      }
      if (b === next) {
        console.log('rule', a, b)
        const bFound = current.lastIndexOf(b)
        if (bFound > -1) {
          lastIndex = Math.min(lastIndex, bFound)
        }
      }
    }

    if (firstIndex > lastIndex) {
      return false
    }

    console.log({ current, next, firstIndex, lastIndex })

    for (let i = lastIndex; i >= firstIndex; i--) {
      const result = doStuff(
        current.toSpliced(i, 0, next),
        rest.slice(1)
      )

      if (result) {
        return result
      }
    }
    return false
  }

  const corrected = incorrect.map((update) => {
    return doStuff([], update)
  })

  return corrected
    .map(
      (update) => update.at(Math.floor(update.length / 2))!
    )
    .reduce((a, b) => a + b)
}
