import { expect, test } from 'bun:test'

const input = await Bun.file('day02.input.txt').text()

const example = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`

test('day02', () => {
  expect(part1(example)).toBe(2)
  expect(part1(input)).toBe(534)
  expect(part2(example)).toBe(4)
  expect(part2(input)).toBe(577)
})

const isReportSafe = (report: number[]): boolean => {
  let wasRising = report[1] > report[0]

  for (let i = 1; i < report.length; i++) {
    const curr = report[i]
    const prev = report[i - 1]
    const isRising = report[i] > report[i - 1]

    if (isRising !== wasRising) return false

    const diff = Math.abs(curr - prev)
    if (diff === 0 || diff > 3) return false

    wasRising = isRising
  }

  return true
}

const part1 = (input: string) =>
  parseInput(input).filter(isReportSafe).length

const part2 = (input: string) => {
  const lines = parseInput(input)
    .map((report) => {
      let all = [report]

      for (let i = 0; i < report.length; i++) {
        all.push(report.toSpliced(i, 1))
      }

      return all
    })
    .filter((reports) => reports.some(isReportSafe))

  return lines.length
}

function parseInput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(' ')
        .map((a) => parseInt(a.trim()))
    )
}
