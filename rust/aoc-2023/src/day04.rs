#[derive(Debug)]
struct Card {
    id: u32,
    winning_numbers: Vec<u32>,
    your_numbers: Vec<u32>,
}

fn part1(input: &str) -> u32 {
    let cards = input
        .trim()
        .lines()
        .map(|line| {
            let (card, numbers) = line.split_once(':').unwrap();

            let (winning, yours) = numbers.split_once('|').unwrap();

            Card {
                id: 1,
                winning_numbers: winning
                    .trim()
                    .split_whitespace()
                    .map(|num| num.parse().unwrap())
                    .collect(),
                your_numbers: yours
                    .trim()
                    .split_whitespace()
                    .map(|num| num.parse().unwrap())
                    .collect::<Vec<u32>>(),
            }
        })
        .collect::<Vec<Card>>();

    let mut sum = 0;
    for card in cards {
        let mut wincount: u32 = 0;

        for winning in &card.winning_numbers {
            if (card.your_numbers.contains(&winning)) {
                wincount += 1;
            }
        }

        if (wincount == 0) {
            continue;
        }

        sum += 2_u32.pow(wincount - 1)
    }

    sum
}

fn part2(input: &str) -> u32 {
    let cards = input
        .trim()
        .lines()
        .map(|line| {
            let (card, numbers) = line.split_once(':').unwrap();

            let (winning, yours) = numbers.split_once('|').unwrap();

            Card {
                id: 1,
                winning_numbers: winning
                    .trim()
                    .split_whitespace()
                    .map(|num| num.parse().unwrap())
                    .collect(),
                your_numbers: yours
                    .trim()
                    .split_whitespace()
                    .map(|num| num.parse().unwrap())
                    .collect::<Vec<u32>>(),
            }
        })
        .collect::<Vec<Card>>();

    let mut amounts: Vec<u32> = cards.iter().map(|_| 1).collect();

    for (i, card) in cards.iter().enumerate() {
        let mut wincount: u32 = 0;

        for winning in &card.winning_numbers {
            if (card.your_numbers.contains(&winning)) {
                wincount += 1;
            }
        }

        for cp in i..(i + wincount as usize) {
            if (cp + 1 < amounts.len()) {
                amounts[cp + 1] += amounts[i];
            }
            // dbg!(cp);
        }

        dbg!(&amounts);
    }
    dbg!(&amounts);

    amounts.iter().sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        const EXAMPLE_INPUT1: &'static str = r#"
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
"#;

        let real_input = include_str!("../inputs/day04.txt");
        assert_eq!(part1(EXAMPLE_INPUT1), 13);
        assert_eq!(part1(real_input), 21821);

        assert_eq!(part2(EXAMPLE_INPUT1), 30);
        assert_eq!(part2(real_input), 21821);
    }
}
