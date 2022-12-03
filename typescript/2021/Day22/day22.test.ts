import { max, min } from "ramda";
import { getExample, getInput } from "./../utils/getInput";
// https://adventofcode.com/2021/day/22
// on x=10..10,y=10..10,z=10..10

type Action = "on" | "off";
type Reng = [number, number];
type Step = { action: Action; coords: [Reng, Reng, Reng] };

const part2 = (input: string) => {
  const steps = input.split("\n").map(parseLine);
  const set = new Set();

  for (const step of steps) {
    const [[x1, x2], [y1, y2], [z1, z2]] = step.coords;

    for (let x = x1; x <= x2; x++) {
      for (let y = y1; y <= y2; y++) {
        for (let z = z1; z <= z2; z++) {
          const hash = `${x},${y},${z}`;
          if (step.action === "on") {
            set.add(hash);
          } else {
            set.delete(hash);
          }
        }
      }
    }
  }

  return set.size;
};

test.only("example2", () => {
  expect(part2(getExample(__dirname))).toEqual(590784);
});

const part1 = (input: string) => {
  const steps = input.split("\n").map(parseLine);
  const set = new Set();

  for (const step of steps) {
    const maxi = (num: number) => max(-50, num);

    const [[x1, x2], [y1, y2], [z1, z2]] = step.coords;
    const toX = min(x2, 50);
    const toY = min(y2, 50);
    const toZ = min(z2, 50);

    for (let x = maxi(x1); x <= toX; x++) {
      for (let y = maxi(y1); y <= toY; y++) {
        for (let z = maxi(z1); z <= toZ; z++) {
          const hash = `${x},${y},${z}`;
          if (step.action === "on") {
            set.add(hash);
          } else {
            set.delete(hash);
          }
        }
      }
    }
  }

  return set.size;
};

test("example1", () => {
  expect(part1(getExample(__dirname))).toEqual(590784);
});

test("part1", () => {
  expect(part1(getInput(__dirname))).toEqual(591365);
});

const parseLine = (line: string): Step => {
  const [action, rest] = line.split(" ");
  const coords = rest.split(",").map((coord) =>
    coord
      .slice(2)
      .split("..")
      .map((a) => parseInt(a))
  );
  // const [[x1, x2], [y1, y2], [z1, z2]] = coords;

  return { action, coords } as Step;
};

test("parseLine", () => {
  expect(parseLine("on x=11..12,y=13..14,z=15..16")).toEqual({
    action: "on",
    coords: [
      [11, 12],
      [13, 14],
      [15, 16],
    ],
  });
  expect(
    parseLine("off x=-54112..-39298,y=-85059..-49293,z=-27449..7877")
  ).toEqual({
    action: "off",
    coords: [
      [-54112, -39298],
      [-85059, -49293],
      [-27449, 7877],
    ],
  });
});
