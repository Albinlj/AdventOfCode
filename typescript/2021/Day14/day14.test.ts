import { getInput, getExample } from "../utils/getInput";
import { aperture, countBy, head, last, memoizeWith, mergeWith } from "ramda";

const input = getInput(__dirname);
const example = getExample(__dirname);

type Rules = Map<string, string>;
type LetterCount = { [letter: string]: number };

//PARSING
const parse = (input: string): [string, Rules] => {
  const [polymer, rules] = input.split("\n\n");
  const parsedRules = rules
    .split("\n")
    .map((line) => line.split(" -> ") as [string, string]);
  return [polymer, new Map(parsedRules) as Rules];
};

//PART1
const part1 = (input: string, times: number = 10) => {
  const [polymer, rules] = parse(input);
  const final = applyRules(polymer, rules, times);
  const counts = countBy<string>((s) => s, final as any])
  return differenceCommonUncommon(counts);
};

const applyRules = (polymer: string, rules: Rules, times: number): string => {
  const pairs = aperture(2, Array.from(polymer));
  const merged =
    polymer[0] + pairs.map(([a, b]) => rules.get(a + b) + b).join("");
  return times === 1 ? merged : applyRules(merged, rules, times - 1);
};

//PART2
const part2 = (input: string, times: number = 10) => {
  const [polymer, rules] = parse(input);
  const applyRulesGetCounts = memoizeWith(
    ([a, c]) => a + c,
    ([[a, c], times]: [string, number]): LetterCount => {
      const b = rules.get(a + c);

      return times === 0
        ? countBy<string>((s) => s, [a])
        : mergeObj(
            applyRulesGetCounts([a + b, times - 1]),
            applyRulesGetCounts([b + c, times - 1])
          );
    }
  );

  const counts = aperture(2, Array.from(polymer))
    .map((arr: string[]) => applyRulesGetCounts([arr.join(""), times]))
    .reduce(mergeObj, {});

  counts[last(polymer)] += 1;
  return differenceCommonUncommon(counts);
};

const differenceCommonUncommon = (counts: LetterCount) => {
  let ordered = Object.values(counts);
  ordered.sort((a, b) => b - a);
  return head(ordered) - last(ordered);
};

const mergeObj = (a: LetterCount, b: LetterCount): LetterCount =>
  mergeWith((a, b) => a + b, a, b);

//TESTS
test("part2", () => {
  expect(part2(example, 10)).toEqual(1588);
  expect(part2(example, 40)).toEqual(2188189693529);
  expect(part2(input, 40)).toEqual(4704817645083);
});

test("part1", () => {
  const [polymer, rules] = parse(example);
  expect(applyRules(polymer, rules, 1)).toEqual("NCNBCHB");
  expect(applyRules(polymer, rules, 2)).toEqual("NBCCNBBBCBHCB");
  expect(applyRules(polymer, rules, 3)).toEqual("NBBBCNCCNBBNBNBBCHBHHBCHB");
  expect(applyRules(polymer, rules, 4)).toEqual(
    "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"
  );
  expect(part1(example, 10)).toEqual(1588);
  expect(part1(input, 10)).toEqual(4517);
});
