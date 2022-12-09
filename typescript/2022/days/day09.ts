// deno-lint-ignore-file no-fallthrough
import { green, red } from "https://deno.land/std@0.166.0/fmt/colors.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example", () => {
  const example = readExample(9);
  assertEquals(part1(example), 13);
});

Deno.test("part1", () => {
  const example = readInput(9);
  assertEquals(part1(example), 6269);
});

Deno.test("part2", () => {
  const example = readInput(9);
  assertEquals(part2(example), 2557);
});

type Action = ["U" | "D" | "L" | "R", number];

function part1(input: string): any {
  const actions = input
    .split("\n").map((line) => {
      const [dir, length] = line.split(" ");
      return [dir, parseInt(length)] as unknown as Action;
    });

  let hx = 0;
  let hy = 0;
  let tx = 0;
  let ty = 0;

  const dirs = new Set<string>();

  for (const [dir, len] of actions) {
    for (let i = 0; i < len; i++) {
      switch (dir) {
        case "L":
          hx -= 2;
        case "R":
          {
            hx++;
            const dx = hx - tx;
            if (Math.abs(dx) == 2) {
              tx += dx / 2;
              ty = hy;
            }
          }
          break;
        case "U":
          hy += 2;
        case "D": {
          hy--;
          const dy = hy - ty;
          if (Math.abs(dy) == 2) {
            ty += dy / 2;
            tx = hx;
          }
        }
      }

      dirs.add(`${tx},${ty}`);
    }
  }

  return dirs.size;
}

function part2(input: string): any {
  const actions = input
    .split("\n").map((line) => {
      const [dir, length] = line.split(" ");
      return [dir, parseInt(length)] as unknown as Action;
    });

  const knots = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  const dirs = new Set<string>();

  for (const [dir, len] of actions) {
    for (let i = 0; i < len; i++) {
      switch (dir) {
        case "L":
          knots[0][0]--;
          break;
        case "R":
          knots[0][0]++;
          break;
        case "U":
          knots[0][1]++;
          break;
        case "D":
          knots[0][1]--;
          break;
      }

      for (let j = 1; j < knots.length; j++) {
        const moves = {
          "2,0": [1, 0],
          "2,1": [1, 1],
          "2,2": [1, 1],
          "1,2": [1, 1],
          "0,2": [0, 1],
          "-1,2": [-1, 1],
          "-2,2": [-1, 1],
          "-2,1": [-1, 1],
          "-2,0": [-1, 0],
          "-2,-1": [-1, -1],
          "-2,-2": [-1, -1],
          "-1,-2": [-1, -1],
          "0,-2": [0, -1],
          "1,-2": [1, -1],
          "2,-2": [1, -1],
          "2,-1": [1, -1],
        } as any;

        const [nhx, nhy] = knots[j - 1];
        const [otx, oty] = knots[j];
        const [dx, dy] = [nhx - otx, nhy - oty];

        const move = dx.toString() + "," + dy.toString();
        const [mx, my] = moves[move] ?? [0, 0];

        knots[j] = [otx + mx, oty + my];
      }

      const [tx, ty] = knots.at(-1)!;
      const coord = `${tx},${ty}`;
      dirs.add(coord);
    }
  }
  return dirs.size;
}
