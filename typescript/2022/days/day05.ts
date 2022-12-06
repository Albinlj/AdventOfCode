import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readFile } from "../utilities.ts";

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
  const input = readFile("day05.example.txt");
  const [stacks, actions] = parse(input);
  assertEquals(stacks, ["ZN", "MCD", "P"]);
  assertEquals(actions, [[1, 1, 0], [3, 0, 2], [2, 1, 0], [1, 0, 1]]);
});

Deno.test("part1", () => {
  const input = readFile("day05.input.txt");
  assertEquals(part1(input), "VCTFTJQCG");
});

Deno.test("part2", () => {
  const input = readFile("day05.input.txt");
  assertEquals(part2(input), "GCFGLDNJZ");
});

Deno.test("example part1", () => {
  const input = readFile("day05.example.txt");
  assertEquals(part1(input), "CMZ");
});
