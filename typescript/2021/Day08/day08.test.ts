import { getInput, getExample } from "../utils/getInput";
import { chain, filter, last, length, map, pipe, split, sum } from "ramda";

const input = getInput(__dirname);
const example = getExample(__dirname);

const parseLine = pipe(split(" | "), map(split(" ")));

//part1
const is1478 = pipe(length, (l) => l === 2 || l === 3 || l === 4 || l === 7);
const part1 = pipe(
  split("\n"),
  map(parseLine),
  chain(last),
  filter(is1478),
  length
);

//part2
const part2 = pipe(
  split("\n"),
  map(parseLine),
  map(([patterns, output]) => patternsToOutputValue(patterns, output)),
  sum
);

const patternsToOutputValue = (patterns: string[], output: string[]) => {
  const d1 = patterns.find((p) => p.length === 2);
  const d4 = patterns.find((p) => p.length === 4);
  const d7 = patterns.find((p) => p.length === 3);
  const d8 = "abcdefg";

  const fivePatterns = patterns.filter((p) => p.length === 5);
  const sixPatterns = patterns.filter((p) => p.length === 6);

  const a = Array.from(d7).find((ch) => !d1.includes(ch));
  const eg = Array.from(d8).filter((ch) => ch !== a && !d4.includes(ch));

  const d9 = sixPatterns.find((six) =>
    Array.from(d4).every((ch) => six.includes(ch))
  );
  const d0 = sixPatterns.find(
    (six) => six != d9 && Array.from(d1).every((ch) => six.includes(ch))
  );
  const d6 = sixPatterns.find((six) => six != d9 && six != d0);
  const d2 = fivePatterns.find((f) => f.includes(eg[0]) && f.includes(eg[1]));
  const d3 = fivePatterns.find(
    (f) => f != d2 && f.includes(d1[0]) && f.includes(d1[1])
  );
  const d5 = fivePatterns.find((f) => f != d2 && f != d3);

  const digits = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];

  const ut = output
    .map((pat) =>
      digits.findIndex(
        (dig) =>
          dig.length === pat.length &&
          Array.from(pat).every((ch) => dig.includes(ch))
      )
    )
    .join("");

  return parseInt(ut);
};

//tests
test("part 1", () => {
  expect(part1(example)).toEqual(26);
  expect(part1(input)).toEqual(264);
});

test("part 2", () => {
  expect(part2(example)).toEqual(61229);
  expect(part2(input)).toEqual(1063760);
});

test("patternstosections", () => {
  expect(patternsToOutputValue(patterns0123456789, Output1234)).toEqual(1234);
  expect(patternsToOutputValue(exampleStringPatterns, exampleOutput)).toEqual(
    5353
  );
});

test("parsing", () => {
  expect(
    parseLine(
      "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"
    )
  ).toEqual([exampleStringPatterns, exampleOutput]);
});

//example inputs
const exampleStringPatterns = [
  "acedgfb",
  "cdfbe",
  "gcdfa",
  "fbcad",
  "dab",
  "cefabd",
  "cdfgeb",
  "eafb",
  "cagedb",
  "ab",
];
const exampleOutput = ["cdfeb", "fcadb", "cdfeb", "cdbaf"];

const patterns0123456789 = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
];

const Output1234 = ["cf", "acdeg", "acdfg", "bcdf"];
