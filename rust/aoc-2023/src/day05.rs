use std::str::FromStr;

#[derive(Debug)]
struct Map {
    from: String,
    to: String,
    ranges: Vec<Range>,
}

#[derive(Debug, PartialEq, Eq)]
struct ParsePointError;

// impl FromStr for Map {
//     type Err = ParsePointError;

//     fn from_str(s: &str) -> Result<Self, Self::Err> {
//         let (header, ranges) = s.trim().split_once('\n').unwrap();
//         let (from, to) = header
//             .strip_suffix(" map:")
//             .and_then(|s| s.split_once("-to-"))
//             .unwrap();

//         let ranges = ranges.lines().map(|line| line.parse()).collect();

//         Ok(Map { from, to, ranges })
//     }
// }

#[derive(Debug)]
struct Range {
    source_range_start: u32,
    destination_range_start: u32,
    range_size: u32,
}

impl FromStr for Range {
    type Err = ParsePointError;

    fn from_str(line: &str) -> Result<Range, ParsePointError> {
        let stuff: Vec<u32> = line.split(' ');



        Ok(Range {
            source_range_start: stuff.next().unwrap(),
            destination_range_start: stuff.next().unwrap(),
            range_size: stuff.next().unwrap(),
        })
    }
}

// fn part1(input: &str) -> u32 {}

#[cfg(test)]
mod tests {
    use super::*;

    fn map() {
        const SEED_TO_SOIL_MAP: &'static str = r#"
seed-to-soil map:
50 98 2
52 50 48
"#;

        // let map: Map = SEED_TO_SOIL_MAP.parse();

        // assert_eq!(
        //     map,
        //     Map {
        //         from: "seed",
        //         to: "soil",
        //         ranges: vec![
        //             Range {
        //                 destination_range_start: 50,
        //                 source_range_start: 98,
        //                 range_size: 2
        //             },
        //             Range {
        //                 destination_range_start: 52,
        //                 source_range_start: 50,
        //                 range_size: 40
        //             },
        //         ]
        //     }
        // );
    }

    #[test]
    fn day() {
        const EXAMPLE_INPUT1: &'static str = r#"
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
"#;

        let real_input = include_str!("../inputs/day04.txt");
        // assert_eq!(part1(EXAMPLE_INPUT1), 35);
        // assert_eq!(part1(real_input), 21821);

        // assert_eq!(part2(EXAMPLE_INPUT1), 30);
        // assert_eq!(part2(real_input), 5539496);
    }
}
