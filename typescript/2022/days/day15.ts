import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { dump, readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(15), 10), 26);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(15), 2000000), 4961647);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(15), 20), 56000011);
});

// Deno.test("part 2", () => {
//   assertEquals(part2(readInput(15), 4_000_000), 12274327017867);
// });

function part1(input: string, row: number): any {
  const parsed = parse(input);

  const [coveredSpots] = calculateBeaconCoverageOnRow(parsed, row)
    .sort(({ spectrum: a }, { spectrum: b }) => a![0] - b[0])
    .reduce(([spots, rightMost], { spectrum: [l, r], y }, i) => {
      if (i === 0) return [Math.abs(l - r) + 1, r];
      return [
        spots + (
          l > rightMost
            ? (Math.abs(l - r) + 1)
            : r <= rightMost
            ? 0
            : dump(Math.abs(rightMost - r))
        ),
        Math.max(rightMost, r),
      ];
    }, [0, 0]);

  return coveredSpots - 1;
}

function part2(input: string, max: number) {
  const parsed = parse(input);

  for (let y = 0; y <= max; y++) {
    const x = findEmptyXOnRow(y, parsed);

    if (x) return x * 4_000_000 + y;
  }
}

function findEmptyXOnRow(
  row: number,
  parsed: number[][],
): any {
  const stuff = calculateBeaconCoverageOnRow(parsed, row)
    .sort(({ spectrum: a }, { spectrum: b }) => a![0] - b[0]);

  let rightmost;
  for (const { spectrum: [l, r] } of stuff) {
    if (rightmost === undefined) {
      rightmost = r;
      continue;
    }

    if (l - 2 === rightmost) {
      return l - 1;
    }
    rightmost = Math.max(r, rightmost);
  }
}

function calculateBeaconCoverageOnRow(parsed: number[][], row: number) {
  return parsed
    .map(([x, y, bx, by]) => {
      const range = Math.abs(x - bx) + Math.abs(y - by);
      const distToRow = Math.abs(row - y);
      const remaining = range - distToRow;
      const spectrum = remaining < 0
        ? undefined
        : [x - remaining, x + remaining].toSorted((a, b) => a - b);

      return ({
        x,
        bx,
        distToRow,
        spectrum,
      });
    })
    .filter((w) => w.spectrum);
}

function parse(input: string) {
  return input
    .split("\n")
    .map((line) =>
      line
        .match(/-?\d+/g)!
        .map((num) => parseInt(num))
    );
}
