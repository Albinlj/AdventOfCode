import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import { range, rangeUntil, zip } from "https://deno.land/x/fae@v1.1.1/mod.ts";

// Deno.test("example 1", () => {
//   assertEquals(part1(readExample(22)), 6032);
// });

// Deno.test("input 1", () => {
//   assertEquals(part1(readInput(22)), 103224);
// });

Deno.test("example 2", () => {
  assertEquals(part2(readInput(22)), 5031);
});

//#region

const ea = zip(
  zip(rangeUntil(50, 100), Array(50).fill(-1)),
  zip(Array(50).fill(0), rangeUntil(150, 200))
    .map((a) => [...a, 0]),
);

const fa = zip(
  zip(rangeUntil(100, 150), Array(50).fill(-1)),
  zip(rangeUntil(0, 50), Array(50).fill(199))
    .map((a) => [...a, 3]),
);

const fc = zip(
  zip(Array(50).fill(150), rangeUntil(0, 50)),
  zip(Array(50).fill(99), rangeUntil(100, 150).toReversed())
    .map((a) => [...a, 2]),
);

const fd = zip(
  zip(rangeUntil(100, 150), Array(50).fill(50)),
  zip(Array(50).fill(99), rangeUntil(50, 100))
    .map((a) => [...a, 2]),
);

const df = zip(
  zip(Array(50).fill(100), rangeUntil(50, 100)),
  zip(rangeUntil(100, 150), Array(50).fill(49))
    .map((a) => [...a, 3]),
);

const cf = zip(
  zip(Array(50).fill(100), rangeUntil(100, 150)),
  zip(Array(50).fill(149), rangeUntil(0, 50).toReversed())
    .map((a) => [...a, 2]),
);

const ca = zip(
  zip(rangeUntil(50, 100), Array(50).fill(150)),
  zip(Array(50).fill(49), rangeUntil(150, 200))
    .map((a) => [...a, 3]),
);

const ac = zip(
  zip(Array(50).fill(50), rangeUntil(150, 200)),
  zip(rangeUntil(50, 100), Array(50).fill(149))
    .map((a) => [...a, 3]),
);

const af = zip(
  zip(rangeUntil(0, 50), Array(50).fill(200)),
  zip(rangeUntil(100, 150), Array(50).fill(0))
    .map((a) => [...a, 1]),
);

const ae = zip(
  zip(Array(50).fill(-1), rangeUntil(150, 200)),
  zip(rangeUntil(50, 100), Array(50).fill(0))
    .map((a) => [...a, 1]),
);

const be = zip(
  zip(Array(50).fill(-1), rangeUntil(100, 150)),
  zip(Array(50).fill(50), rangeUntil(0, 50).toReversed())
    .map((a) => [...a, 0]),
);

const bd = zip(
  zip(rangeUntil(0, 50), Array(50).fill(99)),
  zip(Array(50).fill(50), rangeUntil(50, 100))
    .map((a) => [...a, 0]),
);

const db = zip(
  zip(Array(50).fill(49), rangeUntil(50, 100)),
  zip(rangeUntil(0, 50), Array(50).fill(100))
    .map((a) => [...a, 1]),
);

const eb = zip(
  zip(Array(50).fill(49), rangeUntil(0, 50)),
  zip(Array(50).fill(0), rangeUntil(100, 150).toReversed())
    .map((a) => [...a, 2]),
);

const hej = new Map(
  [ea, fa, fc, fd, df, cf, ca, ac, af, ae, be, bd, db, eb]
    .flat()
    .map(
      ([[x, y], b]) => [x + "," + y, b],
    ),
);

//#endregion
// console.log(hej);

function part2(input: string): any {
  const [rawMap, [rawPath]] = input.split("\n\n").map((line) =>
    line.split("\n")
  );

  // 1264 SHOULD BE LOW?!
  // 20104 low
  // 18465 low
  // 685119 high

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

  console.log(hasch);

  const walks = rawPath.match(/\d+/g)?.map(Number)!;
  const turns = rawPath.match(/[RL]+/g)!;

  let x = [...rawMap[0]].findIndex((ch) => ch !== " ");
  let y = 0;
  let facing = 0;

  for (let i = 0; i < walks.length; i++) {
    const length = walks[i];

    for (let step = 1; step <= length; step++) {
      const dx = facing === 0 ? 1 : facing === 2 ? -1 : 0;
      const dy = facing === 1 ? 1 : facing === 3 ? -1 : 0;

      let newx = x;
      let newy = y;
      let newFacing = facing;

      newx += dx;
      newy += dy;

      const wrapped = hej.get(x + "," + y);
      if (wrapped) {
        const [wrappedx, wrappedy, orient] = wrapped;
        newx = wrappedx;
        newy = wrappedy;
        newFacing = orient;
      }

      if (hasch.has(x + "," + y)) {
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

  console.log(x, y, facing);

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
