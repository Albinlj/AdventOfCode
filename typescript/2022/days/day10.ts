import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import { sum } from "https://deno.land/x/fae@v1.1.1/mod.ts";

Deno.test("example", () => {
  assertEquals(part1(readExample(10)), 13140);
});

Deno.test("input", () => {
  assertEquals(part1(readInput(10)), 13060);
});

function part1(input: string): any {
  const actions = input.split("\n").map((line) => {
    const [move, num] = line.split(" ");
    return [move, parseInt(num)] as ["noop" | "addx", number];
  });

  let str = "";

  let actionIndex = 0;
  let cycle = 0;
  let isDoing = false;
  let x = 1;
  let currentAction = undefined;

  const vals = [];

  while (true) {
    cycle++;
    //start
    if (!currentAction) {
      currentAction = actions[actionIndex];
      if (currentAction && currentAction[0] == "addx") {
        isDoing = true;
      }
      actionIndex++;
    }

    //during;
    str +=
      (cycle % 40 === x % 40 || cycle % 40 === x + 1 || cycle % 40 === x + 2)
        ? "#"
        : ".";
    if (cycle % 40 === 0) str += "\n";
    if ((cycle + 20) % 40 === 0) {
      vals.push(cycle * x);
    }
    if (cycle === 240) break;

    //after
    if (isDoing) {
      isDoing = false;
      continue;
    }

    if (currentAction && currentAction[0] == "addx") {
      x += currentAction[1];
    }
    currentAction = undefined;
  }

  console.log(str);
  return sum(vals);
}
