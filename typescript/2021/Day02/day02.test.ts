import { getExample } from "../utils/getInput";
import { map } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";
import { getInput } from "../utils/getInput";
const input = getInput(__dirname).split("\n");
const example = getExample(__dirname).split("\n");

//parsing input
type Direction = "forward" | "down" | "up";
type Amount = number;
export type Command = [Direction, Amount];

export const parseCommand = (str: string) => {
  const [command, direction] = str.split(" ");
  return [command, parseInt(direction)] as Command;
};

//part 1
type Depth = number;
type Horizontal = number;
export type Position = [Depth, Horizontal];

const executeCommands = (commands: Command[]) =>
  commands.reduce(
    ([depth, horizontal], [direction, length]) =>
      match(direction)
        .with("down", () => [depth + length, horizontal])
        .with("up", () => [depth - length, horizontal])
        .with("forward", () => [depth, horizontal + length])
        .exhaustive(),
    [0, 0] as Position
  );

export const doStuff = (input: string[], executeCommands) => {
  const [depth, horizontal] = pipe(input, map(parseCommand), executeCommands);
  return depth * horizontal;
};

//part2
type Aim = number;
type PositionAndAim = [...Position, Aim];

const executeCommands2 = (commands: Command[]) =>
  commands.reduce(
    ([depth, horizontal, aim], [direction, length]) =>
      match(direction)
        .with("down", () => [depth, horizontal, aim + length])
        .with("up", () => [depth, horizontal, aim - length])
        .with("forward", () => [depth + aim * length, horizontal + length, aim])
        .exhaustive(),
    [0, 0, 0] as PositionAndAim
  );

//tests
test("part1", () => {
  expect(doStuff(example, executeCommands)).toEqual(150);
  expect(doStuff(input, executeCommands)).toEqual(2150351);
});

test("part2", () => {
  expect(doStuff(example, executeCommands2)).toEqual(900);
  expect(doStuff(input, executeCommands2)).toEqual(1842742223);
});

test("parse", () => {
  expect(pipe(["forward 5", "down 8", "up 2"], map(parseCommand))).toEqual([
    ["forward", 5],
    ["down", 8],
    ["up", 2],
  ]);
});
