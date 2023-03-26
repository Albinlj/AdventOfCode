import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { map } from "https://deno.land/x/fae@v1.1.1/map.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readInput(23)), 110);
});

// Deno.test("part 1", () => {
//   assertEquals(part1(readInput(22)), 103224);
// });

const part1 = (input: string) => {
  let elves = parseElves(input);

  console.log(elves);

  const dirs = [
    [
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    [
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
    [
      [1, -1],
      [1, 0],
      [1, 1],
    ],
  ];

  for (let i = 0; i < 10; i++) {
    const moves = new Map();

    // elves:
    for (const elf of elves.values()) {
      const [x, y] = elf.split(",").map((a) => parseInt(a));

      const openDirs = dirs.map((testPositions) =>
        testPositions.every(
          ([testX, testY]) => {
            const testCoord = [x + testX, y + testY].join(",");
            // console.log([x, y], testCoord, [testX, testY]);
            return !elves.includes(testCoord);
          },
        )
      );

      if (openDirs.every((a) => a) || openDirs.every((a) => !a)) {
        moves.set(elf, elf);
      } else {
        const dirIndex = openDirs.findIndex((a) => a);

        const [a, b] = dirs[dirIndex][1];

        moves.set(
          elf,
          [x + a, y + b].join(","),
        );
      }
    }

    // console.log(moves);

    const multiples = [...moves.values()]
      .filter(
        (dest, i, arr) => arr.findIndex((destA) => destA === dest) !== i,
      );
    // console.log(multiples);
    // console.log(multiples);

    elves = [...moves.entries()].map(([elf, dest]) =>
      (multiples.includes(dest)) ? elf : dest
    );

    // console.log(elves);

    dirs.push(dirs.shift()!);
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const elf of elves) {
    const [x, y] = elf.split(",").map((a) => parseInt(a));
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }
  console.log(minX, maxX, minY, maxY);

  const area = (maxX - minX + 1) * (maxY - minY + 1) - elves.length;
  console.log(area);

  return area;
};

function parseElves(input: string) {
  const elves = [];

  const rows = input.split("\n");

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const char = row[x];
      if (char === "#") {
        elves.push(x + "," + y);
      }
    }
  }
  return elves;
}
