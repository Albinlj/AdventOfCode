import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

Deno.test("example 1", () => {
  assertEquals(part1(readExample(18)), 64);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(18)), 4504);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(18)), 58);
});

type Coord = [number, number, number];

function part2(input: string): any {
  const points = input
    .split("\n")
    .map((a) =>
      a
        .split(",")
        .map((a) => parseInt(a))
    );

  const minMax = points.reduce(
    ([minX, minY, minZ, maxX, maxY, maxZ], [x, y, z]) => [
      Math.min(minX, x),
      Math.min(minY, y),
      Math.min(minZ, z),
      Math.max(maxX, x),
      Math.max(maxY, y),
      Math.max(maxZ, z),
    ],
    [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity],
  );
  const [minX, minY, minZ, maxX, maxY, maxZ] = minMax;
  console.log(minMax);

  const pointsSet = new Set(input.split("\n"));
  let totalSurfaceArea = 0;

  const visited = new Set<string>();
  const candidates: Coord[] = [[0, 0, 0]];

  while (candidates.length > 0) {
    // console.log(candidates.length);
    const [x, y, z] = candidates.pop()!;
    visited.add([x, y, z].join(","));

    console.log([x, y, z]);
    const neighbors = [
      [-1, 0, 0],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, -1],
      [0, 0, 1],
    ];

    for (const [X, Y, Z] of neighbors) {
      const neighborCoord: Coord = [x + X, y + Y, z + Z];
      const [nX, nY, nZ] = neighborCoord;

      const str = neighborCoord.join(",");
      if (pointsSet.has(str)) {
        totalSurfaceArea++;
        continue;
      }

      if (
        !visited.has(str) &&
        nX + 1 >= minX &&
        nY + 1 >= minY &&
        nZ + 1 >= minZ &&
        nX - 1 <= maxX &&
        nY - 1 <= maxY &&
        nZ - 1 <= maxZ
      ) {
        candidates.push(neighborCoord);
      }
    }
    console.log(visited.size);
  }

  return totalSurfaceArea;
}

function part1(input: string): any {
  const points = input
    .split("\n")
    .map((a) =>
      a
        .split(",")
        .map((a) => parseInt(a))
    );

  const set = new Set(input.split("\n"));
  let totalSurfaceArea = 0;

  for (const [x, y, z] of points) {
    const neighbors = [
      [-1, 0, 0],
      [1, 0, 0],
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, -1],
      [0, 0, 1],
    ];
    let neighborCount = 0;

    for (const [X, Y, Z] of neighbors) {
      if (set.has([x + X, y + Y, z + Z].join(","))) {
        neighborCount++;
      }
    }
    totalSurfaceArea += 6 - neighborCount;
  }

  return totalSurfaceArea;
}
