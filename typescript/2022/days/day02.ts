import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readFile } from "../utilities.ts";

type Elf = "A" | "B" | "C";
type You = "X" | "Y" | "Z";

type Round = [Elf, You];

const parseRounds = (input: string): Round[] => {
  return input
    .trim()
    .split("\n")
    .map((round) => round.split(" ") as Round);
};

const part1 = (input: string) =>
  parseRounds(input)
    .reduce((score, round) => roundScore1(round) + score, 0);

const part2 = (input: string) =>
  parseRounds(input)
    .reduce((score, round) => roundScore2(round) + score, 0);

const roundScore2 = ([elf, outcome]: Round) => {
  const picks = {
    AX: "Z",
    AY: "X",
    AZ: "Y",
    BX: "X",
    BY: "Y",
    BZ: "Z",
    CX: "Y",
    CY: "Z",
    CZ: "X",
  } as any;

  const you = picks[elf + outcome];
  return roundScore1([elf, you]);
};

const roundScore1 = ([elf, you]: Round) => {
  const pickScore = ["X", "Y", "Z"].indexOf(you) + 1;
  const outcomeScore = {
    AX: 3,
    BY: 3,
    CZ: 3,
    AY: 6,
    BZ: 6,
    CX: 6,
    AZ: 0,
    BX: 0,
    CY: 0,
  } as any;

  return outcomeScore[elf + you] + pickScore;
};

Deno.test("part 1", () => {
  const input = readFile("day02.input.txt");
  assertEquals(part1(input), 10718);
});

Deno.test("part 2", () => {
  const input = readFile("./day02.input.txt");
  assertEquals(part2(input), 14652);
});

Deno.test("example 1", () => {
  const input = readFile("./day02.example.txt");
  assertEquals(part1(input), 15);
});

Deno.test("example 2", () => {
  const input = readFile("./day02.example.txt");
  assertEquals(part2(input), 12);
});
