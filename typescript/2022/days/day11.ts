import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(11)), 10605);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(11)), 101436);
});

Deno.test("part2", () => {
  assertEquals(part2(readInput(11)), 19754471646);
});

const part1 = (input: string) => {
  const monkeys = input
    .split("\n\n")
    .map(parseMonkey);

  return doo(monkeys, 20, (num) => Math.floor(num / 3));
};

const part2 = (input: string) => {
  const monkeys = input
    .split("\n\n")
    .map(parseMonkey);

  const commonMultiplier = monkeys
    .map((m) => m.divisionTest)
    .reduce((a, b) => a * b, 1);

  return doo(monkeys, 10000, (num) => (num % commonMultiplier));
};

const doo = (
  monkeys: Monkey[],
  rounds: number,
  postInspection: (num: number) => number,
): number => {
  for (let round = 0; round < rounds; round++) {
    for (const monkey of monkeys) {
      const { items, operation, divisionTest, trueTarget, falseTarget } =
        monkey;
      while (items.length != 0) {
        const worry = postInspection(operation(items.shift()!));
        monkeys[worry % divisionTest === 0 ? trueTarget : falseTarget].items
          .push(worry);
        monkey.inspections++;
      }
    }
  }
  const [a, b] = (monkeys
    .map((m) => m.inspections)
    .sort((a, b) => a - b)
    .slice(-2));
  return a * b;
};

type Monkey = {
  items: number[];
  operation: (num: number) => number;
  divisionTest: number;
  trueTarget: number;
  falseTarget: number;
  inspections: number;
};

function parseMonkey(lines: string): Monkey {
  const [, items, op, test, tr, fa] = lines.split("\n");

  return {
    items: items.match(/\d+/g)!.map((x) => parseInt(x)),
    operation: op.endsWith("old")
      ? (num: number) => num * num
      : op.includes("*")
      ? (num: number) => num * lastNum(op)
      : (num: number) => num + lastNum(op),
    divisionTest: lastNum(test),
    trueTarget: lastNum(tr),
    falseTarget: lastNum(fa),
    inspections: 0,
  };
}

const lastNum = (op: string) => parseInt(op.slice(op.lastIndexOf(" ")));
