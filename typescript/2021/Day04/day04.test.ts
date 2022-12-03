import { toInt } from "./../utils/toInt";
import { getExample } from "../utils/getInput";
import { getInput } from "../utils/getInput";
import { span } from "../utils/span";
import { green, red } from "chalk";
const input = getInput(__dirname);
const example = getExample(__dirname);

type Cell = [number, boolean];
type Board = Cell[];

const part1 = (input: string) => {
  const numbers = parseNumbers(input);
  const boards = parseBoards(input);

  for (let drawn of numbers) {
    for (let board of boards) {
      const found = board.find(([value, _]) => value === drawn);
      if (found) found[1] = true;
      if (checkIfWin(board)) {
        return calculateResult(board, drawn);
      }
    }
  }
};

const part2 = (input: string) => {
  const numbers = parseNumbers(input);
  const boards = parseBoards(input);

  let wonBoardindexes: number[] = [];

  for (let drawn of numbers) {
    for (let i = 0; i < boards.length; i++) {
      if (wonBoardindexes.includes(i)) continue;
      const board = boards[i];
      const found = board.find(([value, _]) => value === drawn);
      if (found) found[1] = true;
      if (checkIfWin(board)) {
        if (wonBoardindexes.length === boards.length - 1) {
          return (
            board.reduce(
              (acc, [num, marked]) => (marked === true ? acc : acc + num),
              0
            ) * drawn
          );
        } else {
          wonBoardindexes = [...wonBoardindexes, i];
        }
      }
    }
  }
};

function calculateResult(board: Board, drawn: number) {
  return (
    board.reduce(
      (acc, [num, marked]) => (marked === true ? acc : acc + num),
      0
    ) * drawn
  );
}

function parseBoards(input: string): Board[] {
  return input
    .split("\n\n")
    .slice(1)
    .map((b) => b.match(/(\d+)/gm).map<Cell>((n) => [parseInt(n), false]));
}

function parseNumbers(input: string) {
  return input.substring(0, input.indexOf("\n")).split(",").map(toInt);
}

function checkIfWin(board: Board) {
  for (let i = 0; i < 5; i++) {
    if (
      board.slice(i * 5, (i + 1) * 5 - 1).every(([_, marked]) => marked) ||
      span(0, 4)
        .map((col) => board[i + 5 * col])
        .every(([_, marked]) => marked)
    )
      return true;
  }
  return false;
}

const logBoard = (board: Board) => {
  console.log(
    board.reduce(
      (acc, [num, marked], i) =>
        acc +
        ((marked ? green(num) : red(num)) +
          " ".repeat(3 - num.toString().length) +
          ((i + 1) % 5 === 0 ? "\n" : "")),
      ""
    )
  );
};

test("part 1", () => {
  expect(part1(example)).toBe(4512);
  expect(part1(input)).toBe(51776);
});

test("part 2", () => {
  expect(part2(example)).toBe(1924);
  expect(part2(input)).toBe(16830);
});

test("checkIfWin", () => {
  const board1: Board = [
    [0, true],
    [0, true],
    [0, true],
    [0, true],
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
  ];
  expect(checkIfWin(board1)).toBe(true);
  const board2: Board = [
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
    [0, true],
    [0, false],
    [0, false],
    [0, false],
    [0, false],
  ];
  expect(checkIfWin(board2)).toBe(true);
});
