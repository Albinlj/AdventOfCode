import { toInt } from "./../utils/toInt";
import {
  any,
  clone,
  contains,
  equals,
  includes,
  map,
  none,
  not,
  pipe,
  range,
  split,
  xprod,
  zip,
} from "ramda";
import { getInput, getExample } from "../utils/getInput";
import { Coord, Grid, isInGrid } from "../utils/grid";
import { update } from "lodash";

const input = getInput(__dirname);
const example = getExample(__dirname);

const miniExample = `11111\n19991\n19191\n19991\n11111`;

const parseGrid: (str: string) => number[][] = pipe(
  split("\n"),
  map(pipe(Array.from, map(toInt)))
);

const around = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

const part1 = (g: Grid) => {
  let count = 0;
  for (let i = 0; i < 100; i++) {
    let toUp: Coord[] = xprod(range(0, g.length), range(0, g[0].length));
    let flashed: Coord[] = [];

    while (toUp.length !== 0) {
      const coord = toUp.shift();
      if (isInGrid(g, coord)) {
        const val = (g[coord[0]][coord[1]] += 1);

        if (val > 9 && none<Coord>(equals(coord), flashed)) {
          flashed.push(coord);
          count++;
          for (let c of around) {
            toUp.push([coord[0] + c[0], coord[1] + c[1]]);
          }
        }
      }
    }

    for (let res of flashed) {
      g[res[0]][res[1]] = 0;
    }
  }
  return count;
};

const part2 = (g: Grid) => {
  let count = 0;
  let i = 1;
  while (true) {
    let toUp: Coord[] = xprod(range(0, g.length), range(0, g[0].length));
    let flashed: Coord[] = [];

    while (toUp.length !== 0) {
      const coord = toUp.shift();
      if (isInGrid(g, coord)) {
        const val = (g[coord[0]][coord[1]] += 1);

        if (val > 9 && none<Coord>(equals(coord), flashed)) {
          flashed.push(coord);
          count++;
          for (let c of around) {
            toUp.push([coord[0] + c[0], coord[1] + c[1]]);
          }
        }
      }
    }

    if (flashed.length === g.length * g[0].length) {
      return i;
    }

    for (let res of flashed) {
      g[res[0]][res[1]] = 0;
    }
    i++;
  }
  return count;
};

const addOne = (grid: Grid, coord: Coord) => {};

test("part1", () => {
  expect(part1(parseGrid(example))).toEqual(1656);
  expect(part1(parseGrid(input))).toEqual(1647);
});

test("part2", () => {
  expect(part2(parseGrid(example))).toEqual(195);
  expect(part2(parseGrid(input))).toEqual(348);
});
