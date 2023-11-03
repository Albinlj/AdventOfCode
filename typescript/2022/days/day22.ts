import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readInput } from "../utilities.ts";
import { rangeUntil, zip } from "https://deno.land/x/fae@v1.1.1/mod.ts";
import { green, red } from "https://deno.land/std@0.166.0/fmt/colors.ts";

// Deno.test("example 1", () => {
//   assertEquals(part1(readExample(22)), 6032);
// });

// Deno.test("part 1", () => {
//   assertEquals(part1(readInput(22)), 103224);
// });

Deno.test("part 2", () => {
  assertEquals(part2(readInput(22)), 5031);
});

//#region

const ea = zip(
  rangeUntil(50, 100).map((x) => [x, 0, 3]),
  rangeUntil(150, 200).map((y) => [0, y, 0]),
);

const fa = zip(
  rangeUntil(100, 150).map((x) => [x, 0, 3]),
  rangeUntil(0, 50).map((x) => [x, 199, 3]),
);

const fc = zip(
  rangeUntil(0, 50).map((y) => [149, y, 0]),
  rangeUntil(100, 150).toReversed().map((y) => [99, y, 2]),
);

const fd = zip(
  rangeUntil(100, 150).map((x) => [x, 49, 1]),
  rangeUntil(50, 100).map((y) => [99, y, 2]),
);

const df = zip(
  rangeUntil(50, 100).map((y) => [99, y, 0]),
  rangeUntil(100, 150).map((x) => [x, 49, 3]),
);

const cf = zip(
  rangeUntil(100, 150).map((y) => [99, y, 0]),
  rangeUntil(0, 50).toReversed().map((y) => [149, y, 2]),
);

const ca = zip(
  rangeUntil(50, 100).map((x) => [x, 149, 1]),
  rangeUntil(150, 200).map((y) => [49, y, 3]),
);

const ac = zip(
  rangeUntil(150, 200).map((y) => [49, y, 0]),
  rangeUntil(50, 100).map((x) => [x, 149, 3]),
);

const af = zip(
  rangeUntil(0, 50).map((x) => [x, 199, 1]),
  rangeUntil(100, 150).map((x) => [x, 0, 1]),
);

const ae = zip(
  rangeUntil(150, 200).map((y) => [0, y, 2]),
  rangeUntil(50, 100).map((x) => [x, 0, 1]),
);

const be = zip(
  rangeUntil(100, 150).map((y) => [0, y, 2]),
  rangeUntil(0, 50).toReversed().map((y) => [50, y, 0]),
);

const bd = zip(
  rangeUntil(0, 50).map((x) => [x, 100, 3]),
  rangeUntil(50, 100).map((y) => [50, y, 0]),
);

const db = zip(
  rangeUntil(50, 100).map((y) => [50, y, 2]),
  rangeUntil(0, 50).map((x) => [x, 100, 1]),
);

const eb = zip(
  rangeUntil(0, 50).map((y) => [50, y, 2]),
  rangeUntil(100, 150).toReversed().map((y) => [0, y, 2]),
);

const hej = new Map(
  [ea, fa, fc, fd, df, cf, ca, ac, af, ae, be, bd, db, eb]
    .flat()
    .map(
      ([a, b]) => [a.join(), b],
    ),
);

//#endregion

