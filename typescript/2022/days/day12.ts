import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(12)), 31);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(12)), 425);
});

Deno.test("part2", () => {
  assertEquals(part2(readInput(12)), 418);
});

type Coord = [x: number, y: number];
type Node = {
  height: number;
  distance: number;
  coord: Coord;
};

const parseMap = (input: string): [Node[][], Coord, Coord] => {
  let start: Coord;
  let end: Coord;

  const grid = input
    .split("\n")
    .map((line, y) =>
      [...line]
        .map<Node>((char, x) => {
          if (char === "S") start = [x, y] as Coord;
          if (char === "E") end = [x, y] as Coord;
          return {
            coord: [x, y] as Coord,
            height: (
              char === "S"
                ? "a".charCodeAt(0)
                : char === "E"
                ? "z".charCodeAt(0)
                : char.charCodeAt(0)
            ) - 97,
            distance: Infinity,
          };
        })
    );

  return [grid, start!, end!];
};

const part1 = (input: string) => {
  const [grid, start, end] = parseMap(input);
  return findShortestDistance(grid, start, end);
};

const part2 = (input: string) => {
  const [grid, , end] = parseMap(input);
  return grid
    .flatMap((a) => a)
    .filter((node) => node.height === 0)
    .map((node) => findShortestDistance(grid, node.coord, end))
    .sort((a, b) => a - b).at(0);
};

const add = ([a1, a2]: Coord, [b1, b2]: Coord) => [a1 + b1, a2 + b2];

const findShortestDistance = (
  grid: Node[][],
  start: Coord,
  [endX, endY]: Coord,
) => {
  grid[start[1]][start[0]].distance = 0;

  const candidates: Coord[] = [start];

  do {
    const [x, y] = candidates.shift()!;
    const current = grid[y][x];

    const neighbors = ([[0, 1], [1, 0], [-1, 0], [0, -1]] as Coord[])
      .map((n) => add(n, current.coord))
      .filter(([x, y]) =>
        x >= 0 &&
        y >= 0 &&
        x < grid[0].length &&
        y < grid.length
      )
      .map(([x, y]) => grid[y][x])
      .filter((node) =>
        node.height <= current.height + 1 &&
        node.distance > current.distance + 1
      );

    for (const neighbor of neighbors) {
      neighbor.distance = current.distance + 1;
      candidates.push(neighbor.coord);
    }
  } while (candidates.length > 0);

  return grid[endY][endX].distance;
};
