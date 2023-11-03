import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import cloneDeep from "https://deno.land/x/denodash@0.1.3/src/lang/cloneDeep.ts";

Deno.test("part 1", () => {
  assertEquals(part1(readExample(24)), 18);
});

const dirs: Record<Direction, [number, number]> = {
  ">": [1, 0],
  "v": [0, 1],
  "^": [0, -1],
  "<": [-1, 0],
};

const diris = Object.values(dirs);

function part1(input: string): any {
  const { blizzards, width, height } = parseMap(input);

  const [x, y] = [0, -1];

  return recurse(x, y, width, height, blizzards, 0);
}

const recurse = (
  x: number,
  y: number,
  width: number,
  height: number,
  blizzards: Blizzard[],
  moves: number,
): number => {
  if (x === width - 1 && y === height - 1) {
    return moves;
  }

  console.log(x, y);

  const nextMoves = [
    ...diris
      .map(([dirX, dirY]) => [x + dirX, y + dirY]),
    [
      x,
      y,
    ],
  ]
    .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height);
  if (moves < 3) {
    console.log(moves, nextMoves);
  }

  for (const blizz of blizzards) {
    const dir = blizz[1];
    const move = dirs[dir];

    const newX = (blizz[0][0] + move[0] + width) % width;
    const newY = (blizz[0][1] + move[1] + width) % height;

    blizz[0][0] = newX;
    blizz[0][1] = newY;

    const testmovei = nextMoves.findIndex(([x, y]) => x === newX && y === newY);
    if (testmovei !== -1) {
      nextMoves.splice(testmovei, 1);
    }

    if (nextMoves.length === 0) {
      return -1;
    }
  }

  console.log(nextMoves);

  return nextMoves.map(
    ([x, y]) =>
      recurse(
        x,
        y,
        width,
        height,
        cloneDeep(blizzards),
        moves + 1,
      ),
  ).filter((a) => a != 1).find((a) => a !== -1) ?? -1;
};

function parseMap(input: string) {
  const blizzards: Blizzard[] = [];

  const rows = input.split("\n");

  const width = rows[0].length;
  const height = rows.length;

  for (let y = 0; y < height; y++) {
    const row = rows[y];
    for (let x = 0; x < width; x++) {
      const char = row[x];
      if (char !== ".") {
        blizzards.push([[x, y], char as Direction]);
      }
    }
  }

  return {
    blizzards,
    width,
    height,
    start: [0, -1],
    finish: [width - 1, height],
  };
}

type Direction = ">" | "<" | "v" | "^";

type Blizzard = [[number, number], Direction];
