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
    source_range_start: u64,
    destination_range_start: u64,
    range_size: u64,
}

fn part1(input: &str) -> u64 {
    let (seeds, maps) =
        input.trim().split_once("\n\n").unwrap();

    let seeds = seeds
        .strip_prefix("seeds: ")
        .unwrap()
        .split_whitespace()
        .map(|num| num.parse::<u64>().unwrap())
        .collect_vec();

    let maps = parse_maps(maps);

    let locations = seeds
        .iter()
        .map(|seed| {
            let mut from = seed.clone();

            for map in &maps {
                let range =
                    &map.ranges.iter().find(|range| {
                        range.source_range_start <= from
                            && from.clone()
                                <= range.source_range_start
                                    + range.range_size
                    });

                let dit = match range {
                    Some(range) => {
                        from + range.destination_range_start
                            - range.source_range_start
                    }
                    None => from.clone(),
                };

                from = dit.clone();
            }

            from

            // (num, &map.to)
        })
        .collect_vec();

    locations
        .iter()
        .sorted()
        .collect_vec()
        .first()
        .unwrap()
        .clone()
        .clone()
}

fn parse_maps(maps: &str) -> Vec<Map> {
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
                    destination_range_start: a
                        .next()
                        .unwrap()
                        .parse()
                        .unwrap(),

                    source_range_start: a
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
    maps
}

fn part2(input: &str) -> u64 {
    let (seeds, maps) =
        input.trim().split_once("\n\n").unwrap();

    let seeds = seeds
        .strip_prefix("seeds: ")
        .unwrap()
        .split_whitespace()
        .map(|num| num.parse::<u64>().unwrap().clone())
        .collect_vec();

    let seed_ranges = seeds
        .chunks(2)
        .into_iter()
        .collect_vec()
        .iter()
        .map(|chunk| {
            let a = chunk.first().unwrap();
            let b = chunk.last().unwrap();

            let mut strut =
                vec![a.clone(), &a.clone() + &b.clone()];
            strut.sort();
            strut
        })
        .collect_vec();

    let maps = parse_maps(maps);

    let mut testing = 0;

    loop {
        let mut to = testing;
        for map in maps.iter().rev() {
            //
            //
            let range = &map.ranges.iter().find(|range| {
                range.destination_range_start <= to
                    && to
                        <= range.destination_range_start
                            + range.range_size
            });

            match range {
                Some(range) => {
                    to = to + range.source_range_start
                        - range.destination_range_start
                }
                None => {}
            };
        }

        match (seed_ranges.clone().into_iter().find(
            |chunk| {
                //
                chunk.first().unwrap() <= &&to
                    && &to <= chunk.last().unwrap()
            },
        )) {
            Some(_) => return testing,
            None => {}
        }

        // if testing == 0 {
        //     panic!()
        // }

        testing += 1;
    }
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
        assert_eq!(part1(real_input), 462648396);

        assert_eq!(part2(EXAMPLE_INPUT1), 46);
        assert_eq!(part2(real_input), 2520479);
        // assert_eq!(part2(real_input), 462648396);
        // assert_eq!(part2(EXAMPLE_INPUT1), 30);
        // assert_eq!(part2(real_input), 5539496);
    }
}
