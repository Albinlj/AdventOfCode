import { getInput, getTextFile } from "../utils/getInput";
import { pipe } from "fp-ts/lib/function";

const input = getInput(__dirname)
  .split("\n")
  .map((x) => parseInt(x));
const example = getTextFile(__dirname, "example.txt")
  .split("\n")
  .map((x) => parseInt(x));

test("example 1", () => {
  const answer = countIncreasing(example);
  expect(answer).toBe(7);
});
test("part 1", () => {
  const answer = countIncreasing(input);
  expect(answer).toBe(1448);
});

test("example 2", () => {
  const answer = pipe(example, toWindows, countIncreasing);
  expect(answer).toBe(5);
});
test("part 2", () => {
  const answer = pipe(input, toWindows, countIncreasing);
  expect(answer).toBe(1471);
});

const countIncreasing = (input: number[]) =>
  input.reduce((acc, curr, i, arr) => {
    const isFirstElement = i === 0;
    const isLargerThanPrevious = curr > arr[i - 1];
    return !isFirstElement && isLargerThanPrevious ? acc + 1 : acc;
  }, 0);

const toWindows = (input: number[]) =>
  input
    .map((e, i, arr) => {
      return i < arr.length - 2 ? e + arr[i + 1] + arr[i + 2] : null;
    })
    .slice(0, -2);
