import { toInt } from "./../utils/toInt";
import { getExample } from "../utils/getInput";
import { getInput } from "../utils/getInput";
import { match } from "ts-pattern";
import { span } from "../utils/span";
import { countBy } from "lodash";
import { pipe } from "fp-ts/lib/function";
import { zip } from "fp-ts/lib/Array";
const input = getInput(__dirname);
const example = getExample(__dirname);

const countOverlappingPoints = (input: string, includeDiagonals = false) => {
  const lines = parseLines(input).filter(
    ([Ax, Ay, Bx, By]) => includeDiagonals || Ax === Bx || Ay === By
  );

  return pipe(
    lines.flatMap(lineToPoints),
    countBy,
    Object.values,
    (values) => values.filter((c) => c > 1).length
  );
};

type Line = [number, number, number, number];

const parseLines = (input: string): Line[] => {
  return input
    .split("\n")
    .map(
      (line) =>
        line
          .split(" -> ")
          .flatMap((point) => point.split(",").map(toInt)) as Line
    );
};

type Point = [number, number];

const lineToPoints = ([Ax, Ay, Bx, By]: Line) => {
  return match({ Ax, Ay, Bx, By })
    .when(
      () => Ax !== Bx && Ay === By,
      () => span(Ax, Bx).map<Point>((x) => [x, Ay])
    )
    .when(
      () => Ax === Bx && Ay !== By,
      () => span(Ay, By).map<Point>((y) => [Ax, y])
    )
    .otherwise(() => zip(span(Ax, Bx), span(Ay, By)));
};

test("part 1", () => {
  expect(countOverlappingPoints(example)).toBe(5);
  expect(countOverlappingPoints(input)).toBe(7644);
});

test("part 2", () => {
  expect(countOverlappingPoints(example, true)).toBe(12);
  expect(countOverlappingPoints(input, true)).toBe(18627);
});

test("parse", () => {
  const line = parseLines("0,9 -> 5,9")[0];
  expect(line).toEqual([0, 9, 5, 9]);
});
