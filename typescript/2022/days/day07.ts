import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

type Dir = {
  dirs: { [key: string]: Dir };
  files: { [key: string]: number };
};

const parseDirs = (input: string) => {
  const lines = input
    .split("\n")
    .slice(1);

  const currentPath: string[] = [];
  const dirs: Dir = { dirs: {}, files: {} };

  const currentDir = () =>
    currentPath.reduce((acc, curr) => acc.dirs[curr], dirs);

  for (const line of lines) {
    if (line.startsWith("$ cd ")) {
      if (line === "$ cd ..") {
        currentPath.pop();
        continue;
      }
      const newFolder = line.slice(5);
      currentDir().dirs[newFolder] = {
        dirs: {},
        files: {},
      };
      currentPath.push(newFolder);
      continue;
    }

    const [num, file] = (line.split(" "));
    if (!isNaN(parseInt(num))) {
      currentDir().files[file] = parseInt(num);
    }
  }

  return dirs;
};

const part1 = (input: string) => {
  const root = parseDirs(input);

  let total = 0;

  const recurse = (dir: Dir): number => {
    let size = 0;

    for (const file in dir.files) {
      size += dir.files[file];
    }

    for (const key in dir.dirs) {
      size += recurse(dir.dirs[key]);
    }

    if (size <= 100000) {
      total += size;
    }

    return size;
  };

  recurse(root);

  return total;
};

const part2 = (input: string) => {
  const root = parseDirs(input);

  const all: number[] = [];

  const recurse = (dir: Dir): number => {
    let size = 0;

    for (const file in dir.files) {
      size += dir.files[file];
    }

    for (const key in dir.dirs) {
      size += recurse(dir.dirs[key]);
    }

    all.push(size);
    return size;
  };

  recurse(root);

  const hej = all.sort((a, b) => a - b).find((a, i, arr) =>
    arr.at(-1)! - a <= 40_000_000
  );

  return hej;
};

Deno.test("example", () => {
  const example = readExample(7);
  assertEquals(part1(example), 95437);
});

Deno.test("part1", () => {
  const input = readInput(7);
  assertEquals(part1(input), 1367870);
});

Deno.test("part2", () => {
  const input = readInput(7);
  assertEquals(part2(input), 549173);
});
