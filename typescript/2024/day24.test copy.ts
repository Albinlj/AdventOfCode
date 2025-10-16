// import { expect, test } from 'bun:test'
// import { xor } from 'lodash'

// Object.defineProperty(Object.prototype, 'log', {
//   value: function () {
//     console.log(this)
//     return this
//   },
//   enumerable: false,
// })

// const input = await Bun.file('day24.input.txt').text()

// const example = `
// x00: 1
// x01: 1
// x02: 1
// y00: 0
// y01: 1
// y02: 0

// x00 AND y00 -> z00
// x01 XOR y01 -> z01
// x02 OR y02 -> z02
// `

// const example3 = `
// x00: 0
// x01: 1
// x02: 0
// x03: 1
// x04: 0
// x05: 1
// y00: 0
// y01: 0
// y02: 1
// y03: 1
// y04: 0
// y05: 1

// x00 AND y00 -> z05
// x01 AND y01 -> z02
// x02 AND y02 -> z01
// x03 AND y03 -> z03
// x04 AND y04 -> z04
// x05 AND y05 -> z00`

// test('day20', () => {
//   expect(part1(example)).toEqual(4)
//   expect(part1(input)).toEqual(57344080719736)
//   expect(part2(input)).toEqual(2)
// })

// const part1 = (input: string) => {
//   const [_wires, _gates] = input.trim().split('\n\n')
//   const wires = new Map(
//     _wires
//       .trim()
//       .split('\n')
//       .map((line) => {
//         const [wire, _value] = line.split(': ')
//         const value = parseInt(_value)
//         return [wire, value]
//       })
//   )

//   const gates = _gates.split('\n').map((line) => {
//     const [gate, wire] = line.split(' -> ')
//     const [a, op, b] = gate.split(' ')

//     return { a, b, op, wire }
//   })

//   return doit(wires, gates)
// }

// const part2 = (input: string) => {
//   const [_wires, _gates] = input.trim().split('\n\n')

//   const wires = new Map(
//     _wires
//       .trim()
//       .split('\n')
//       .map((line) => {
//         const [wire, _value] = line.split(': ')
//         const value = parseInt(_value)
//         return [wire, value]
//       })
//   )

//   const allGates = _gates.split('\n').map((line) => {
//     const [gate, wire] = line.split(' -> ')
//     const [a, op, b] = gate.split(' ')

//     return { a, b, op, wire }
//   })

//   const x = parseInt(
//     wires
//       .entries()
//       .toArray()
//       .filter(([a, b]) => {
//         return a.startsWith('x')
//       })
//       .toSorted(([a], [b]) => b.localeCompare(a))
//       .map(([a, b]) => b)
//       .join('')
//       .log(),
//     2
//   )

//   const y = parseInt(
//     wires
//       .entries()
//       .toArray()
//       .filter(([a, b]) => {
//         return a.startsWith('y')
//       })
//       .toSorted(([a], [b]) => b.localeCompare(a))
//       .map(([a, b]) => {
//         return b
//       })
//       .join(''),
//     2
//   )

//   const gates = structuredClone(allGates)

//   const allXors = gates.filter((g) => g.op === 'XOR')
//   const allAnds = gates.filter((g) => g.op === 'AND')

//   let halfAdders1 = []

//   // find first half adder gates.
//   // These are all the correct gates,
//   // since we can't change the inputs.
//   // So we remove the gates from the list.
//   for (let i = 0; i <= 44; i++) {
//     const iStr = 'x' + i.toString().padStart(2, '0')
//     const xorindex = gates.findIndex(
//       (g) => g.op === 'XOR' && (g.a == iStr || g.b == iStr)
//     )!
//     const xor = gates.splice(xorindex, 1).at(0)!
//     const andindex = gates.findIndex(
//       (g) => g.op === 'AND' && (g.a == iStr || g.b == iStr)
//     )!
//     const and = gates.splice(andindex, 1).at(0)!
//     halfAdders1.push({
//       number: i,
//       out: xor.wire,
//       carry: and.wire,
//     })
//   }

