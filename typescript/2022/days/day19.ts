import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { readExample, readInput } from "../utilities.ts";
import {
  add,
  identity,
  max,
  multiply,
} from "https://deno.land/x/fae@v1.1.1/mod.ts";

// Deno.test("maxGeodes", { only: true }, () => {
//   const bps = parseBlueprints(readExample(19));

//   assertEquals(maxGeodes(bps[0], 24), 9);
//   assertEquals(maxGeodes(bps[1], 24), 12);
//   assertEquals(maxGeodes(bps[0], 32), 56);
//   assertEquals(maxGeodes(bps[1], 32), 62);
// });

Deno.test("example 1", () => {
  assertEquals(part1(readExample(19)), 33);
});

Deno.test("part 1", () => {
  assertEquals(part1(readInput(19)), 1613);
});

Deno.test("example 2", () => {
  assertEquals(part2(readExample(19)), 56 * 62);
});

Deno.test("part 2", () => {
  assertEquals(part2(readInput(19)), 46816);
});

function part1(input: string): any {
  const blueprints = parseBlueprints(input);

  const bluePrintQualities = blueprints.map((bp, i) => {
    return maxGeodes(bp, 24) * (i + 1);
  });

  return bluePrintQualities.reduce(add, 0);
}

function part2(input: string): any {
  const blueprints = parseBlueprints(input).slice(0, 3);

  const bluePrintQualities = blueprints.map((bp) => {
    return maxGeodes(bp, 32);
  });

  return bluePrintQualities.reduce(multiply, 1);
}

const resourceTypes = ["ore", "clay", "obsidian", "geode"] as const;
type Resource = typeof resourceTypes[number];
type Robot = Resource;
type RobotCosts = Record<Robot, Partial<Record<Resource, number>>>;

function maxGeodes(costs: RobotCosts, time: number): any {
  const recurse = (
    resources: Record<Resource, number>,
    robots: Record<Resource, number>,
    timeLeft: number,
  ): any => {
    return resourceTypes
      .filter((robotType) => {
        const robotCosts = Object.keys(costs[robotType]);
        return robotCosts.every((resource) => robots[resource as Resource] > 0);
      })
      .filter((robotType) => {
        // if (robotType !== "clay" && robots.clay === 1) return false
        // if (robotType === "clay" && robots.clay > costs.obsidian.clay! / 2) {
        //   return false;
        // }
        // if (
        //   robotType === "obsidian" &&
        //   robots.clay < costs.obsidian.clay! / 4
        // ) {
        //   return false;
        // }

        // if (
        //   robotType === "geode" &&
        //   // robots.obsidian < costs.geode.obsidian! / 3
        //   robots.obsidian < 2
        // ) {
        //   return false;
        // }

        // Only works for part 1
        if (
          robotType !== "obsidian" &&
          robotType !== "geode" &&
          resources.clay >= costs.obsidian.clay! &&
          resources.ore >= costs.obsidian.ore!
        ) {
          return false;
        }

        if (
          robotType !== "geode" &&
          resources.obsidian >= costs.geode.obsidian! &&
          resources.ore >= costs.geode.ore!
        ) {
          return false;
        }

        if (robotType === "geode") {
          return true;
        }

        const maxCost = Object
          .values(costs)
          .map((cost) => cost[robotType] ?? 0)
          .reduce(max, 0);
        const isAtMaxCost = robots[robotType] == maxCost;
        if (isAtMaxCost) {
          return false;
        }

        return true;
      })
      .map((robotType) => {
        const timeNeeded = resourceTypes
          .map((resource) => (max(
            Math.ceil(
              (costs[robotType][resource]! - (resources[resource])) /
                robots[resource],
            ),
            0,
          )))
          .filter(identity)
          .reduce(max, 0) + 1;

        if (timeLeft - timeNeeded <= 0) {
          return resources.geode + robots.geode * (timeLeft);
        }

        const newResources = Object.fromEntries(
          Object.entries(resources).map((
            [resource, amount],
          ) => {
            const robotCost = costs[robotType][resource as Resource] ?? 0;
            return [
              resource,
              amount -
              (Number.isNaN(robotCost) ? 0 : robotCost) +
              robots[resource as Resource] * timeNeeded,
            ];
          }),
        ) as Record<Resource, number>;

        const newRobots = { ...robots, [robotType]: robots[robotType] + 1 };
        return recurse(
          newResources,
          newRobots,
          timeLeft - timeNeeded,
        );
      })
      .reduce(max, 0);
  };

  //doit
  return recurse(
    { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    time,
  );
}

function parseBlueprints(input: string): RobotCosts[] {
  return input
    .split("\n")
    .map((a) => {
      const [
        _id,
        oreRobotOreCost,
        clayRobotOreCost,
        obsidianrobotorecost,
        obsidianRobotClayCost,
        geodeRobotOreCost,
        geodeRobotObsidianCost,
      ] = a
        .match(/\d+/g)!
        .map((x) => parseInt(x));

      return {
        ore: { ore: oreRobotOreCost },
        clay: { ore: clayRobotOreCost },
        obsidian: {
          ore: obsidianrobotorecost,
          clay: obsidianRobotClayCost,
        },
        geode: {
          ore: geodeRobotOreCost,
          obsidian: geodeRobotObsidianCost,
        },
      };
    });
}
