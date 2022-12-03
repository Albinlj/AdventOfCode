import { toInt } from "./../utils/toInt";
import { getInput, getExample } from "../utils/getInput";
import { curry, map, range } from "ramda";
import { max, min, sumBy } from "lodash";
import { pipe } from "fp-ts/lib/function";

const input = getInput(__dirname).split(",").map<Crab>(toInt);
const example = getExample(__dirname).split(",").map<Crab>(toInt);

type Crab = number;

//part1
const totalFuelNeeded = curry((crabs: Crab[], goal: number) =>
  sumBy(crabs, (c) => Math.abs(goal - c))
);

const optimalFuel = (crabs: Crab[]) =>
  pipe(range(min(crabs), max(crabs)), map(totalFuelNeeded(crabs)), min);

//part2
const fuelNeeded2 = (from: number, to: number) => {
  const diff = Math.abs(to - from);
  return (diff * (diff + 1)) / 2;
};

const totalFuelNeeded2 = curry((crabs: Crab[], goal: number) =>
  sumBy(crabs, (c) => fuelNeeded2(c, goal))
);

const optimalFuel2 = (crabs: Crab[]) =>
  pipe(range(min(crabs), max(crabs)), map(totalFuelNeeded2(crabs)), min);

test("part 2", () => {
  expect(fuelNeeded2(7, 5)).toBe(3);
  expect(fuelNeeded2(16, 5)).toBe(66);

  expect(totalFuelNeeded2(example, 5)).toBe(168);
  expect(totalFuelNeeded2(example, 2)).toBe(206);

  expect(optimalFuel2(example)).toBe(168);
  expect(optimalFuel2(input)).toBe(96678050);
});

test("part 1", () => {
  expect(totalFuelNeeded(example, 2)).toBe(37);
  expect(totalFuelNeeded(example, 1)).toBe(41);
  expect(totalFuelNeeded(example, 3)).toBe(39);
  expect(totalFuelNeeded(example, 10)).toBe(71);

  expect(optimalFuel(example)).toBe(37);
  expect(optimalFuel(input)).toBe(337833);
});
