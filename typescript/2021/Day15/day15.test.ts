import { range } from "fp-ts/lib/ReadonlyNonEmptyArray";
import {
  curry,
  equals,
  findIndex,
  findLastIndex,
  insert,
  last,
  mathMod,
  not,
  splitEvery,
} from "ramda";
import { getInput, getExample, getTextFile } from "../utils/getInput";
import { Coord } from "../utils/grid";

const input = getInput(__dirname);
const example = getExample(__dirname);
const bigExample = getTextFile(__dirname, "bigexample.txt");

type Node = {
  coord: Coord;
  risk: number;
  total: number;
  neighbors: Coord[];
};

const parse = (input: string) => {
  const width = input.indexOf("\n");
  const cleaned = input.replace(/\s/g, "");
  const height = cleaned.length / width;

  return Array.from(cleaned).map((risk, i) => {
    const x = i % width;
    const y = Math.floor(i / width);
    return {
      coord: [x, y],
      risk: parseInt(risk),
      total: i === 0 ? 0 : Infinity,
      neighbors: [
        x !== 0 ? [x - 1, y] : undefined,
        x !== width - 1 ? [x + 1, y] : undefined,
        y !== 0 ? [x, y - 1] : undefined,
        y !== height - 1 ? [x, y + 1] : undefined,
      ].filter((n) => n !== undefined),
    } as Node;
  });
};

const part1 = (input: string, goal: Coord) => {
  const nodes = parse(input);
  const map = new Map(nodes.map((n) => [n.coord.join(","), n]));
  const visited = new Set([nodes[0].coord.join(",")]);

  const get = (coord: Coord) => map.get(coord.join(","));

  const last = get(goal);
  let toCheck = [nodes[0]];
  while (last.total === Infinity) {
    const { neighbors, total } = get(toCheck.shift().coord);

    for (let nc of neighbors.filter((n) => !visited.has(n.join(",")))) {
      const neighbor = get(nc);
      neighbor.total = total + neighbor.risk;
      const index = findLastIndex((a) => a.total < neighbor.total, toCheck);
      toCheck = insert(index + 1, neighbor, toCheck);
      visited.add(nc.join(","));
    }
  }
  return get(goal).total;
};

const up = (line: string, amount: number) =>
  Array.from(line)
    .map((ch) => ((parseInt(ch) + amount - 1) % 9) + 1)
    .join("");

const part2 = (input: string, goal: Coord) => {
  const newInput = embiggenInput(input);
  return part1(newInput, goal);
};

test("part1", () => {
  expect(part1(example, [9, 9])).toEqual(40);
  expect(part1(input, [99, 99])).toEqual(508);
});

test("part2", () => {
  expect(part2(example, [49, 49])).toEqual(315);
  expect(part2(input, [499, 499])).toEqual(2872);
});

test("parsing", () => {
  expect(parse(example)[0]).toEqual({
    coord: [0, 0],
    neighbors: [
      [1, 0],
      [0, 1],
    ],
    prev: undefined,
    risk: 1,
    total: 0, //start node
  });
  expect(last(parse(example))).toEqual({
    coord: [9, 9],
    neighbors: [
      [8, 9],
      [9, 8],
    ],
    prev: undefined,
    risk: 1,
    total: Infinity,
  });
});
const embiggenInput = (input: string) => {
  const width = input.indexOf("\n");

  const oneFifthOfNumbers = input
    .split("\n")
    .map((line) =>
      range(0, 4)
        .map((amount) => up(line, amount))
        .join("")
    )
    .join("");

  const allnumbers = range(0, 4)
    .map((y) => up(oneFifthOfNumbers, y))
    .join("");

  const newInput = splitEvery(width + 1, allnumbers).join("\n");
  return newInput;
};
