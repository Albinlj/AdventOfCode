import { toInt } from "../utils/toInt";
import { getExample, getInput } from "../utils/getInput";
import { span } from "../utils/span";
import { sum } from "lodash";
import { memoizeWith } from "ramda";

const input = getInput(__dirname);
const example = getExample(__dirname);

const part1 = (fishes: number[], days: number) => {
  return span(1, days).reduce(simulateDay, fishes);
};

const simulateDay = (fishes: number[]) => {
  return fishes.flatMap((f) => (f === 0 ? [6, 8] : [f - 1]));
};

const part2 = (fishes: number[], days: number) => {
  return sum(fishes.map((f) => simulateDayRecursive(f, days)));
};

const simulateDayRecursive = memoizeWith(
  (fish, daysLeft) => `${fish}-${daysLeft}`,
  (fish, daysLeft) =>
    fish >= daysLeft
      ? 1
      : simulateDayRecursive(6, daysLeft - fish - 1) +
        simulateDayRecursive(8, daysLeft - fish - 1)
);

test("simulate day", () => {
  expect(simulateDay([0])).toEqual([6, 8]);
});

test("part 1", () => {
  const fish = example.split(",").map(toInt);
  expect(part1(fish, 18).length).toEqual(26);
  expect(part1(fish, 80).length).toEqual(5934);

  const inputFish = input.split(",").map(toInt);
  expect(part1(inputFish, 80).length).toEqual(386536);
});

test("part 2", () => {
  const exampleFishes = example.split(",").map(toInt);
  expect(simulateDayRecursive(1, 0)).toEqual(1);
  expect(simulateDayRecursive(0, 0)).toEqual(1);
  expect(simulateDayRecursive(0, 1)).toEqual(2);
  expect(simulateDayRecursive(0, 7)).toEqual(2);
  expect(simulateDayRecursive(0, 8)).toEqual(3);
  expect(simulateDayRecursive(7, 6)).toEqual(1);

  expect(part2(exampleFishes, 18)).toEqual(26);
  expect(part2(exampleFishes, 80)).toEqual(5934);

  const inputFishes = input.split(",").map(toInt);
  expect(part2(inputFishes, 256)).toEqual(1732821262171);
});
