import { expect, test } from 'bun:test'
import { countBy } from 'lodash'
import { init, insert } from 'ramda'

const input = await Bun.file('day22.input.txt').text()

const example = `
1
10
100
2024
`

const example2 = `
1
2
3
2024
`

test('day20', () => {
  // expect(getNext(123n)).toEqual(15887950n)
  // expect(part1(example)).toEqual(37327623n)
  // expect(part1(input)).toEqual(19822877190n)

  expect(part2(example2)).toEqual(23)
  expect(part2(input)).toEqual(2277)
})

const part1 = (input: string) => {
  return input
    .trim()
    .split('\n')
    .map((a) => BigInt(a))
    .map((num) => {
      for (let i = 0; i < 2000; i++) {
        num = getNext(num)
      }
      return num
    })
    .reduce((a, b) => a + b)
}

const part2 = (input: string) => {
  const buyers = input
    .trim()
    .split('\n')
    .map((a) => BigInt(a))

  const comboPoints: Record<string, number> = {}

  for (const buyer of buyers) {
    let num = buyer
    const combination = []
    let prevCost: number | undefined = undefined

    const seen = new Set()

    for (let i = 0; i <= 2000; i++) {
      const cost = parseInt(num.toString().at(-1)!)
      if (prevCost !== undefined) {
        const diff = cost - prevCost
        combination.push(diff)

        if (combination.length === 5) combination.shift()
        if (combination.length === 4) {
          const hash = combination.join(',')
          if (!seen.has(hash)) {
            comboPoints[hash] = (comboPoints[hash] ?? 0) + cost
            seen.add(hash)
          }
        }
      }
      prevCost = cost
      num = getNext(num)
    }
  }

  const sorted = Object.entries(comboPoints).sort((a, b) => b[1] - a[1])
  return sorted.at(0)?.at(1)
}

const getNext = (s: bigint) => {
  s = mixAndPrune(s * 64n, s)
  s = mixAndPrune(s / 32n, s)
  s = mixAndPrune(s * 2048n, s)
  return s
}

const mixAndPrune = (val: bigint, secret: bigint) => {
  secret = val ^ secret
  secret = secret % 16777216n
  return secret
}
