import { green, red } from "https://deno.land/std@0.166.0/fmt/colors.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";

// Deno.test("example 1", () => {
//   assertEquals(part1(readExample(16)), 1651);
// });

// Deno.test("part 1", () => {
//   assertEquals(part1(readInput(16)), 2029);
// });

Deno.test("example 2", () => {
  assertEquals(part2(readExample(16)), 1707);
});

Deno.test("part 2", () => {
  assertEquals(part2(readInput(16)), 1707);
});

type Name = string;
type Valve = {
  name: Name;
  flow: number;
  paths: Name[];
  distances: Map<Name, number>;
};
type Volcano = Map<Name, Valve>;

function part2(input: string): any {
  const volcano = parseVolcano(input);
  findShortestPaths(volcano);

  console.log(volcano);

  const stopsCount = [...volcano.values()].filter((v) => v.flow !== 0).length +
    1; //Including AA
  console.log(stopsCount);

  return recurse({
    paths: [["AA"], ["AA"]],
    waiting: [0, 0],
    flow: 0,
    pressure: 0,
    time: 26,
  });

  // ELE : [AA, DD, HH, EE]
  // ELE : [ "AA", "DD", "HH", "EE" ]
  // YOU : [ "AA", JJ, BB, CC]

  function recurse(
    { paths, waiting, pressure, time, flow }: {
      paths: Name[][];
      waiting: number[];
      flow: number;
      pressure: number;
      time: number;
    },
  ): number {
    if (time <= 0) {
      // console.log(pressure);
      return pressure;
    }
    const activeIndex = waiting.findIndex((tl) => tl === 0);
    const inactiveIndex = 1 - activeIndex;

    const path = paths[activeIndex];
    const from = volcano.get(path.at(-1)!)!;
    const newFlow = flow + from.flow;

    const size = new Set(paths.flat()).size;
    const noMoreStops = size === stopsCount;
    if (noMoreStops) {
      const path = paths[inactiveIndex];
      const from = volcano.get(path.at(-1)!)!;
      const nextPersonsFlow = from.flow;

      const timeUntilNextStop = waiting[inactiveIndex];

      const newLocal = pressure + time * newFlow +
        (time - timeUntilNextStop) * nextPersonsFlow;
      console.log(newLocal, paths);
      return newLocal;
    }

    return ([...from
      .distances
      .entries()]
      .filter(([name]) => !paths.some((path) => path.includes(name)))
      .reduce(
        (acc, [nextPath, distance]) => {
          const myWaitTime = distance + 1;
          const timeUntilNextStop = Math.min(
            myWaitTime,
            waiting[inactiveIndex],
          );

          return Math.max(
            acc,
            recurse(
              {
                paths: paths.map((path, i) =>
                  i === activeIndex ? [...path, nextPath] : path
                ),
                flow: newFlow,
                pressure: pressure + newFlow * timeUntilNextStop,
                waiting: waiting.map((tl, i) =>
                  i === activeIndex
                    ? distance + 1 - timeUntilNextStop
                    : tl - timeUntilNextStop
                ),
                time: time - timeUntilNextStop,
              },
            ),
          );
        },
        pressure,
      ));
  }
}

function part1(input: string): any {
  const volcano = parseVolcano(input);
  findShortestPaths(volcano);
  // console.log(volcano);

  const mostFlow = recurse(["AA"], 0, 30);

  function recurse(
    path: Name[],
    pressure: number,
    time: number,
  ): number {
    if (time <= 0) return pressure;

    const current = volcano.get(path.at(-1)!)!;

    const stuff = ([...current
      .distances
      .entries()]
      .filter(([name]) => !path.includes(name))
      .reduce(
        (acc, [nextPath, distance]) => {
          const newPath = [...path, nextPath];
          const timeLeftAfterOpen = time - distance - 1;

          if (timeLeftAfterOpen <= 0) return acc;

          return Math.max(
            acc,
            pressure + recurse(
              newPath,
              volcano.get(nextPath!)!.flow * timeLeftAfterOpen,
              timeLeftAfterOpen,
            ),
          );
        },
        pressure,
      ));
    return stuff;
  }
  return mostFlow;
}

function findShortestPaths(
  volcano: Volcano,
) {
  for (const from of volcano.values()) {
    const candidates = [from.name];

    while (candidates.length > 0) {
      const curr = volcano.get(candidates.shift()!)!;
      const currentDistance = from.distances.get(curr.name)!;
      const neighbors = curr!.paths
        .map((path) => volcano.get(path)!)
        .filter((n) => from.distances.get(n.name)! > currentDistance + 1!);
      for (const neighbor of neighbors) {
        from.distances.set(neighbor.name, currentDistance + 1);
        candidates.push(neighbor.name);
      }
    }

    from.distances = new Map(
      [...from.distances.entries()].filter(([a, b]) =>
        volcano.get(a)?.flow !== 0
      ),
    );
  }
}

function parseVolcano(input: string): Map<Name, Valve> {
  return new Map(
    input.split("\n").map(
      (line) => {
        const [name, flow, ...paths] = line.match(/[A-Z]{2}|\d+/g)!;
        return {
          name,
          flow: parseInt(flow),
          paths,
        };
      },
    )
      .map((valve, _, orig) => ({
        ...valve,
        distances: new Map(
          orig.map((
            others,
          ) => [others.name, others.name === valve.name ? 0 : Infinity]),
        ),
      }))
      .map((valve) => [valve.name, valve]),
  );
}
