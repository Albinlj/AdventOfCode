use itertools::Itertools;
use std::str::FromStr;

#[derive(Debug)]
struct Map {
    from: String,
    to: String,
    ranges: Vec<Range>,
}

#[derive(Debug)]
struct Range {
    source_range_start: u32,
    destination_range_start: u32,
    range_size: u32,
}

fn part1(input: &str) -> u32 {
    let (seeds, maps) =
        input.trim().split_once("\n\n").unwrap();

    let seeds = seeds
        .strip_prefix("seeds: ")
        .unwrap()
        .split_whitespace()
        .map(|num| num.parse::<u32>().unwrap())
        .collect_vec();

    let maps = maps
        .split("\n\n")
        .map(|section| {
            let (header, rows) =
                section.split_once('\n').unwrap();

            let (from, to) = header
                .strip_suffix(" map:")
                .and_then(|a| a.split_once("-to-"))
                .unwrap();

            let ranges = rows
                .lines()
                .map(|line| line.split_whitespace())
                .map(|mut a| Range {
                    source_range_start: a
                        .next()
                        .unwrap()
                        .parse()
                        .unwrap(),
                    destination_range_start: a
                        .next()
                        .unwrap()
                        .parse()
                        .unwrap(),
                    range_size: a
                        .next()
                        .unwrap()
                        .parse()
                        .unwrap(),
                })
                .collect_vec();

            let map = Map {
                from: from.to_string(),
                to: to.to_string(),
                ranges,
            };

            map
        })
        .collect_vec();

    let locations =
        seeds.iter().map(|seed| {}).collect_vec();

    2
}

fn do_the_stuff(
    from: &str,
    number: u32,
    maps: &Vec<Map>,
) -> (u32, &str) {
    let map =
        &maps.iter().find(|map| map.from == from).unwrap();

    let dit = &map.ranges.iter().find(|range| {
        range.source_range_start <= number
            && number
                <= range.source_range_start
                    + range.range_size
    });

    // let num = match dit {
    //     Some() => {},
    //     None => {},
    // };
    let num = 32;

    (num, &map.to)
}

#[cfg(test)]
mod tests {
    use super::*;

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

        let real_input =
            include_str!("../inputs/day05.txt");

        assert_eq!(part1(EXAMPLE_INPUT1), 35);
        // assert_eq!(part1(real_input), 21821);

        // assert_eq!(part2(EXAMPLE_INPUT1), 30);
        // assert_eq!(part2(real_input), 5539496);
    }
}
