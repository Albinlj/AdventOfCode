import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { findGcd, readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(11)), 10605);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(11)), 101436);
});

Deno.test("part2", () => {
  assertEquals(part2(readInput(11)), 19754471646);
});

type Monkey = {
  items: number[];
  operation: (num: number) => number;
  divby: number;
  trueThrow: number;
  falseThrow: number;
  inspections: number;
};
function part1(input: string): number {
  const monkeys = input
    .split("\n\n")
    .map(parseMonkey);

  for (let round = 0; round < 20; round++) {
    for (const monkey of monkeys) {
      const { items, operation, divby, trueThrow, falseThrow } = monkey;
      let worry;
      while (items.length != 0) {
        const result = operation(items.shift()!);
        worry = Math.floor(result / 3);
        monkeys[worry % divby === 0 ? trueThrow : falseThrow].items.push(worry);
        monkey.inspections++;
      }
    }
  }
  const [a, b] = (monkeys
    .map((m) => m.inspections)
    .sort((a, b) => a - b)
    .slice(-2));
  return a * b;
}

function part2(input: string): number {
  const monkeys = input
    .split("\n\n")
    .map(parseMonkey);

  const gcd = monkeys.map((a) => a.divby).reduce((acc, curr) => acc * curr, 1);

  for (let round = 0; round < 10000; round++) {
    for (const monkey of monkeys) {
      const { items, operation, divby, trueThrow, falseThrow } = monkey;
      let worry;
      while (items.length != 0) {
        const result = operation(items.shift()!);
        worry = result % gcd;
        monkeys[worry % divby === 0 ? trueThrow : falseThrow].items.push(worry);
        monkey.inspections++;
      }
    }
  }
  const [a, b] = (monkeys
    .map((m) => m.inspections)
    .sort((a, b) => a - b)
    .slice(-2));
  return a * b;
}

function parseMonkey(lines: string): Monkey {
  const [, items, op, test, tr, fa] = lines.split("\n");

  return {
    items: items.match(/\d+/g)!.map((x) => parseInt(x)),
    operation: op.endsWith("old")
      ? (num: number) => num * num
      : op.includes("*")
      ? (num: number) => num * lastNum(op)
      : (num: number) => num + lastNum(op),
    divby: lastNum(test),
    trueThrow: lastNum(tr),
    falseThrow: lastNum(fa),
    inspections: 0,
  };
}

const lastNum = (op: string) => parseInt(op.slice(op.lastIndexOf(" ")));