//   // Make Full adders with the initial half adders
//   let fullAdders = halfAdders1.map((ha) => ({
//     number: ha.number,
//     ha1: ha,
//     ha2: undefined as typeof ha | undefined,
//   }))

//   // Sort out the rest of the gates
//   const ors = gates.filter((g) => g.op === 'OR')
//   const restXors = gates.filter((g) => g.op === 'XOR')
//   const restAnds = gates.filter((g) => g.op === 'AND')
//   // console.log(ors.length, restXors.length, restAnds.length)

//   // Create the rest of the half adders.
//   // They are all complete with inputs, but might still have incorrect outputs.
//   const halfAdders2 = restXors.map((xor) => {
//     const pairAnd = restAnds.find(
//       (and) =>
//         [xor.a, xor.b].sort().join(',') == [and.a, and.b].sort().join(',')
//     )
//     if (pairAnd === undefined) throw 'no and'
//     if (pairAnd.a === pairAnd.b) throw 'lol wat'
//     return {
//       a: xor.a,
//       b: xor.b,
//       out: xor.wire,
//       carry: pairAnd.wire,
//     }
//   })

//   // Figure out with of the second halfadders correspond to which full adder.
//   // And if there are any that has no corresponding Half adders (There is one!)
//   let faWithoutHa2
//   for (const fa of fullAdders) {
//     const potentialHa2s = halfAdders2.filter(
//       (ha) => ha.a === fa.ha1.out || ha.b === fa.ha1.out
//     )
//     if (potentialHa2s.length > 1) throw 'aaalsds'

//     const ha2 = potentialHa2s.at(0)!
//     if (!ha2) {
//       if (faWithoutHa2) {
//         console.log(faWithoutHa2, fa)
//         throw 'WHAT MROE WAT'
//       }
//       if (fa.ha2)
//       faWithoutHa2 = fa
//       continue
//     }
//     ha2.number = fa.ha1.number
//     fa.ha2 = ha2
//   }

//   // See which halfAdder is missing a fulladder.
//   const alone = halfAdders2.find(
//     (ha2) => !fullAdders.some((fa) => fa.ha2 === ha2)
//   )
//   console.log('noha2', faWithoutHa2)
//   console.log('alone', alone)

//   // That halfAdder must be the one that is missing in the fulladder.
//   faWithoutHa2.ha2 = alone!
//   // The out/sum of the fulladders first halfadder must be incorrect
//   // And it should be one of of the lonely ones inputs
//   let faultyWires = [faWithoutHa2?.ha1.out, alone?.a, alone?.b]
//   console.log(faultyWires)

//   const incorrectOutputXors = []
//   for (const xor of restXors) {
//     if (!xor.wire.startsWith('z')) {
//       incorrectOutputXors.push(xor)
//     }
//   }
//   console.log('incorrectOutPutXors', incorrectOutputXors)
//   console.log(
//     'wires',
//     incorrectOutputXors.map((iox) => iox.wire)
//   )
//   for (const inc of incorrectOutputXors) {
//     faultyWires.push(inc.wire)
//   }
//   console.log(faultyWires)

//   const incorrectHalfAdderCarries = []
//   for (const half of halfAdders1) {
//     const or = ors.filter((or) => or.a == half.carry || or.b == half.carry)
//     if (or.length !== 1) {
//       incorrectHalfAdderCarries.push(half)
//     }
//   }
//   console.log('incorrecthalfaddercarries', incorrectHalfAdderCarries)
//   for (const element of incorrectHalfAdderCarries) {
//     faultyWires.push(element.carry)
//   }
//   faultyWires.sort()
//   console.log(faultyWires)

//   const incorrectOrInputs = []
//   for (const or of ors) {
//     const andInputs = gates.filter((g) => g.wire === or.a || g.wire === or.b)
//     for (const andinput of andInputs) {
//       if (andinput.op !== 'AND') {
//         incorrectOrInputs.push(andinput.wire)
//       }
//     }
//   }
//   for (const element of incorrectOrInputs) {
//     faultyWires.push(element)
//   }
//   faultyWires.sort()
//   console.log(faultyWires)

