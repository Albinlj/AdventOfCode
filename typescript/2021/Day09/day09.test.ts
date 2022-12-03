import { toInt } from "./../utils/toInt";
import { getInput, getExample } from "../utils/getInput";
import { add, countBy, equals, map, multiply, pipe, prop, sum } from "ramda";
import { size } from "lodash";
import { black, green, grey, hex, hsl, red, rgb } from "chalk";

const input = getInput(__dirname);
const example = getExample(__dirname);

type Coord = [number, number];

const isInGrid = (grid: number[][], [y, x]: Coord) =>
  !(x < 0 || y < 0 || x >= grid[0].length || y >= grid.length);

const getHeight = (grid: number[][], [y, x]: Coord) =>
  !isInGrid(grid, [y, x]) ? undefined : grid[y][x];

type LowPoint = { coord: Coord; value: number };

const findLowSpots = (grid: number[][]) =>
  grid.reduce(
    (spots, row, y, grid) => [
      ...spots,
      ...row.reduce(
        (spots, height, x) =>
          (x === 0 || (grid[y][x - 1] > height && grid[y][x - 1] > height)) &&
          (x === row.length - 1 || grid[y][x + 1] > height) &&
          (y === 0 || grid[y - 1][x] > height) &&
          (y === grid.length - 1 || grid[y + 1][x] > height)
            ? [...spots, { coord: [y, x], value: grid[y][x] }]
            : spots,
        []
      ),
    ],
    [] as LowPoint[]
  );

const parseGrid = (input: string) =>
  input.split("\n").map((row) => Array.from(row).map(toInt));

const part1 = pipe(
  parseGrid,
  findLowSpots,
  map(prop("value")),
  map(add(1) as any),
  sum
);

const findBasinCoords = (start: Coord, grid: number[][]) => {
  const lowPoint = getHeight(grid, start);
  let toCheck: [Coord, number][] = [[start, lowPoint]];
  let checked = [];

  const attemptAdd = (coord: Coord, lastHeight: number) => {
    if (!checked.some(equals(coord)) && isInGrid(grid, coord)) {
      toCheck.push([coord, lastHeight]);
    }
  };

  while (toCheck.length !== 0) {
    const [checkCoord, lastValue] = toCheck.pop();
    const height = getHeight(grid, checkCoord);

    if (
      height >= lastValue &&
      height !== 9 &&
      !checked.some(equals(checkCoord))
    ) {
      const [y, x] = checkCoord;
      attemptAdd([y - 1, x], height);
      attemptAdd([y + 1, x], height);
      attemptAdd([y, x - 1], height);
      attemptAdd([y, x + 1], height);
      checked = [...checked, checkCoord];
    }
  }
  return checked;
};

const findBasinSize = pipe(findBasinCoords, size);

test("part1", () => {
  expect(part1(example)).toEqual(15);
  expect(part1(input)).toEqual(448);
});

const part2 = (input: string) => {
  const grid = parseGrid(input);
  const lowspots = findLowSpots(grid);
  const basinCoords = lowspots.map((l) => findBasinCoords(l.coord, grid));
  return [...basinCoords]
    .map(size)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce(multiply);
};

test("findBasinSize", () => {
  const grid = parseGrid(example);
  // expect(findBasinSize([0, 1], grid)).toBe(3);
  // expect(findBasinSize([0, 9], grid)).toBe(9);
  expect(findBasinSize([2, 2], grid)).toBe(14);
  expect(findBasinSize([4, 6], grid)).toBe(9);
});

test("part2", () => {
  expect(part2(example)).toEqual(1134);
  expect(part2(input)).toEqual(1417248);
});

function logBasins(grid: number[][], basins: Coord[][]) {
  let str = "";
  for (let y = 0; y < grid.length; y++) {
    let row = grid[y];

    for (let x = 0; x < row.length; x++) {
      const el = row[x];

      if (el === 9) {
        str += grey(9);
        continue;
      }

      str += basins.some((b) => b.some((s) => s[0] === y && s[1] === x))
        ? red(el)
        : green(el);
    }
    str += "\n";
  }
  console.log(str);
}
