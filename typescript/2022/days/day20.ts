import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import { add } from "https://deno.land/x/fae@v1.1.1/mod.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(20)), 3);
});

Deno.test("part 1", { only: false }, () => {
  assertEquals(part1(readInput(20)), 7278);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(20)), 1623178306);
});

Deno.test("part 2", { only: false }, () => {
  assertEquals(part2(readInput(20)), 14375678667089);
});

function part1(input: string): any {
  const originals = input.split("\n").map((a) => [parseInt(a)]);
  const mixed = [...originals];

  for (const num of originals) {
    mixOnce(mixed, num);
  }
  return formCoordinates(mixed);
}

function part2(input: string): any {
  const originals = input
    .split("\n")
    .map((a) => [parseInt(a) * 811589153]);

  const mixed = [...originals];
  for (let i = 0; i < 10; i++) {
    for (const num of originals) {
      mixOnce(mixed, num);
    }
  }

  return formCoordinates(mixed);
}

function formCoordinates(mixed: number[][]) {
  const zeroIndex = mixed.findIndex(([a]) => a === 0);
  return [1000, 2000, 3000]
    .map((i) => mixed[(zeroIndex + i) % mixed.length])
    .map(([a]) => a)
    .reduce(add, 0);
}

function mixOnce(mixed: number[][], num: number[]) {
  const [value] = num;
  const oldIndex = mixed.indexOf(num);
  const newIndex = (oldIndex + value) % (mixed.length - 1);

  const moving = mixed.splice(oldIndex, 1);
  mixed.splice(newIndex, 0, moving[0]);
}
