import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readFile } from "../utilities.ts";
import { add, subtract, sum } from "https://deno.land/x/fae@v1.1.1/mod.ts";

const parseElves = (input: string) =>
  input
    .split("\n\n")
    .map((elf) =>
      elf.split("\n")
        .map((n) => parseInt(n))
    );

const findCaloriestElf = (input: string, take: number) =>
  parseElves(input)
    .map(sum)
    .sort(subtract)
    .slice(-take)
    .reduce(add);

Deno.test("part1", () => {
  const input = readFile("./day01.input.txt");
  assertEquals(findCaloriestElf(input, 1), 72240);
});

Deno.test("part2", () => {
  const input = readFile("./day01.input.txt");
  assertEquals(findCaloriestElf(input, 3), 210957);
});

Deno.test("example", () => {
  const input = readFile("./day01.example.txt");
  assertEquals(findCaloriestElf(input, 1), 24000);
});
