import {
  chain,
  concat,
  countBy,
  equals,
  identity,
  map,
  nth,
  pipe,
  reduceBy,
  reverse,
  split,
  toUpper,
} from "ramda";
import { getInput, getExample } from "../utils/getInput";

const input = getInput(__dirname);
const example = getExample(__dirname);
const example2 =
  "dc-end\nHN-start\nstart-kj\ndc-start\ndc-HN\nLN-dc\nHN-end\nkj-sa\nkj-HN\nkj-dc";

type System = { [from: string]: string[] };

const parseCaveSystem: (str: string) => System = pipe(
  split("\n"),
  map(split("-")),
  chain((path) => [path, reverse(path)]),
  reduceBy((exits, [_, exit]) => exits.concat(exit), [], nth(0))
);

const part1 = (input: string) => {
  const system = parseCaveSystem(input);
  let fullPaths = [];

  const findPaths = (current = "start", path: string[] = []) => {
    return current === "end"
      ? (() => {
          fullPaths.push(path);
          return [...path, "end"];
        })()
      : system[current]
          .filter((e) => !path.includes(e) || isLarge(e))
          .reduce(
            (paths, next) => concat(paths, findPaths(next, [...path, current])),
            []
          );
  };
  findPaths("start");
  return fullPaths.length;
};

//please don't look
const part2 = (input: string) => {
  const system = parseCaveSystem(input);
  let fullPaths = [];

  const findPaths = (current = "start", path: string[] = []) => {
    if (current === "end") {
      fullPaths.push([...path, "end"]);
    } else {
      system[current]
        .filter(
          (e) =>
            e !== "start" &&
            (isLarge(e) ||
              !path.includes(e) ||
              (() => {
                const smallCaves = [...path, current].filter(
                  (c) => !isLarge(c)
                );
                const counts = countBy(identity, smallCaves);
                return Object.values(counts).every((v) => v < 2);
              })())
        )
        .forEach((next) => findPaths(next, [...path, current]));
    }
  };

  findPaths("start");
  return fullPaths.length;
};

const isLarge = (name: string) => equals(name, toUpper(name));

test("part1", () => {
  expect(isLarge("ABC")).toEqual(true);
  expect(isLarge("abc")).toEqual(false);
  expect(parseCaveSystem(example)).toEqual({
    start: ["A", "b"],
    A: ["start", "c", "b", "end"],
    b: ["start", "A", "d", "end"],
    c: ["A"],
    d: ["b"],
    end: ["A", "b"],
  });
  expect(parseCaveSystem(example2)).toEqual({
    HN: ["start", "dc", "end", "kj"],
    LN: ["dc"],
    dc: ["end", "start", "HN", "LN", "kj"],
    end: ["dc", "HN"],
    kj: ["start", "sa", "HN", "dc"],
    sa: ["kj"],
    start: ["HN", "kj", "dc"],
  });
  expect(part1(example)).toEqual(10);
  expect(part1(example2)).toEqual(19);
  expect(part1(input)).toEqual(3292);
});

test("part2", () => {
  expect(part2(example)).toEqual(36);
  expect(part2(example2)).toEqual(103);
  expect(part2(input)).toEqual(89592);
});
