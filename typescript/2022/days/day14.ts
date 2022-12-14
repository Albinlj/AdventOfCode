import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example1", () => {
  assertEquals(pourSand(readExample(14), 1), 24);
});
Deno.test("part1", () => {
  assertEquals(pourSand(readInput(14), 1), 901);
});
Deno.test("example2", () => {
  assertEquals(pourSand(readExample(14), 2), 93);
});
Deno.test("part2", () => {
  assertEquals(pourSand(readInput(14), 2), 24589);
});

type Coord = [number, number];

function pourSand(input: string, part: 1 | 2) {
  const [stones, greatest] = parseStones(input);

  const stonesAndSand = new Set(stones);
  const canSettle = ([x, y]: Coord) =>
    stonesAndSand.has(x + "," + y) ||
    (part === 2 && y === greatest + 2);

  speckOfSand:
  while (true) {
    let x = 500;
    let y = 0;

    falling:
    while (true) {
      if ((part === 1 && y === greatest)) break speckOfSand;
      if (!canSettle([x, y + 1])) {
        y++;
        continue;
      } else if (!canSettle([x - 1, y + 1])) {
        x--;
        y++;
        continue;
      } else if (!canSettle([x + 1, y + 1])) {
        x++;
        y++;
        continue;
      } else {
        stonesAndSand.add(x + "," + y);
        if (part === 2 && y === 0) break speckOfSand;
        else break falling;
      }
    }
  }

  return stonesAndSand.size - stones.size;
}

function parseStones(input: string) {
  const lines = input
    .split("\n")
    .map((line) =>
      line
        .split(" -> ")
        .map((coord) =>
          coord
            .split(",")
            .map((num) => parseInt(num)) as Coord
        )
    );

  const stones = new Set<string>();
  let greatestY = -Infinity;

  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      let [x, y] = line[i];
      const [bx, by] = line[i + 1];
      stones.add(x + "," + y);

      do {
        x += Math.sign(bx - x);
        y += Math.sign(by - y);
        stones.add(x + "," + y);
        if (y > greatestY) greatestY = y;
      } while (y != by || x != bx);
    }
  }

  return [stones, greatestY] as const;
}
