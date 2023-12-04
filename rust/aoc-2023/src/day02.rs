use regex::Regex;
use std::{cmp, usize};

fn part1(input: &str, red: u32, green: u32, blue: u32) -> u32 {
    let lines = input.trim().lines();

    let mut good_games = 0;
    for line in lines {
        let from = line.find(' ').expect("fak");
        let to = line.find(':').expect("fak");

        let id: u32 = line[from + 1..to].trim().parse().expect("fek");
        let rest = line[to + 1..].split(";").collect::<Vec<&str>>();

        let mut r: u32 = 0;
        let mut g: u32 = 0;
        let mut b: u32 = 0;

        for pull in rest {
            for marble in pull.split(',') {
                let marble = marble.trim();

                if (marble.ends_with("red")) {
                    let newr = marble[..marble.find(" ").expect("yo")].parse().expect("na");
                    r = cmp::max(r, newr);
                }
                if (marble.ends_with("green")) {
                    g = cmp::max(
                        g,
                        marble[..marble.find(" ").expect("yo")].parse().expect("na"),
                    );
                }
                if (marble.ends_with("blue")) {
                    b = cmp::max(
                        b,
                        marble[..marble.find(" ").expect("yo")].parse().expect("na"),
                    );
                }
            }
        }

        if (r <= red && g <= green && b <= blue) {
            good_games += id;
        }
    }
    good_games
}

fn part2(input: &str) -> u32 {
    let lines = input.trim().lines();

    let mut total_power = 0;
    for line in lines {
        let from = line.find(' ').expect("fak");
        let to = line.find(':').expect("fak");

        let id: u32 = line[from + 1..to].trim().parse().expect("fek");

        let rest = line[to + 1..].split(";").collect::<Vec<&str>>();

        let mut r: u32 = 0;
        let mut g: u32 = 0;
        let mut b: u32 = 0;

        for pull in rest {
            for marble in pull.split(',') {
                let marble = marble.trim();

                if (marble.ends_with("red")) {
                    let newr = marble[..marble.find(" ").expect("yo")].parse().expect("na");
                    r = cmp::max(r, newr);
                }
                if (marble.ends_with("green")) {
                    g = cmp::max(
                        g,
                        marble[..marble.find(" ").expect("yo")].parse().expect("na"),
                    );
                }
                if (marble.ends_with("blue")) {
                    b = cmp::max(
                        b,
                        marble[..marble.find(" ").expect("yo")].parse().expect("na"),
                    );
                }
            }
        }

        total_power += r * g * b;
    }

    total_power
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        const EXAMPLE_INPUT1: &'static str = r#"
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
"#;

        let real_input = include_str!("../inputs/day02.txt");

        assert_eq!(part1(EXAMPLE_INPUT1, 12, 13, 14), 8);
        assert_eq!(part1(real_input, 12, 13, 14), 2512);

        assert_eq!(part2(EXAMPLE_INPUT1), 2286);
        assert_eq!(part2(real_input), 67335);
    }
}
