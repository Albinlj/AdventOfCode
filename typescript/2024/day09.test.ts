import { expect, test } from 'bun:test'
import chalk from 'chalk'

const input = await Bun.file('day09.input.txt').text()

const example = `2333133121414131402`

test('day09', () => {
  expect(part1(example)).toBe(1928)
  expect(part1(input)).toBe(6448989155953)
  expect(part2(example)).toBe(2858)
  expect(part2('9953877292941')).toBe(5768)
  expect(part2(input)).toBe(6476642796832)
})

const part1 = (input: string) => {
  const array = parseInput(input).flat()

  let checkSum = 0
  let i = 0
  while (i < array.length) {
    let num = array[i]
    while (num === undefined) {
      num = array.pop()
    }
    checkSum += num * i
    i++
  }

  return checkSum
}

const part2 = (input: string) => {
  const array = parseInput(input)

  let highestFileId =
    array
      .flat()
      .reduce((acc, curr) => (curr ? Math.max(acc ?? 0, curr) : acc), 0) ?? 0

  while (highestFileId >= 0) {
    const indexOfFile = array.findIndex((inner) => inner[0] === highestFileId)
    const fileSize = array[indexOfFile].length

    const indexOfEmpty = array.findIndex(
      (inner) => inner[0] === undefined && inner.length >= fileSize
    )

    if (indexOfEmpty < indexOfFile && indexOfEmpty !== -1) {
      const emptySize = array[indexOfEmpty].length
      const remainingEmptySize = Math.max(emptySize - fileSize, 0)
      const newEmpty = Array.from(
        { length: remainingEmptySize },
        () => undefined
      )

      const file = array.splice(
        indexOfFile,
        1,
        Array.from({ length: fileSize }, () => undefined)
      )!

      array.splice(indexOfEmpty, 1, file.flat(), newEmpty)
    }

    highestFileId--
  }

  return array.flat().reduce((acc, curr, i) => {
    return (acc ?? 0) + (curr ?? 0) * i
  }, 0)
}

function parseInput(input: string) {
  return input.split('').map((num, i) => {
    return Array.from({ length: parseInt(num) }, () =>
      i % 2 === 0 ? Math.floor(i / 2) : undefined
    )
  })
}
