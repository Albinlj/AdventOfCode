import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readFile } from "../utilities.ts";

type Pair = [[number, number], [number, number]];

const parsePairs = (input: string): Pair[] =>
  input
    .split("\n")
    .map((line) =>
      line.split(",").map((elf) =>
        elf.split("-")
          .map((num) => parseInt(num))
      )
    ) as Pair[];

const part1 = (input: string): any =>
  parsePairs(input)
    .filter(
      ([[a1, a2], [b1, b2]]) =>
        (a1 <= b1 && a2 >= b2) || (b1 <= a1 && b2 >= a2),
    ).length;

const part2 = (input: string): any =>
  parsePairs(input)
    .filter(
      ([[a1, a2], [b1, b2]]) =>
        (a2 >= b1 && a1 <= b2) || (a1 <= b2 && a2 >= b1),
    ).length;

Deno.test("part1", () => {
  const input = readFile("day04.input.txt");
  assertEquals(part1(input), 453);
});

Deno.test("part2", () => {
  const input = readFile("day04.input.txt");
  assertEquals(part2(input), 919);
});

Deno.test("example part1", () => {
  const input = readFile("day04.example.txt");
  assertEquals(part1(input), 2);
});

Deno.test("example part2", () => {
  const input = readFile("day04.example.txt");
  assertEquals(part2(input), 4);
});
