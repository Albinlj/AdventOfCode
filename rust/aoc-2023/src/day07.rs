use itertools::Itertools;
use std::{cmp, str::FromStr};

#[derive(Debug)]
struct Draw {
    cards: Vec<u32>,
    hand_value: u32,
    bet: u32,
}

fn part1(input: &str) -> u32 {
    let mut draws = input
        .trim()
        .lines()
        .map(|line| {
            let (cards, bet) = line
                .split_once(' ')
                .unwrap();

            let cards = cards
                .trim()
                .chars()
                .map(|ch| match ch {
                    'A' => 14,
                    'K' => 13,
                    'Q' => 12,
                    'J' => 11,
                    'T' => 10,
                    _ => ch
                        .to_digit(10)
                        .unwrap_or_else(|| panic!("{ch:?} cant be converted")),
                })
                .collect::<Vec<_>>();

            let bet = bet
                .parse::<u32>()
                .unwrap();

            // let hand_type_map  = cards.iter().
            let thing = cards
                .iter()
                .into_group_map_by(
                    |&x| x,
                )
                .into_iter()
                .map(|(a, b)| b.len())
                .sorted()
                .rev()
                .collect::<Vec<_>>();

            let hand_value =
                match &thing[..] {
                    [1, 1, 1, 1, 1] => 1 ,
                    [2, 1, 1, 1] => 2,
                    [2, 2, 1] => 3,
                    [3, 1, 1] => 4,
                    [3, 2] => 5,
                    [4, 1] => 6,
                    [5] => 7,
                    _ => panic!(),
                };

            Draw {
                cards,
                bet,
                hand_value,
            }
        })
        .collect::<Vec<_>>();

    draws.sort_by(|a, b| {
        let comp = b
            .hand_value
            .cmp(&a.hand_value);

        match comp {
            cmp::Ordering::Equal => {
                let (x, y) = a
                    .cards
                    .iter()
                    .zip(b.cards.iter())
                    .skip_while(
                        (|(a, b)| {
                            a == b
                        }),
                    )
                    .next()
                    .unwrap();

                y.cmp(x)
            }
            _ => comp,
        }
    });


    draws
        .iter()
        .enumerate()
        .map(|(i, d)| {
            d.bet
                * (draws.len() - i)
                    as u32
        })
        .sum()
}

fn part2(input: &str) -> u32 {
    let mut draws = input
        .trim()
        .lines()
        .map(|line| {
             let (cards, bet) = line
                .split_once(' ')
                .unwrap();

            let cards = cards
                .trim()
                .chars()
                .map(|ch| match ch {
                    'A' => 14,
                    'K' =>   13,
                    'Q' => 12,
                    'J' => 1,
                    'T' => 10,
                    _ => ch
                        .to_digit(10)
                        .unwrap_or_else(|| panic!("{ch:?} cant be converted to a digit")),
                })
                .collect::<Vec<_>>();

            let bet = bet
                .parse::<u32>()
                .unwrap();

            let thing = cards
                .iter()
                .into_group_map_by(
                    |&x| x,
                )
                .into_iter()
                .filter_map(|(a, b)| 

                match a {
                    1 => None,
                    _ => Some(b.len())
                    }   )
                .sorted()
                .rev()
                .collect::<Vec<_>>();


            let hand_value =
                match &thing[..] {
                    [1, 1, 1, 1, 1] => 1,
                    [2, 1, 1, 1] => 2,
                    [2, 2, 1] => 3,
                    [3, 1, 1] => 4,
                    [3, 2] => 5,
                    [4, 1] => 6,
                    [5] => 7,

                    // 1 joker
                    [1, 1, 1, 1] => 2, 
                    [2, 1, 1] => 4, 
                    [2, 2] => 5, 
                    [3, 1] => 6, 
                    [4] => 7, 

                    // 2 joker
                    [1, 1, 1] => 4, 
                    [2, 1] => 6,
                    [3] => 7, 

                    // 3 joker
                    [1, 1] => 6, 
                    [2] => 7, 

                    // 4 joker
                    [1] => 7, 

                    // 5 joker
                    [] => 7, 
                    _ => panic!("{thing:?} is wrong"),
                };

            Draw {
                cards,
                bet,
                hand_value,
            }
        })
        .collect::<Vec<_>>();

    draws.sort_by(|a, b| {
        let comp = b
            .hand_value
            .cmp(&a.hand_value);

        match comp {
            cmp::Ordering::Equal => {
                let (x, y) = a
                    .cards
                    .iter()
                    .zip(b.cards.iter())
                    .skip_while(
                        (|(a, b)| {
                            a == b
                        }),
                    )
                    .next()
                    .unwrap();

                y.cmp(x)
            }
            _ => comp,
        }
    });

    

    draws
        .iter()
        .enumerate()
        .map(|(i, d)| {
            d.bet
                * (draws.len() - i)
                    as u32
        })
        .sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test() {
        const EXAMPLE_INPUT1:
            &'static str = r#"
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
"#;

        let real_input = include_str!(
            "../inputs/day07.txt"
        );
        assert_eq!(
            part1(EXAMPLE_INPUT1),
            6440
        );
        assert_eq!(
            part1(real_input),
            253603890
        );

        assert_eq!(
            part2(EXAMPLE_INPUT1),
            5905
        );

        assert_eq!(
            part2(real_input),
            253630098
        );
    }
}
