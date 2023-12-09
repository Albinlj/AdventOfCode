use itertools::Itertools;
use std::{
    cmp,
    collections::{hash_map, HashMap},
    str::FromStr,
};

fn part1(input: &str) -> u32 {
    let (dirs, hashmap) = parse(input);

    let mut steps = 0;

    let mut end = "ZZZ";
    let mut location = "AAA";
    'outer: loop {
        for ch in dirs.clone() {
            steps += 1;

            let (a, b) = hashmap.get(location).unwrap();

            location = match ch {
                'L' => a,
                'R' => b,
                _ => panic!(),
            };

            if (location == end) {
                break 'outer;
            }
        }
    }

    steps
}

fn part2(input: &str) -> usize {
    let (dirs, hashmap) = parse(input);

    let mut initial_locations = hashmap
        .clone()
        .into_keys()
        .filter(|&loc| loc.ends_with('A'))
        .collect_vec();

    let min_steps_out = initial_locations
        .iter()
        .map(|&loc| {
            let mut current_location = loc;

            let mut steps = 0;

            'outer: loop {
                for ch in &dirs {
                    steps += 1;

                    let (a, b) = hashmap.get(current_location).unwrap();

                    current_location = match ch {
                        'L' => a,
                        'R' => b,
                        _ => panic!(),
                    };

                    if (current_location.ends_with('Z')) {
                        break 'outer;
                    };
                }
            }

            steps
        })
        .collect_vec();

    min_steps_out.iter().fold(1usize, |acc, &el| lcm(acc, el))
}

fn parse(input: &str) -> (Vec<char>, HashMap<&str, (&str, &str)>) {
    let (header, lines) = input.trim().split_once("\n\n").unwrap();

    let dirs = header.chars().collect_vec();

    let mut hashmap = HashMap::new();

    lines.lines().for_each(|line| {
        let (from, fork) = line.split_once(" = ").unwrap();

        let (a, b) = fork
            .trim_start_matches('(')
            .trim_end_matches(')')
            .split_once(", ")
            .unwrap();

        hashmap.insert(from, (a, b));
    });

    (dirs, hashmap)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test() {
        const EXAMPLE_INPUT1: &'static str = r#"
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
"#;

        const EXAMPLE_INPUT2: &'static str = r#"
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
"#;

        const EXAMPLE_INPUT_PART2: &'static str = r#"
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
"#;

        let real_input = include_str!("../inputs/day08.txt");

        assert_eq!(part2(EXAMPLE_INPUT_PART2), 6);

        assert_eq!(part2(real_input), 15746133679061);
    }
}

fn lcm(first: usize, second: usize) -> usize {
    first * second / gcd(first, second)
}

fn gcd(first: usize, second: usize) -> usize {
    let mut max = first;
    let mut min = second;
    if min > max {
        let val = max;
        max = min;
        min = val;
    }

    loop {
        let res = max % min;
        if res == 0 {
            return min;
        }

        max = min;
        min = res;
    }
}
