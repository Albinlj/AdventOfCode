import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readFile, readInput } from "../utilities.ts";

type Stacks = string[];
type Action = [number, number, number];

const parse = (input: string): [Stacks, Action[]] => {
  const [stacks, actions] = input.split("\n\n").map((part) => part.split("\n"));

  return [
    stacks,
    actions.map((line) => {
      const [count, from, to] = line.match(/\d+/g)?.map((a) => parseInt(a))!;
      return [count, from - 1, to - 1];
    }),
  ] as any;
};

function part1(input: string): any {
  const [stacks, actions] = parse(input);

  for (const [count, from, to] of actions) {
    stacks[to] = stacks[to] +
      stacks[from]
        .slice(-count)
        .split("")
        .toReversed()
        .join("");

    stacks[from] = stacks[from].slice(0, -count);
  }

  return stacks.map((stack) => stack.at(-1)).join("");
}

function part2(input: string): any {
  const [stacks, actions] = parse(input);

  for (const [count, from, to] of actions) {
    stacks[to] = stacks[to] +
      stacks[from]
        .slice(-count);

    stacks[from] = stacks[from].slice(0, -count);
  }

  return stacks.map((stack) => stack.at(-1)).join("");
}

Deno.test("parse", () => {
  const input = readExample(5);
  const [stacks, actions] = parse(input);
  assertEquals(stacks, ["ZN", "MCD", "P"]);
  assertEquals(actions, [[1, 1, 0], [3, 0, 2], [2, 1, 0], [1, 0, 1]]);
});

Deno.test("part1", () => {
  const input = readInput(5);
  assertEquals(part1(input), "VCTFTJQCG");
});

Deno.test("part2", () => {
  const input = readInput(5);
  assertEquals(part2(input), "GCFGLDNJZ");
});

Deno.test("example part1", () => {
  const input = readExample(5);
  assertEquals(part1(input), "CMZ");
});
