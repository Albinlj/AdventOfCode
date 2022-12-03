import {
  filter,
  init,
  last,
  map,
  median,
  pipe,
  reverse,
  split,
  sum,
  tail,
} from "ramda";
import { match } from "ts-pattern";
import { getInput, getExample } from "../utils/getInput";

const input = getInput(__dirname);
const example = getExample(__dirname);

const findCorruptingCharacter = (str: string, open: string = "") => {
  const ch = str[0];
  if (ch === "(" || ch === "{" || ch === "[" || ch === "<")
    return findCorruptingCharacter(str.slice(1), open + ch);
  if (str.length === 0) return null;
  const la = last(open);
  if (
    (ch === ")" && la !== "(") ||
    (ch === "}" && la !== "{") ||
    (ch === "]" && la !== "[") ||
    (ch === ">" && la !== "<")
  )
    return ch;

  return findCorruptingCharacter(tail(str), init(open));
};

const corruptingCharacterScore = (ch: string) =>
  match(ch)
    .with(")", () => 3)
    .with("]", () => 57)
    .with("}", () => 1197)
    .with(">", () => 25137)
    .otherwise(() => 0);

const part1 = pipe(
  split("\n"),
  map(findCorruptingCharacter),
  map(corruptingCharacterScore),
  sum
);

const findClosingString = (str: string, open: string = "") => {
  if (str.length === 0)
    return reverse(
      open
        .replace(/\(/g, ")")
        .replace(/\[/g, "]")
        .replace(/\{/g, "}")
        .replace(/\</g, ">")
    );

  const ch = str[0];
  if (ch === "(" || ch === "{" || ch === "[" || ch === "<")
    return findClosingString(str.slice(1), open + ch);

  return findClosingString(tail(str), init(open));
};

const closingCharacterScore = (ch: string) =>
  match(ch)
    .with(")", () => 1)
    .with("]", () => 2)
    .with("}", () => 3)
    .with(">", () => 4)
    .run();

const closingLineScore = (line: string) =>
  Array.from(line).reduce(
    (acc, curr) => acc * 5 + closingCharacterScore(curr),
    0
  );

const part2 = pipe(
  split("\n"),
  filter((line: string) => findCorruptingCharacter(line) === null),
  map(findClosingString),
  map(closingLineScore),
  median
);

test("part1", () => {
  expect(part1(example)).toEqual(26397);
  expect(part1(input)).toEqual(168417);
});

test("part2", () => {
  expect(part2(example)).toEqual(288957);
  expect(part2(input)).toEqual(2802519786);
});

test("findCorrupt", () => {
  expect(findCorruptingCharacter("{([(<{}[<>[]}>{[]{[(<()>")).toEqual("}");
  expect(findCorruptingCharacter("[[<[([]))<([[{}[[()]]]")).toEqual(")");
  expect(findCorruptingCharacter("[{[{({}]{}}([{[{{{}}([]")).toEqual("]");
  expect(findCorruptingCharacter("[<(<(<(<{}))><([]([]()")).toEqual(")");
  expect(findCorruptingCharacter("<{([([[(<>()){}]>(<<{{")).toEqual(">");
});

test("findClosingString", () => {
  expect(findClosingString("[({(<(())[]>[[{[]{<()<>>")).toEqual("}}]])})]");
  expect(findClosingString("[(()[<>])]({[<{<<[]>>(")).toEqual(")}>]})");
  expect(findClosingString("(((({<>}<{<{<>}{[]{[]{}")).toEqual("}}>}>))))");
  expect(findClosingString("{<[[]]>}<{[{[{[]{()[[[]")).toEqual("]]}}]}]}>");
  expect(findClosingString("<{([{{}}[<[[[<>{}]]]>[]]")).toEqual("])}>");
});

test("closingLineScore", () => {
  expect(closingLineScore("}}]])})]")).toEqual(288957);
  expect(closingLineScore(")}>]})")).toEqual(5566);
  expect(closingLineScore("}}>}>))))")).toEqual(1480781);
  expect(closingLineScore("]]}}]}]}>")).toEqual(995444);
  expect(closingLineScore("])}>")).toEqual(294);
});
