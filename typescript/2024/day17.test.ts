import { expect, test } from 'bun:test'

const input = `
Register A: 59590048
Register B: 0
Register C: 0

Program: 2,4,1,5,7,5,0,3,1,6,4,3,5,5,3,0
`

const example = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`

test('day17', () => {
  // expect(runProgram(0, 0, 9, [2, 6])).toMatchObject({ b: 1 })
  // expect(runProgram(10, 0, 0, [5, 0, 5, 1, 5, 4])).toMatchObject({
  //   out: [0, 1, 2],
  // })
  // expect(runProgram(2024, 0, 0, [0, 1, 5, 4, 3, 0])).toMatchObject({
  //   out: [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0],
  //   a: 0,
  // })
  // expect(runProgram(0, 29, 0, [1, 7])).toMatchObject({
  //   b: 26,
  // })
  // expect(runProgram(0, 2024, 43690, [4, 0])).toMatchObject({
  //   b: 44354,
  // })

  // expect(part1(example)).toEqual('4635635210')
  expect(part1(input)).toEqual('6,5,7,4,5,7,3,1,0')
  //657457310 no
})

const part1 = (input: string) => {
  const [_registers, _program] = input.trim().split('\n\n')

  const [a, b, c] = _registers
    .split('\n')
    .map((line) => parseInt(line.split(': ')[1]))

  const program = _program
    .trim()
    .split(': ')[1]
    .split(',')
    .map((a) => parseInt(a.trim()))

  const { out } = runProgram(a, b, c, program)

  return out.join(',')
}

const runProgram = (_a: number, _b: number, _c: number, program: number[]) => {
  let a = _a
  let b = _b
  let c = _c
  let out = []

  const combo = (operand: number): number => {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand
      case 4:
        return a
      case 5:
        return b
      case 6:
        return c
    }
    throw 'NO'
  }

  const div = (operand: number) => {
    const denominator = Math.pow(2, combo(operand))
    return Math.floor(a / denominator)
  }

  let pointer = 0

  while (pointer < program.length) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]

    switch (opcode) {
      case 0: //adv
        a = div(operand)
        break
      case 1: //bxl
        b = b ^ operand
        break
      case 2: //bst
        b = combo(operand) % 8
        break
      case 3: //jnz
        if (a === 0) break
        pointer = operand
        continue
      case 4: //bxc
        b = b ^ c
        break
      case 5: //out
        out.push(combo(operand) % 8)
        break
      case 6: //bdv
        b = div(operand)
        break
      case 7: //cdv
        c = div(operand)
        break
      default:
        break
    }

    pointer += 2
  }

  return { a, b, c, out }
}
