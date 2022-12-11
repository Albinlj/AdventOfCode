import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import { sum } from "https://deno.land/x/fae@v1.1.1/mod.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(11)), 10605);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(11)), 101436);
});
// Deno.test("parseMonkey", () => {
//   assertEquals(part1(readExample("

//   ")), 10605);
// });

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
    .map<Monkey>(parseMonkey);

  // console.log(monkeys.map((m) => m.items));
  // console.log(monkeys.map((m) => m.trueThrow));
  // console.log(monkeys.map((m) => m.falseThrow));
  // console.log(monkeys.map((m) => m.divby));

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
    // console.log(monkeys.map((m) => m.items));
  }
  console.log(monkeys.map((m) => m.items));
  const [a, b] =
    (monkeys.map((m) => m.inspections).sort((a, b) => a - b).slice(-2));
  return a * b;
}

const lastNum = (op: string) => parseInt(op.slice(op.lastIndexOf(" ")));

function parseMonkey(lines: string) {
  const [, items, op, test, tr, fa] = lines.split("\n");

  const opnum = lastNum(op);

  return {
    items: items.match(/\d+/g)!.map((x) => parseInt(x)),
    operation: op.endsWith("old")
      ? (num: number) => num * num
      : op.includes("*")
      ? (num: number) => num * opnum
      : (num: number) => num + opnum,
    divby: lastNum(test),
    trueThrow: lastNum(tr),
    falseThrow: lastNum(fa),
    inspections: 0,
  };
}
