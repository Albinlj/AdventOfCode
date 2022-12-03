import { max, min } from "ramda";
import { test, expect } from "vitest";
import { getExample, getInput } from "../utils/getInput";
// https://adventofcode.com/2021/day/22
// on x=10..10,y=10..10,z=10..10

type Action = "inp" | "add" | "mul" | "div" | "mod" | "eql";
type Var = "w" | "x" | "y" | "z";

const parseLine = (input: string) => {
  const [action, a, b] = input.split(" ");
  const bVal = parseInt(b);

  return [action, a, isNaN(bVal) ? b : bVal] as [Action, Var, Var | number];
};

const part1 = (input: string) => {
  const steps = input.split("\n").map(parseLine);
  const sections = input
    .split("\n")
    .map(parseLine)
    .reduce((arr, curr) => {
      return arr;
    }, []);

  let num = 100000000000000;
  while (num != 0) {
    num--;

    let numstring = Array.from(num.toString());
    if (numstring.includes("0")) continue;

    let vars: Record<Var, number> = {
      w: 0,
      x: 0,
      y: 0,
      z: 0,
    };

    for (const [action, a, b] of steps) {
      const bVal = typeof b === "number" ? b : vars[b];

      switch (action) {
        case "inp":
          vars[a] = parseInt(numstring.shift());
          continue;
        case "add":
          vars[a] += bVal;
          continue;
        case "mul":
          vars[a] *= bVal;
          continue;
        case "div":
          vars[a] = Math.floor(vars[a] / bVal);
          continue;
        case "mod":
          vars[a] %= bVal;
          continue;
        case "eql":
          vars[a] = vars[a] === bVal ? 1 : 0;
          continue;
      }
    }
    console.log(num);
    if (vars["z"] === 0) return num;
  }
};

test("part1", () => {
  expect(part1(getInput(__dirname))).toEqual(591365);
});
