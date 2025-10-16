import { expect, test } from 'bun:test'
import chalk from 'chalk'
import { xor } from 'lodash'

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
  expect(part1(example)).toEqual(4)
  expect(part1(input)).toEqual(57344080719736)
  console.log('Part 2:', part2(input))
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

  return doit(wires, gates)
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

  const allGates = _gates.split('\n').map((line) => {
    const [gate, wire] = line.split(' -> ')
    const [a, op, b] = gate.split(' ')

    return { a, b, op, wire }
  })

  const x = parseInt(
    wires
      .entries()
      .toArray()
      .filter(([a, b]) => {
        return a.startsWith('x')
      })
      .toSorted(([a], [b]) => b.localeCompare(a))
      .map(([a, b]) => b)
      .join(''),
    2
  )

  const y = parseInt(
    wires
      .entries()
      .toArray()
      .filter(([a, b]) => {
        return a.startsWith('y')
      })
      .toSorted(([a], [b]) => b.localeCompare(a))
      .map(([a, b]) => {
        return b
      })
      .join(''),
    2
  )

  const gates = structuredClone(allGates)

  const allXors = gates.filter((g) => g.op === 'XOR')
  const allAnds = gates.filter((g) => g.op === 'AND')

  let halfAdders1 = []

  // find first half adder gates.
  // These are all the correct gates,
  // since we can't change the inputs.
  // So we remove the gates from the list.
  for (let i = 0; i <= 44; i++) {
    const iStr = 'x' + i.toString().padStart(2, '0')
    const xorindex = gates.findIndex(
      (g) => g.op === 'XOR' && (g.a == iStr || g.b == iStr)
    )!
    const xor = gates.splice(xorindex, 1).at(0)!
    const andindex = gates.findIndex(
      (g) => g.op === 'AND' && (g.a == iStr || g.b == iStr)
    )!
    const and = gates.splice(andindex, 1).at(0)!
    halfAdders1.push({
      a: xor.a,
      b: xor.b,
      number: i,
      out: xor.wire,
      carry: and.wire,
    })
  }

  // Make Full adders with the initial half adders
  type HalfAdder = {
    a: string
    b: string
    number?: number
    out: string
    carry: string
  }
  let fullAdders = halfAdders1.map((ha) => ({
    number: ha.number,
    ha1: ha,
    ha2: undefined as HalfAdder | undefined,
    carryIn: undefined as string | undefined,
  }))

  // Sort out the rest of the gates
  const ors = gates.filter((g) => g.op === 'OR')
  const restXors = gates.filter((g) => g.op === 'XOR')
  const restAnds = gates.filter((g) => g.op === 'AND')
  // console.log(ors.length, restXors.length, restAnds.length)

  // Create the rest of the half adders.
  // They are all complete with inputs, but might still have incorrect outputs.
  const halfAdders2 = restXors.map((xor) => {
    const pairAnd = restAnds.find(
      (and) =>
        [xor.a, xor.b].sort().join(',') == [and.a, and.b].sort().join(',')
    )
    if (pairAnd === undefined) throw 'no and'
    if (pairAnd.a === pairAnd.b) throw 'lol wat'
    return {
      a: xor.a,
      b: xor.b,
      out: xor.wire,
      carry: pairAnd.wire,
    }
  })

  // Figure out with of the second halfadders correspond to which full adder.
  // And if there are any that has no corresponding Half adders
  for (const fa of fullAdders) {
    if (fa.number === 0) continue // First is only one halfadder
    const potentialHa2s = halfAdders2.filter((ha2) => {
      const correctA = ha2.a === fa.ha1.out
      const correctB = ha2.b === fa.ha1.out
      const correctOut = ha2.out === 'z' + fa.number.toString().padStart(2, '0')

      return (correctA || correctB) && correctOut
    })
    if (potentialHa2s.length !== 1) {
      // console.log(chalk.redBright('NOOOO'), potentialHa2s)
      continue
    }

    const ha2 = potentialHa2s.at(0)!
    const correctA = ha2.a === fa.ha1.out
    const correctB = ha2.b === fa.ha1.out

    fa.carryIn = correctA ? ha2.b : ha2.a

    if (!correctA && correctB) {
      const origA = ha2.a
      const origB = ha2.b
      ha2.b = origA
      ha2.a = origB
    }

    ;(ha2 as any).number = fa.ha1.number
    fa.ha2 = ha2
    // console.log(fa)
  }

  for (const fa of fullAdders) {
    // if (fa.number === 0) continue // first halfadder
  }

  // for (const or of ors) {
  //   console.log('or', or)
  // }

  // See which halfAdders are not part of any fulladers,
  // And which fulladders are missing a halfadder.
  const alones = halfAdders2.filter(
    (ha2) => !fullAdders.some((fa) => fa.ha2 === ha2)
  )
  const fasWithoutHa2 = fullAdders.filter((fa) => !fa.ha2)
  // console.log('without', fasWithoutHa2)
  // console.log('alone', alones)

  let faultyWires = []

  // Check 1: All z-wires (except z00 and z45) must be outputs of XOR gates
  for (let i = 1; i < 45; i++) {
    const zWire = 'z' + i.toString().padStart(2, '0')
    const gate = allGates.find((g) => g.wire === zWire)
    if (gate && gate.op !== 'XOR') {
      faultyWires.push(zWire)
    }
  }

  // Check 2: XOR gates with x,y inputs should output to another XOR (except x00/y00)
  for (const gate of allGates) {
    if (gate.op === 'XOR') {
      const hasXY =
        (gate.a.startsWith('x') || gate.a.startsWith('y')) &&
        (gate.b.startsWith('x') || gate.b.startsWith('y'))
      if (hasXY && gate.wire !== 'z00') {
        // This output should be used in another XOR gate
        const usedInXor = allGates.some(
          (g) => g.op === 'XOR' && (g.a === gate.wire || g.b === gate.wire)
        )
        if (!usedInXor) {
          faultyWires.push(gate.wire)
        }
      }
    }
  }

  // Check 3: XOR gates without x,y inputs should output to z-wires
  for (const gate of allGates) {
    if (gate.op === 'XOR') {
      const hasXY =
        (gate.a.startsWith('x') || gate.a.startsWith('y')) &&
        (gate.b.startsWith('x') || gate.b.startsWith('y'))
      if (!hasXY && !gate.wire.startsWith('z')) {
        faultyWires.push(gate.wire)
      }
    }
  }

  // Check 4: AND gates (except x00 AND y00) should output to OR gates
  for (const gate of allGates) {
    if (gate.op === 'AND' && gate.a !== 'x00' && gate.b !== 'x00') {
      const usedInOr = allGates.some(
        (g) => g.op === 'OR' && (g.a === gate.wire || g.b === gate.wire)
      )
      if (!usedInOr) {
        faultyWires.push(gate.wire)
      }
    }
  }

  const set = [...new Set(faultyWires)].filter((w) => w != 'z45').sort()
  console.log('Faulty wire candidates:', set)
  console.log('Candidate count:', set.length)

  const combis = getAll4PairCombinations(set)
  console.log('Testing', combis.length, 'combinations...')

  let tries = 0
  for (const combi of combis) {
    tries++
    if (tries % 10000 == 0) {
      console.log('Tested', tries, 'combinations...')
    }
    const nugates = structuredClone(allGates)
    const nuwires = structuredClone(wires)

    for (const [a, b] of combi) {
      const aa = nugates.find((ng) => ng.wire == a)
      const bb = nugates.find((ng) => ng.wire == b)
      if (!aa || !bb) throw 'LOLO'
      aa.wire = b
      bb.wire = a
    }
    try {
      const z = doit(nuwires, nugates)
      // console.log(x + y - z)
      if (x + y === z) {
        const swappedWires = combi.flat().sort()
        return swappedWires.join(',')
      }
    } catch (e) {
      if (e == 'no') {
      }
    }
  }
}

