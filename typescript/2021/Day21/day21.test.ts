import { memoizeWith } from "ramda";
import { min } from "lodash";

const play2 = memoizeWith(
  (a, b, c, d, e, f) => `${a}-${b}-${c}-${d}-${e}-${f}`,
  (
    tomove: number,
    p1pos: number,
    p2pos: number,
    p1score: number = 0,
    p2score: number = 0,
    turn: number = 2
  ): [number, number] => {
    let newp1score = p1score;
    let newp2score = p2score;
    let newp1Pos = p1pos;
    let newp2Pos = p2pos;

    if (tomove !== 0) {
      if (turn === 1) {
        newp1Pos = ((p1pos + tomove - 1) % 10) + 1;
        newp1score = p1score + newp1Pos;
        // console.log("one", newp1score);
        if (newp1score >= 21) return [1, 0];
      } else {
        newp2Pos = ((p2pos + tomove - 1) % 10) + 1;
        newp2score = p2score + newp2Pos;
        // console.log("two", newp2score);
        if (newp2score >= 21) return [0, 1];
      }
    }

    const a = moves.map(([steps, count]): [number, number] => {
      const [x, y] = play2(
        steps,
        newp1Pos,
        newp2Pos,
        newp1score,
        newp2score,
        turn === 1 ? 2 : 1
      );

      return [x * count, y * count];
    });

    const b = a.reduce(([a, b], [a2, b2]) => [a + a2, b + b2], [0, 0]);

    return b;
  }
);

const moves = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];

test("example2", () => {
  const [one, two] = play2(0, 4, 8);
  expect(one).toBe(444356092776315);
  expect(two).toBe(341960390180808);
});

test("part2", () => {
  const [one, two] = play2(0, 7, 3);
  expect(one).toBe(272847859601291);
});

const play1 = (p1start: number, p2start: number) => {
  let dice = 0;
  let throws = 0;
  const throow = () => {
    throws++;
    dice++;
    if (dice === 1001) dice = 1;
    return dice;
  };

  let scores = {
    1: 0,
    2: 0,
  };
  let positions = {
    1: p1start,
    2: p2start,
  };

  let turn = 1;

  while (scores[1] < 1000 && scores[2] < 1000) {
    let tomove = throow() + throow() + throow();
    positions[turn] = ((positions[turn] + tomove - 1) % 10) + 1;
    scores[turn] += positions[turn];
    turn = turn === 1 ? 2 : 1;
  }

  return { scores, positions, dice, throws };
};

test("example1", () => {
  const { scores, positions, dice, throws } = play1(4, 8);
  expect(min([scores[2], scores[1]])).toBe(745);
  expect(throws).toBe(993);
});

test("part1", () => {
  const { scores, positions, dice, throws } = play1(7, 3);
  const low = min([scores[2], scores[1]]);
  expect(low * throws).toBe(551901);
});
