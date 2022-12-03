import { findLastIndex, findIndex, indexOf, max } from "lodash";

type Snail = Array<"[" | "]" | "," | number>;

const add = (a: Snail, b: Snail) => {
  const sum: Snail = ["[", ...a, ",", ...b, "]"];
  return reduce(sum);
};

import { getInput, getExample } from "../utils/getInput";

const getMagnitude = (s: Snail, i: number = 0): [number, number] => {
  const el = s[i];
  if (typeof el === "number") return [el, i];

  const [first, firstI] = getMagnitude(s, i + 1);

  const [second, secondI] = getMagnitude(s, firstI + 2);

  return [first * 3 + second * 2, secondI + 1];
};

const parse = (str: string): Snail => {
  let snail = [];

  for (const char of str) {
    const num = parseInt(char);
    if (!isNaN(num)) {
      if (typeof snail.at(-1) === "number") {
        const last = parseInt(snail.pop());
        snail.push(last * 10 + num);
      } else {
        snail.push(num);
      }
      continue;
    }
    snail.push(char);
  }

  return snail as Snail;
};

const reduce = (s: Snail): Snail => {
  const exploded = explode(s);
  if (exploded !== false) return reduce(exploded);

  const splitted = split(s);
  if (splitted !== false) return reduce(splitted);

  return s;
};

const explode = (s: Snail): Snail | false => {
  let depth = 0;

  for (let i = 0; i < s.length; i++) {
    const el = s[i];
    if (el === "[") depth++;
    if (el === "]") depth--;
    if (depth === 5) {
      const n = [...s];
      const lastNumIndex = findLastIndex(
        s,
        (e) => typeof e === "number",
        i - 1
      );
      if (lastNumIndex != -1) n[lastNumIndex] += s[i + 1];

      const firstNumIndex = findIndex(s, (e) => typeof e === "number", i + 5);
      if (firstNumIndex != -1) n[firstNumIndex] += s[i + 3];

      const removed = [...n.slice(0, i), 0, ...n.slice(i + 5)];
      return removed;
    }
  }
  return false;
};

const split = (s: Snail): Snail | false => {
  const i = s.findIndex((s) => typeof s === "number" && s >= 10);
  const num = s[i];
  if (i !== -1) {
    return [
      ...s.slice(0, i),
      "[",
      Math.floor(num / 2),
      ",",
      Math.ceil(num / 2),
      "]",
      ...s.slice(i + 1),
    ];
  }

  return false;
};

test("example", () => {
  const example = getExample(__dirname)
    .split("\n")
    .reduce((acc, curr) => {
      if (acc.length === 0) return parse(curr);
      else return add(acc, parse(curr));
    }, [] as Snail);

  expect(example.join("")).toEqual(
    "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
  );

  expect(getMagnitude(example)[0]).toEqual(3488);
});

test.only("example2", () => {
  const example = getInput(__dirname)
    .split("\n")
    .map(parse)
    .reduce((acc, curr, i, orig) => {
      if (i === orig.length - 1) return acc;
      return [
        ...acc,
        ...orig.slice(i + 1).flatMap((n) => [add(curr, n), add(n, curr)]),
      ];
    }, [])
    .map((a) => getMagnitude(a)[0]);

  console.log(example);

  const maxi = max(example);
  expect(maxi).toEqual(3993);
});

test("part1", () => {
  const input = getInput(__dirname)
    .split("\n")
    .reduce((acc, curr) => {
      if (acc.length === 0) return parse(curr);
      else return add(acc, parse(curr));
    }, []);

  expect(input.join("")).toEqual(
    "[[[[6,7],[7,7]],[[0,7],[7,7]]],[[[7,8],[7,7]],[[8,9],[9,9]]]]"
  );
  expect(getMagnitude(input)[0]).toEqual(4116);
});

test("explode", () => {
  expect(explode(parse("[[[[[9,8],1],2],3],4]")).join("")).toEqual(
    "[[[[0,9],2],3],4]"
  );
  expect(explode(parse("[7,[6,[5,[4,[3,2]]]]]")).join("")).toEqual(
    "[7,[6,[5,[7,0]]]]"
  );
  expect(explode(parse("[[6,[5,[4,[3,2]]]],1]")).join("")).toEqual(
    "[[6,[5,[7,0]]],3]"
  );
  expect(
    explode(parse("[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]")).join("")
  ).toEqual("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]");
  expect(explode(parse("[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]")).join("")).toEqual(
    "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"
  );
});

test("split", () => {
  expect(split(parse("[[[[0,7],4],[15,[0,13]]],[1,1]]")).join("")).toEqual(
    "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]"
  );
});
test("parse", () => {
  const str = "[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]";
  const parsed = parse(str);
  expect(parsed.join("")).toEqual(str);
});

test("Magnitude", () => {
  expect(getMagnitude(parse("7"))[0]).toEqual(7);
  expect(getMagnitude(parse("[9,1]"))[0]).toEqual(29);
  expect(getMagnitude(parse("[1,9]"))[0]).toEqual(21);
  expect(getMagnitude(parse("[[9,1],[1,9]]"))[0]).toEqual(129);
  expect(
    getMagnitude(
      parse("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")
    )[0]
  ).toEqual(3488);
  expect(
    getMagnitude(
      parse("[[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]]")
    )[0]
  ).toEqual(3993);
});

test("add", () => {
  expect(
    add(parse("[[[[4,3],4],4],[7,[[8,4],9]]]"), parse("[1,1]")).join("")
  ).toEqual("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
  expect(
    add(
      parse("[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]"),
      parse("[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]")
    ).join("")
  ).toEqual("[[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]]");
});
