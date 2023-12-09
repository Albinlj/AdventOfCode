use itertools::Itertools;
use std::{cmp, str::FromStr};

#[derive(Debug)]
struct Draw {
    cards: Vec<u32>,
    hand_value: u32,
    bet: u32,
}

fn part1(input: &str) -> u32 {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test() {
        const EXAMPLE_INPUT:
            &'static str = r#"
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
"#;

        let real_input = include_str!(
            "../inputs/day0x.txt"
        );

        assert_eq!(
            part1(EXAMPLE_INPUT1),
            6440
        );
    }
}
