import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(21)), 152);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(21)), 75147370123646);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(21)), 301);
});

Deno.test("part 2", () => {
  assertEquals(part2(readInput(21)), 3423279932937);
});

type Op = keyof typeof ops;
const ops = {
  "+": (a: number, b: number) => a + b,
  "-": (a: number, b: number) => a - b,
  "*": (a: number, b: number) => a * b,
  "/": (a: number, b: number) => a / b,
};

function parseMonkeys(input: string) {
  const monkeys = input.split("\n").map((line) => {
    const [_, name, num, a, op, b] = [
      ...(line.match(/(.{4}): (\d+|(.{4}) (.) (.{4}))/)?.values()!),
    ];
    const value = parseInt(num);
    return {
      name,
      value: isNaN(value) ? undefined : value,
      peers: [a, b] as const,
      op: op as "*" | "/" | "+" | "-",
    };
  });

  return new Map(monkeys.map((monkey) => [monkey.name, monkey]));
}

function part1(input: string) {
  const monkeys = parseMonkeys(input);

  const recurse = (name: string): number => {
    const { value, op, peers } = monkeys.get(name)!;

    return (value != undefined)
      ? value
      : (ops[op](recurse(peers[0]), recurse(peers[1])));
  };

  return recurse("root");
}

function part2(input: string) {
  const monkeys = parseMonkeys(input);

  const recurse = (name: string): number => {
    const { value, op, peers } = monkeys.get(name)!;
    return (value != undefined)
      ? value
      : (ops[op](recurse(peers[0]), recurse(peers[1])));
  };

  const root = monkeys.get("root")!;

  function findCalculationPath(
    name: string,
    ops: [Op, readonly [string, string], number][],
  ): [Op, readonly [string, string], number][] {
    const user = [...monkeys.values()].find(({ peers }) =>
      peers.some((peer) => peer === name)
    )!;

    if (name === root.peers[0]) return ops;

    const indexOfHuman = user.peers.indexOf(name);
    return findCalculationPath(user.name, [...ops, [
      user?.op,
      user.peers,
      indexOfHuman,
    ]]);
  }

  const path = findCalculationPath("humn", []).toReversed();

  let val = recurse(root.peers[1]);
  for (const [op, [a, b], indexOfHumanPath] of path) {
    if (op === "-" && indexOfHumanPath === 0) {
      val += recurse(b);
    } else if (op === "-" && indexOfHumanPath === 1) {
      val = recurse(a) - val;
    } else if (op === "+" && indexOfHumanPath === 0) {
      val -= recurse(b);
    } else if (op === "+" && indexOfHumanPath === 1) {
      val -= recurse(a);
    } else if (op === "*" && indexOfHumanPath === 0) {
      val /= recurse(b);
    } else if (op === "*" && indexOfHumanPath === 1) {
      val /= recurse(a);
    } else if (op === "/" && indexOfHumanPath === 0) {
      val *= recurse(b);
    } else if (op === "/" && indexOfHumanPath === 1) {
      val *= recurse(a);
    }
  }
  return val;
}
