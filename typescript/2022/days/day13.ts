import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import { zip } from "https://deno.land/x/fae@v1.1.1/mod.ts";

type Packet = number | Packet[];

const parse = (part1: string) =>
  part1.split("\n\n").map((pair) =>
    pair.split("\n").map((line) => JSON.parse(line) as Packet)
  );

function part1(input: string): number {
  return parse(input)
    .map((pair, i) => isCorrect(pair) ? i + 1 : 0)
    .reduce((a, b) => a + b);
}

function part2(input: string): number {
  const parsed = parse(input).flat(1);

  const divA = [[2]];
  const divB = [[6]];

  const sorted = [...parsed, divA, divB]
    .sort((a, b) => isCorrect([a, b]) ? -1 : 0);

  return (sorted.indexOf(divA) + 1) * (sorted.indexOf(divB) + 1);
}

function isCorrect([a, b]: Packet[]): boolean | undefined {
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);

  if (!aIsArray && !bIsArray) {
    if (a < b) return true;
    if (a > b) return false;
    return undefined;
  }

  const A = aIsArray ? a : [a];
  const B = bIsArray ? b : [b];

  for (const [a, b] of zip(A, B)) {
    const result = isCorrect([a, b]);
    if (result != undefined) return result;
  }

  if (A.length == B.length) return undefined;
  return (A.length < B.length);
}

Deno.test("example1", () => {
  assertEquals(part1(readExample(13)), 13);
});

Deno.test("example2", () => {
  assertEquals(part2(readExample(13)), 140);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(13)), 5340);
});

Deno.test("part2", () => {
  assertEquals(part2(readInput(13)), 21276);
});

Deno.test("parse", () => {
  assertEquals(parse(readExample(13)), [
    [[1, 1, 3, 1, 1], [1, 1, 5, 1, 1]],
    [[[1], [2, 3, 4]], [[1], 4]],
    [[9], [[8, 7, 6]]],
    [[[4, 4], 4, 4], [[4, 4], 4, 4, 4]],
    [[7, 7, 7, 7], [7, 7, 7]],
    [[], [3]],
    [[[[]]], [[]]],
    [[1, [2, [3, [4, [5, 6, 7]]]], 8, 9], [1, [2, [3, [4, [5, 6, 0]]]], 8, 9]],
  ]);
});
