import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readFile } from "../utilities.ts";

Deno.test("example", () => {
  assertEquals(findIndex("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4), 7);
  assertEquals(findIndex("bvwbjplbgvbhsrlpgdmjqwftvncz", 4), 5);
  assertEquals(findIndex("nppdvjthqldpwncqszvftbrmjlhg", 4), 6);
  assertEquals(findIndex("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 4), 10);
  assertEquals(findIndex("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 4), 11);
});

Deno.test("part1", () => {
  assertEquals(findIndex(readFile("day06.input.txt"), 4), 1582);
});

Deno.test("part2", () => {
  assertEquals(findIndex(readFile("day06.input.txt"), 14), 3588);
});

const findIndex = (input: string, length: number): number =>
  input
    .split("")
    .findIndex((_, i, arr2) =>
      i >= length - 1 &&
      arr2
        .slice(i - length + 1, i + 1)
        .every((a, i, arr2) => (arr2).lastIndexOf(a) == i)
    ) + 1;