//   const incorrectOutOutputs = []
//   for (const or of ors) {
//     const inp = halfAdders2.find((ha2) => ha2.a == or.wire || ha2.b == or.wire)
//     if (!inp) {
//       console.log('LOOOL OR', or)
//       faultyWires.push(or.wire)
//     }
//   }

//   const lol = allGates.filter(
//     (g) => g.op != 'XOR' && g.wire.startsWith('z') && g.wire !== 'z45'
//   )
//   for (const element of lol) {
//     faultyWires.push(element.wire)
//   }
//   console.log('LJQIWEJOQWEW', lol)

//   const set = [...new Set(faultyWires)].filter((w) => w != 'z45').sort()
//   console.log(set, set.length)

//   // Simulate the thing from xy to z

//   for (let i = 0; i < 45; i++) {
//     const haha = halfAdders1[i]
//     const hahb = halfAdders2[i]

//     console.log(haha, hahb)
//   }

//   for (let i = 0; i <= 44; i++) {
//     const iStr = 'x' + i.toString().padStart(2, '0')
//     const xorindex = gates.findIndex(
//       (g) => g.op === 'XOR' && (g.a == iStr || g.b == iStr)
//     )!
//     const xor = gates.splice(xorindex, 1).at(0)!
//     const andindex = gates.findIndex(
//       (g) => g.op === 'AND' && (g.a == iStr || g.b == iStr)
//     )!
//     const and = gates.splice(andindex, 1).at(0)!
//     halfAdders1.push({
//       number: i,
//       out: xor.wire,
//       carry: and.wire,
//     })
//   }

//   const combis = getAll4PairCombinations(set)
//   console.log(set.length, combis.length)

//   let tries = 0
//   for (const combi of combis) {
//     tries++
//     if (tries % 1000 == 0) {
//       console.log(tries)
//     }
//     const nugates = structuredClone(allGates)
//     const nuwires = structuredClone(wires)

//     for (const [a, b] of combi) {
//       const aa = nugates.find((ng) => ng.wire == a)
//       const bb = nugates.find((ng) => ng.wire == b)
//       if (!aa || !bb) throw 'LOLO'
//       // aa.wire = b
//       // bb.wire = a
//     }
//     try {
//       const z = doit(nuwires, nugates)
//       // console.log(x + y - z)
//       if (x + y === z) {
//         return combis
//       }
//     } catch (e) {
//       if (e == 'no') {
//       }
//     }
//   }
// }

// const ops = {
//   XOR: (a: number, b: number) => a ^ b,
//   OR: (a: number, b: number) => a | b,
//   AND: (a: number, b: number) => a & b,
// }

// function doit(
//   wires: Map<string, number>,
//   gates: { a: string; b: string; op: string; wire: string }[]
// ) {
//   const getVal = (wire: string, depth = 0) => {
//     if (depth > 100) {
//       // console.log('NOO')
//       throw 'no'
//     }

//     let val = wires.get(wire)
//     if (val !== undefined) {
//       return val
//     }

//     const gate = gates.find((g) => g.wire === wire)!
//     // console.log(gate)
//     const op = ops[gate.op]
//     val = op(getVal(gate.a, depth + 1), getVal(gate.b, depth + 1))
//     wires.set(val)
//     return val
//   }

//   const ends = parseInt(
//     gates
//       .filter((gate) => gate.wire.startsWith('z'))
//       .sort((a, b) => b.wire.localeCompare(a.wire))
//       .map((gate) => getVal(gate.wire))
//       .join(''),
//     2
//   )

//   return ends
// }

// function getAll4PairCombinations(arr) {
//   const results = []

//   function getPairCombinations(input, currentPairs = []) {
//     if (currentPairs.length === 4) {
//       results.push(currentPairs)
//       return
//     }

//     for (let i = 0; i < input.length; i++) {
//       for (let j = i + 1; j < input.length; j++) {
//         const pair = [input[i], input[j]]
//         const remaining = input.filter((_, idx) => idx !== i && idx !== j)
//         getPairCombinations(remaining, [...currentPairs, pair])
//       }
//     }
//   }

//   getPairCombinations(arr)
//   return results
// }
