import { toInt } from "./../utils/toInt";
import * as fs from "fs";

import { max, nth, pipe, split, uniqBy } from "ramda";
import { getInput, getExample } from "../utils/getInput";
import { createCanvas } from "canvas";

const input = getInput(__dirname);
const example = getExample(__dirname);

type Mark = [number, number];
type Paper = Mark[];
type Fold = [string, number];

//Parsing
const parseInput: (input: string) => [Paper, Fold[]] = pipe(
  split("\n\n"),
  ([marks, folds]) => [ParsePaper(marks), parseFolds(folds)]
);

const parseFolds = (folds: string) =>
  folds.split("\n").map((line) => {
    const [head, num] = line.split("=");
    return [head[head.length - 1], parseInt(num)] as Fold;
  });

const ParsePaper: (marks: string) => Paper = (marks: string) =>
  marks.split("\n").map((line) => line.split(",").map(toInt)) as Paper;

const fold = (paper: Paper, fold: Fold): Paper => {
  const [direction, pos] = fold;
  const newPaper = paper.map(([x, y]) =>
    direction === "y"
      ? [x, y > pos ? y - (y - pos) * 2 : y]
      : [x > pos ? x - (x - pos) * 2 : x, y]
  );
  return uniqBy((mark) => `${mark[0]},${mark[1]}`, newPaper) as Paper;
};

//part1
const part1 = (input: string) => {
  const [paper, folds] = parseInput(input);
  return fold(paper, folds[0]);
};

//part2
const part2 = (input: string) => {
  const [paper, folds] = parseInput(input);
  const folded = folds.reduce(fold, paper);
  createImage(folded);
  return folded;
};

const createImage = (paper: Paper) => {
  const width = paper.map(nth(0)).reduce(max) * 10 + 100;
  const height = paper.map(nth(1)).reduce(max) * 10 + 100;
  const canvas = createCanvas(width, height);
  var ctx = canvas.getContext("2d");

  for (let [x, y] of paper) ctx.fillRect(x * 10 + 50, y * 10 + 50, 10, 10);

  const out = fs.createWriteStream(__dirname + "/code.png");
  const stream = canvas.createPNGStream();
  stream.pipe(out);
};

//tests
test("part2", async () => {
  createImage(parseInput(example)[0]);
  expect(part2(input)).toEqual(0);
});

test("part1", () => {
  expect(part1(example).length).toEqual(17);
  expect(part1(input).length).toEqual(827);

  expect(fold([[10, 10]], ["y", 9])).toEqual([[10, 8]]);
  expect(fold([[10, 10]], ["x", 9])).toEqual([[8, 10]]);

  expect(parseInput(example)).toEqual([
    [
      [6, 10],
      [0, 14],
      [9, 10],
      [0, 3],
      [10, 4],
      [4, 11],
      [6, 0],
      [6, 12],
      [4, 1],
      [0, 13],
      [10, 12],
      [3, 4],
      [3, 0],
      [8, 4],
      [1, 10],
      [2, 14],
      [8, 10],
      [9, 0],
    ],
    [
      ["y", 7],
      ["x", 5],
    ],
  ]);
});
