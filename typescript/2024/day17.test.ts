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

const example2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

test('day17', () => {
  expect(part1(example)).toEqual('4,6,3,5,6,3,5,2,1,0')
  expect(part1(input)).toEqual('6,5,7,4,5,7,3,1,0')

  expect(part2(example2)).toEqual(117440)
  expect(part2(input)).toEqual(105875099912602)
})
const parse = (input: string) => {
  const [_registers, _program] = input.trim().split('\n\n')

  const [a, b, c] = _registers
    .split('\n')
    .map((line) => BigInt(line.split(': ')[1]))

  const program = _program
    .trim()
    .split(': ')[1]
    .split(',')
    .map((a) => BigInt(a.trim()))

  return { a, b, c, program }
}

const part1 = (input: string) => {
  const { a, b, c, program } = parse(input)
  const { out } = runProgram(a, b, c, program)
  return out.join(',')
}

const part2 = (input: string) => {
  const { b, c, program } = parse(input)

  let i = Math.pow(8, program.length - 1)
  lol: while (true) {
    const { out } = runProgram(BigInt(i), b, c, program)

    for (let j = program.length - 1; j >= 0; j--) {
      if (program[j] !== out[j]) {
        let more = j > 1 ? Math.pow(8, j - 1) : 1
        i += more
        i = i - (i % more)
        continue lol
      }
    }

    return i
  }
}

const runProgram = (_a: bigint, _b: bigint, _c: bigint, program: bigint[]) => {
  let a = _a
  let b = _b
  let c = _c
  let out = []

  const comboOperand = (operand: bigint): bigint => {
    switch (operand) {
      case 4n:
        return a
      case 5n:
        return b
      case 6n:
        return c
      default:
        return operand
    }
  }

  const divOp = (operand: bigint) => {
    const denominator = 2n ** comboOperand(operand)
    return a / denominator
  }

  let pointer = 0

  while (pointer < program.length) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]

    switch (opcode) {
      case 0n: //adv
        a = divOp(operand)
        break
      case 1n: //bxl
        b = b ^ operand
        break
      case 2n: //bst
        b = comboOperand(operand) % 8n
        break
      case 3n: //jnz
        if (a === 0n) break
        pointer = Number(operand)
        continue
      case 4n: //bxc
        b = b ^ c
        break
      case 5n: //out
        out.push(comboOperand(operand) % 8n)
        break
      case 6n: //bdv
        b = divOp(operand)
        break
      case 7n: //cdv
        c = divOp(operand)
        break
      default:
        break
    }

    pointer += 2
  }

  return { a, b, c, out }
}
