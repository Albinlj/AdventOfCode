import { binaryString } from "./../utils/bitStrings";
import { getExample } from "../utils/getInput";
import { getInput } from "../utils/getInput";
import { span } from "../utils/span";
const input = getInput(__dirname).split("\n");
const example = getExample(__dirname).split("\n");

const getPowerConsumption = (input) => {
  const gammaRate = getGammaRate(input);
  const epsilonRate = flipBits(gammaRate);
  return gammaRate * epsilonRate;
};

const getColumnOneCounts = (input: string[]) => {
  const bitsPerRow = input[0].length;

  const columnOneCounts = input.reduce((acc, curr) => {
    return acc.map((count, i) => count + +curr[i]);
  }, new Array(bitsPerRow).fill(0) as number[]);
  return columnOneCounts;
};

const getGammaRate = (input: string[]) => {
  const columnOneCounts = getColumnOneCounts(input);

  const bitArray = columnOneCounts
    .map((sum) => (sum > input.length / 2 ? "1" : "0"))
    .join("");

  return parseInt(bitArray, 2);
};

const getRating = (input: string[], type: "oxygen" | "scrubber") => {
  return span(0, input[0].length - 1).reduce((acc, curr) => {
    if (acc.length === 1) return acc;
    const columnOneCounts = getColumnOneCounts(acc);
    const mostCommonBit = columnOneCounts[curr] >= acc.length / 2 ? "1" : "0";
    return acc.filter((num) =>
      type === "oxygen"
        ? num[curr] === mostCommonBit
        : num[curr] !== mostCommonBit
    );
  }, input)[0];
};

const getLifeSupportRating = (input: string[]) => {
  return (
    parseInt(getRating(input, "oxygen"), 2) *
    parseInt(getRating(input, "scrubber"), 2)
  );
};

const flipBits = (gammaRate: number) =>
  ~gammaRate & parseInt("1".repeat(gammaRate.toString(2).length), 2);

test("part 1", () => {
  const gamma = getGammaRate(example);
  const expectedGamma = 22;
  expect(gamma).toEqual(expectedGamma);

  const epsilon = flipBits(gamma);
  const expectedEpsilon = 9;
  expect(epsilon).toEqual(expectedEpsilon);

  expect(getPowerConsumption(example)).toEqual(198);
  expect(getPowerConsumption(input)).toEqual(3847100);
});

test("part 2", () => {
  const oxygen = getRating(example, "oxygen");
  const expectedOxygen = "10111";
  expect(oxygen).toEqual(expectedOxygen);

  const scrubber = getRating(example, "scrubber");
  const expectedScrubber = "01010";
  expect(scrubber).toEqual(expectedScrubber);

  const lifeSupport = getLifeSupportRating(example);
  const expectedLifeSupport = 230;
  expect(lifeSupport).toEqual(expectedLifeSupport);

  const lifeSupport2 = getLifeSupportRating(input);
  const expectedLifeSupport2 = 4105235;
  expect(lifeSupport2).toEqual(expectedLifeSupport2);
});

test("flips", () => {
  expect(binaryString(22)).toEqual("10110");
  expect(flipBits(22)).toEqual(9);
});
