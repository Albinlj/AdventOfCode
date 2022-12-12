import { green } from "https://deno.land/std@0.166.0/fmt/colors.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { xor } from "https://deno.land/x/fae@v1.1.1/xor.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(12)), 31);
});

Deno.test("part1", () => {
  assertEquals(part1(readInput(12)), 425);
});

type Node = {
  height: number;
  distance: number;
  coord: Coord;
};

const parseMap = (input: string): [Node[][], Coord, Coord] => {
  let start: Coord = [Infinity, Infinity];
  let end: Coord = [Infinity, Infinity];

  const grid = input
    .split("\n")
    .map((line, y) =>
      [...line]
        .map<Node>((char, x) => {
          if (char === "S") start = [x, y] as Coord;
          if (char === "E") end = [x, y] as Coord;
          return {
            coord: [x, y] as Coord,
            height: char === "S"
              ? 0
              : char === "E"
              ? "z".charCodeAt(0) - 97
              : char.charCodeAt(0) - 97,
            distance: char === "S" ? 0 : Infinity,
          };
        })
    );

  console.log(start, end);

  return [grid, start, end];
};

type Coord = [x: number, y: number];

const part1 = (input: string) => {
  const [grid, start, [endX, endY]] = parseMap(input);

  console.log(endX, endY);

  const candidates: Coord[] = [start];

  do {
    const [x, y] = candidates.shift()!;
    const current = grid[y][x];

    const neighbors = neighborCoords
      .map((n) => add(n, current.coord))
      .filter(([x, y]) =>
        x >= 0 &&
        y >= 0 &&
        x < grid[0].length &&
        y < grid.length
      )
      .map(([x, y]) => grid[y][x])
      .filter((node) => node.height <= current.height + 1);

    for (const neighbor of neighbors) {
      if (neighbor.distance > current.distance + 1) {
        neighbor.distance = current.distance + 1;
        candidates.push(neighbor.coord);
      }
    }
  } while (candidates.length > 0);

  return grid[endY][endX].distance;
};

const neighborCoords: Coord[] = [[0, 1], [1, 0], [-1, 0], [0, -1]];

const add = ([a1, a2]: Coord, [b1, b2]: Coord) => [a1 + b1, a2 + b2];

const print = (grid: Node[][], end: Coord, type: "d" | "h") => {
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    console.log(
      row.map((a, x) => {
        const char = a.distance === Infinity
          ? " "
          : true
          ? String.fromCharCode((a.distance % 50) + 50)
          : type === "h"
          ? String.fromCharCode(a.height + 50)
          : a.distance === Infinity
          ? "-"
          : String.fromCharCode(
            a.distance,
          );
        return x == end[0] && y == end[1] ? green(char) : char;
      }).join(""),
    );
  }
  console.log("------");
};
