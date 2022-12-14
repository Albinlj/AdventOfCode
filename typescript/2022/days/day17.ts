import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(17), 2022), 3068);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(17), 2022), 3157);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(17), 1000000000000), 1514285714288);
});

Deno.test("part 2", () => {
  assertEquals(part2(readInput(17), 1000000000000), 1581449275319);
});

type Coord = [number, number];
type Piece = Coord[];

const formations: Piece[] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[1, 0], [0, 1], [1, 1], [1, 2], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
];

function part2(input: string, totalPieceDrops: number): any {
  const jetsLength = input.length;
  let jetIndex = -1;

  let shouldSpawn = true;
  let pieceIndex = -1;
  let pieceY = Infinity;
  let pieceX = Infinity;
  let highestPoint = -1;
  let pieceCount = 0;

  const lineLastPieceTouch = [];

  const rocks = new Set<string>();
  const lines: string[] = [];

  while (true) {
    if (shouldSpawn) {
      pieceIndex = (pieceIndex + 1) % 5;
      pieceCount++;
      pieceY = highestPoint + 4;
      pieceX = 2;
      shouldSpawn = false;
    }

    const piece = formations[pieceIndex];

    jetIndex = (jetIndex + 1) % jetsLength;
    const jet = input[jetIndex];
    const deltaX = jet === "<" ? -1 : 1;
    if (
      !(pieceX === 0 && deltaX === -1) &&
      !(deltaX === 1 && (pieceX + piece.at(-1)![0]) === 6) &&
      piece.every(([x, y]) =>
        !rocks.has((pieceX + x + deltaX) + "," + (pieceY + y))
      )
    ) {
      pieceX += deltaX;
    }

    const isGrounded = pieceY === 0 ||
      piece.some(([x, y]) => rocks.has((pieceX + x) + "," + (pieceY + y - 1)));

    if (!(isGrounded)) {
      pieceY--;
    } else {
      for (const [x, y] of piece) {
        rocks.add((pieceX + x) + "," + (pieceY + y));
        highestPoint = Math.max(highestPoint, pieceY + y);
        shouldSpawn = true;
      }

      const pieceYs = [...new Set(piece.map(([x, y]) => y + pieceY))];

      for (const y of pieceYs) {
        const linestr = [0, 1, 2, 3, 4, 5, 6]
          .map((x) => rocks.has([x, y].join(",")) ? "#" : ".")
          .join("");
        lines[y] = linestr;
        lineLastPieceTouch[y] = pieceCount;
      }

      const potentialBottomz = lines.reduce((acc, curr, i) => {
        return i < pieceY - 2 &&
            i > pieceY / 2 &&
            curr === lines[pieceY] &&
            i != pieceY
          ? [...acc, i]
          : acc;
      }, [] as number[]);

      for (const zoneBottom of potentialBottomz) {
        const zoneHeight = pieceY - zoneBottom;

        for (let i = pieceY - 1; i !== zoneBottom; i--) {
          const currentCheck = lines[i];
          const nextZoneThing = lines[i - zoneHeight];
          if (currentCheck != nextZoneThing) break;
          if (i - 1 === zoneBottom) {
            const lastPieceCount = lineLastPieceTouch[i - 1];
            const zonePieceCount = pieceCount - lastPieceCount;
            const remainingPieces = totalPieceDrops - pieceCount;

            if (remainingPieces % zonePieceCount === 0) {
              const remainingPieces = totalPieceDrops - pieceCount;
              const times = Math.floor(remainingPieces / zonePieceCount);
              return highestPoint + zoneHeight * times + 1;
            }
          }
        }
      }

      if (pieceCount === totalPieceDrops) break;
    }
  }
}

function part1(input: string, rocksCount: number): any {
  const jetsLength = input.length;
  let jetIndex = -1;

  let shouldSpawn = true;
  let pieceIndex = -1;
  let pieceY = Infinity;
  let pieceX = Infinity;
  let highestPoint = -1;
  let pieceCount = 0;

  const rocks = new Set<string>();

  while (true) {
    jetIndex = (jetIndex + 1) % jetsLength;
    const jet = input[jetIndex];
    if (shouldSpawn) {
      pieceIndex = (pieceIndex + 1) % 5;
      pieceCount++;
      pieceY = highestPoint + 4;
      pieceX = 2;
      shouldSpawn = false;
    }

    const piece = formations[pieceIndex];
    const deltaX = jet === "<" ? -1 : 1;
    if (
      !(pieceX === 0 && deltaX === -1) &&
      !(deltaX === 1 && (pieceX + piece.at(-1)![0]) === 6) &&
      piece.every(([x, y]) =>
        !rocks.has((pieceX + x + deltaX) + "," + (pieceY + y))
      )
    ) {
      pieceX += deltaX;
    }

    const isGrounded = pieceY === 0 ||
      piece.some(([x, y]) => rocks.has((pieceX + x) + "," + (pieceY + y - 1)));

    if (isGrounded) {
      for (const [x, y] of piece) {
        rocks.add((pieceX + x) + "," + (pieceY + y));
        highestPoint = Math.max(highestPoint, pieceY + y);
        shouldSpawn = true;
      }

      if (pieceCount === rocksCount) break;
    } else {
      pieceY--;
    }
  }
  return highestPoint + 1;
}
