import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { add } from "https://deno.land/x/fae@v1.1.1/mod.ts";
import { chunks, readFile } from "../utilities.ts";

type Rucksack = [Compartment, Compartment];
type Compartment = string;

const parseRucksacks = (input: string): Rucksack[] =>
  input
    .split("\n")
    .map((line) => [
      line.slice(0, line.length * 0.5),
      line.slice(line.length * 0.5),
    ]);

const part1 = (input: string) =>
  parseRucksacks(input)
    .map(([a, b]) => [...a].find((item) => b.includes(item)))
    .map(getPriority)
    .reduce(add);

const part2 = (input: string) => {
  return [...chunks(input.split("\n"), 3)]
    .map(([a, b, c]) =>
      Array.from(a).find((item) => b.includes(item) && c.includes(item))
    )
    .map(getPriority)
    .reduce(add);
};

const getPriority = (item?: string) => {
  const char: number = item!.charCodeAt(0);
  return char > 96 ? char - 96 : 27 + char - 65;
};

Deno.test("example part1", () => {
  const input = readFile("day03.example.txt");
  assertEquals(part1(input), 157);
});

Deno.test("part1", () => {
  const input = readFile("day03.input.txt");
  assertEquals(part1(input), 7746);
});

Deno.test("example part22", () => {
  const input = readFile("day03.example.txt");
  assertEquals(part2(input), 70);
});

Deno.test("part2", () => {
  const input = readFile("day03.input.txt");
  assertEquals(part2(input), 2604);
});
