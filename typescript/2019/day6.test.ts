import { expect, test } from 'bun:test'

const part1 = (input: string) => {
  const map = new Map()

  const lines = input.split('\n')

  for (const line of lines) {
    const [around, orbits] =
      line.split(')')

    const existing = map.get(around)

    if (existing) {
      existing.push(orbits)
    } else {
      map.set(around, [orbits])
    }
  }

  let orbits = 0

  const recurse = (
    around: string,
    depth: number
  ) => {
    orbits += depth

    console.log(depth)

    const orbitors = map.get(around)

    if (!orbitors) return
    for (const orbitor of orbitors) {
      recurse(orbitor, depth + 1)
    }
  }
  recurse('COM', 0)

  return orbits
}

const part2 = (input: string) => {
  const map = new Map<
    string,
    string[]
  >()

  const lines = input.split('\n')

  for (const line of lines) {
    const [around, orbits] =
      line.split(')')

    const existing = map.get(around)
    if (existing) {
      existing.push(orbits)
    } else {
      map.set(around, [orbits])
    }

    const existing2 = map.get(orbits)
    if (existing2) {
      existing2.push(around)
    } else {
      map.set(orbits, [around])
    }
  }

  const arr = Array.from(map.entries())
  const start = arr.find(([_, value]) =>
    value.includes('YOU')
  )?.[0]
  const end = arr.find(([_, value]) =>
    value.includes('SAN')
  )?.[0]

  const recurse = (
    from: string,
    around: string,
    depth: number
  ) => {
    if (around === end) {
      return depth
    }

    console.log(depth)

    const orbitors = map.get(around)

    if (!orbitors) return
    for (const orbitor of orbitors) {
      if (orbitor === from) continue
      const d = recurse(
        around,
        orbitor,
        depth + 1
      )
      if (d) return d
    }
  }

  return recurse('YOU', start!, 0)
}

const input = await Bun.file(
  'day6.input.txt'
).text()

const example = await Bun.file(
  'day6.example.txt'
).text()

const example2 = await Bun.file(
  'day6.example2.txt'
).text()

test('part2', () => {
  const a = part2(example2)
  expect(a).toBe(4)

  const b = part2(input)
  expect(b).toBe(457)
})
