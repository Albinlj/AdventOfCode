import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  const example = readExample(8);
  assertEquals(part1(example), 21);
});

Deno.test("part1", () => {
  const input = readInput(8);
  assertEquals(part1(input), 1538);
});

Deno.test("part2 example", () => {
  const input = readExample(8);
  assertEquals(part2(input), 8);
});

Deno.test("part2", () => {
  const input = readInput(8);
  assertEquals(part2(input), 1538);
});

const part1 = (input: string) => {
  const grid = input.split("\n")
    .map((line) =>
      line.split("")
        .map((a) => parseInt(a))
    );

  let total = 0;

  const width = grid.at(0)!.length;
  const height = grid.length;

  for (let x = 0; x < width; x++) {
    y:
    for (let y = 0; y < height; y++) {
      const me = grid[y][x];

      for (let lookX = x - 1; lookX >= -1; lookX--) {
        if (lookX === -1) {
          total++;
          continue y;
        }
        if (grid[y][lookX] >= me) {
          break;
        }
      }

      for (let lookX = x + 1; lookX <= width; lookX++) {
        if (lookX === width) {
          total++;
          continue y;
        }
        if (grid[y][lookX] >= me) {
          break;
        }
      }

      for (let lookY = y - 1; lookY >= -1; lookY--) {
        if (lookY === -1) {
          total++;
          continue y;
        }
        if (grid[lookY][x] >= me) {
          break;
        }
      }

      for (let lookY = y + 1; lookY <= height; lookY++) {
        if (lookY === height) {
          total++;
          continue y;
        }
        if (grid[lookY][x] >= me) {
          break;
        }
      }
    }
  }

  return total;
};

const part2 = (input: string) => {
  const grid = input.split("\n")
    .map((line) =>
      line.split("")
        .map((a) => parseInt(a))
    );

  const width = grid.at(0)!.length;
  const height = grid.length;

  const scores = [];

  for (let x = 1; x < width - 1; x++) {
    for (let y = 1; y < height - 1; y++) {
      const me = grid[y][x];

      let left = 1;
      let right = 1;
      let up = 1;
      let down = 1;

      while (true) {
        if (x - left == 0 || grid[y][x - left] >= me) {
          break;
        }
        left++;
      }

      while (true) {
        if (x + right == width - 1 || grid[y][x + right] >= me) {
          break;
        }
        right++;
      }

      while (true) {
        if (y - up == 0 || grid[y - up][x] >= me) {
          break;
        }
        up++;
      }

      while (true) {
        if (y + down == height - 1 || grid[y + down][x] >= me) {
          break;
        }
        down++;
      }

      scores.push(left * right * up * down);
    }
  }
  return (scores).sort((a, b) => b - a).at(0);
};