function part2(input: string): any {
  const [rawMap, [rawPath]] = input.split("\n\n").map((line) =>
    line.split("\n")
  );

  // 1264 SHOULD BE LOW?!
  // 20104 low
  // 18465 low
  // 685119 high
  // 188082 no

  //  ef
  //  d
  // bc
  // a

  const hasch = new Set();
  const width = Math.max(...rawMap.map((line) => line.length));
  for (let y = 0; y < rawMap.length; y++) {
    const row = rawMap[y];
    for (let x = 0; x < width; x++) {
      if (row.at(x) === "#") {
        hasch.add(x + "," + y);
      }
    }
  }

  const walks = rawPath.match(/\d+/g)?.map(Number)!;
  const turns = rawPath.match(/[RL]+/g)!;

  let x = [...rawMap[0]].findIndex((ch) => ch !== " ");
  let y = 0;
  let facing = 0;

  for (let i = 0; i < walks.length; i++) {
    const length = walks[i];
    const lookMin = 116;
    const lookMax = 118;
    if (i <= lookMax && i >= lookMin) {
      console.log(red(length.toString()));
    }

    for (let step = 1; step <= length; step++) {
      if (i <= lookMax && i >= lookMin) {
        console.log(x, y, facing);
      }
      const dx = facing === 0 ? 1 : facing === 2 ? -1 : 0;
      const dy = facing === 1 ? 1 : facing === 3 ? -1 : 0;

      let newx = x;
      let newy = y;
      let newFacing = facing;

      const wrapped = hej.get([x, y, facing].join());
      if (wrapped) {
        console.log(green(i.toString()));
        if (i <= lookMax && i >= lookMin) {
          console.log(wrapped);
        }
        const [wrappedx, wrappedy, orient] = wrapped;
        newx = wrappedx;
        newy = wrappedy;
        newFacing = orient;
      } else {
        newx += dx;
        newy += dy;
      }

      if (hasch.has(newx + "," + newy)) {
        if (i <= lookMax && i >= lookMin) {
          console.log("stop!");
        }
        break;
      }

      x = newx;
      y = newy;
      facing = newFacing;
    }

    const turn = turns.at(i);
    if (turn) {
      facing = ((facing + (turn === "R" ? 1 : -1)) + 4) % 4;
    }
  }

  return (y + 1) * 1000 + (x + 1) * 4 + facing;
}

function part1(input: string): any {
  const [rawMap, [rawPath]] = input.split("\n\n").map((line) =>
    line.split("\n")
  );

  const walks = rawPath.match(/\d+/g)?.map(Number)!;
  const turns = rawPath.match(/[RL]+/g)!;

  const rows = rawMap
    .map(
      (line) => [[...line].findIndex((ch) => ch !== " "), line.trim()] as const,
    );
  const cols = rangeUntil(0, Math.max(...rawMap.map((a) => a.length))).map(
    (x) => {
      return rangeUntil(0, rawMap.length).map((y) => rawMap[y][x]).join("");
    },
  ).map(
    (line) => [[...line].findIndex((ch) => ch !== " "), line.trim()] as const,
  );

  const get = ((x: number, y: number) => {
    const [start, row] = rows[y]!;
    return row[x - start];
  });

  let x = [...rawMap[0]].findIndex((ch) => ch !== " ");
  let y = 0;
  let facing = 0;

  for (let i = 0; i < walks.length; i++) {
    const length = walks[i];

    const dx = facing === 0 ? 1 : facing === 2 ? -1 : 0;
    const dy = facing === 1 ? 1 : facing === 3 ? -1 : 0;

    if (dx) {
      const [startX, row] = rows[y];
      let newx = x;
      for (let step = 1; step <= length; step++) {
        newx = (((x + 1 * dx - startX) + row.length) % row.length) +
          startX;
        const ch = get(newx, y);
        if (ch === "#") {
          break;
        } else {
          x = newx;
        }
      }
    } else if (dy) {
      const [startY, col] = cols[x];
      let newy = y;
      for (let step = 1; step <= length; step++) {
        newy = (((y + 1 * dy - startY) + col.length) % col.length) +
          startY;
        const ych = get(x, newy);
        if (ych === "#") {
          break;
        } else {
          y = newy;
        }
      }
    }

    const turn = turns.at(i);
    if (turn) {
      facing = ((facing + (turn === "R" ? 1 : -1)) + 4) % 4;
    }
  }

  return (y + 1) * 1000 + (x + 1) * 4 + facing;
}
