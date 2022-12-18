import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { dump, readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(17), 2022), 3068);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(17), 2022), 3157);
});

Deno.test("example 2", () => {
  assertEquals(part1(readExample(17), 1000000000000), 1514285714288);
});

type Coord = [number, number];
type Piece = Coord[];

function part1(input: string, rocksCount: number): any {
  const jetsLength = input.length;
  let jetIndex = -1;

  const formations: Piece[] = [
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [0, 1], [1, 1], [1, 2], [2, 1]],
    [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]],
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
  ];

  let shouldSpawn = true;
  let pieceIndex = -1;
  let pieceY = Infinity;
  let pieceX = Infinity;
  let highestPoint = -1;
  let pieceCount = 0;
  let cycle = -1;

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

      if (pieceIndex === 0 && jetIndex === 0) {
        console.log("NEW CYCLE!", cycle);
      }
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

      if (
        [...new Set(piece.map(([x, y]) => y))].some(
          (
            y,
          ) => ([0, 1, 2, 3, 4, 5, 6].every((dx) =>
            rocks.has(dx + "," + (y + pieceX))
          )),
        )
      ) {
        console.log("FULL ROW!!");
      }

      if (pieceCount === rocksCount) {
        break;
      }
    } else {
      pieceY--;
    }
  }
  return highestPoint + 1;
  return rocks;
}
