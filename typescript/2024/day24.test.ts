import { expect, test } from 'bun:test'

const input = await Bun.file('day24.input.txt').text()

const example = `
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02
`

const example3 = `
x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00`

test('day20', () => {
  // expect(part1(example)).toEqual(4)
  // expect(part1(input)).toEqual(57344080719736)

  expect(part2(example3)).toEqual(4)
})

const part1 = (input: string) => {
  const [_wires, _gates] = input.trim().split('\n\n')

  const wires = new Map(
    _wires
      .trim()
      .split('\n')
      .map((line) => {
        const [wire, _value] = line.split(': ')
        const value = parseInt(_value)
        return [wire, value]
      })
  )

  const gates = _gates.split('\n').map((line) => {
    const [gate, wire] = line.split(' -> ')
    const [a, op, b] = gate.split(' ')

    return { a, b, op, wire }
  })

  const getVal = (wire: string) => {
    let val = wires.get(wire)
    if (val !== undefined) {
      return val
    }

    const gate = gates.find((g) => g.wire === wire)
    const op = ops[gate.op]
    val = op(getVal(gate.a), getVal(gate.b))
    wires.set(val)
    return val
  }

  const ends = parseInt(
    gates
      .filter((gate) => gate.wire.startsWith('z'))
      .sort((a, b) => b.wire.localeCompare(a.wire))
      .map((gate) => getVal(gate.wire))
      .join(''),
    2
  )

  return ends
}

const part2 = (input: string) => {
  const [_wires, _gates] = input.trim().split('\n\n')

  const wires = new Map(
    _wires
      .trim()
      .split('\n')
      .map((line) => {
        const [wire, _value] = line.split(': ')
        const value = parseInt(_value)
        return [wire, value]
      })
  )

  const gates = _gates.split('\n').map((line) => {
    const [gate, wire] = line.split(' -> ')
    const [a, op, b] = gate.split(' ')

    return { a, b, op, wire }
  })

  console.log(wires)

  const a = parseInt(
    wires
      .entries()
      .toArray()
      .filter(([a, b]) => {
        return a.startsWith('x')
      })
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([a, b]) => b)
      .join(''),
    2
  )

  const b = parseInt(
    wires
      .entries()
      .toArray()
      .filter(([a, b]) => {
        return a.startsWith('y')
      })
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([a, b]) => b)
      .join(''),
    2
  )

  return b

  const getVal = (wire: string) => {
    let val = wires.get(wire)
    if (val !== undefined) {
      return val
    }

    const gate = gates.find((g) => g.wire === wire)
    const op = ops[gate.op]
    val = op(getVal(gate.a), getVal(gate.b))
    wires.set(val)
    return val
  }

  const ends = parseInt(
    gates
      .filter((gate) => gate.wire.startsWith('z'))
      .sort((a, b) => b.wire.localeCompare(a.wire))
      .map((gate) => getVal(gate.wire))
      .join(''),
    2
  )

  return ends
}

const ops = {
  XOR: (a: number, b: number) => a ^ b,
  OR: (a: number, b: number) => a | b,
  AND: (a: number, b: number) => a & b,
}