const ops: Record<string, (a: number, b: number) => number> = {
  XOR: (a: number, b: number) => a ^ b,
  OR: (a: number, b: number) => a | b,
  AND: (a: number, b: number) => a & b,
}

function doit(
  wires: Map<string, number>,
  gates: { a: string; b: string; op: string; wire: string }[]
) {
  const getVal = (wire: string, depth = 0): number => {
    if (depth > 100) {
      // console.log('NOO')
      throw 'no'
    }

    let val = wires.get(wire)
    if (val !== undefined) {
      return val
    }

    const gate = gates.find((g) => g.wire === wire)!
    // console.log(gate)
    const op = ops[gate.op]
    val = op(getVal(gate.a, depth + 1), getVal(gate.b, depth + 1))
    wires.set(wire, val)
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

function getAll4PairCombinations(arr: string[]) {
  const results: string[][][] = []

  function getPairCombinations(input: string[], currentPairs: string[][] = []) {
    if (currentPairs.length === 4) {
      results.push(currentPairs)
      return
    }

    for (let i = 0; i < input.length; i++) {
      for (let j = i + 1; j < input.length; j++) {
        const pair = [input[i], input[j]]
        const remaining = input.filter(
          (_: string, idx: number) => idx !== i && idx !== j
        )
        getPairCombinations(remaining, [...currentPairs, pair])
      }
    }
  }

  getPairCombinations(arr)
  return results
}
