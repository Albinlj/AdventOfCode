use lazy_static::lazy_static;

use regex::Regex;

#[derive(Debug)]
struct Number {
    number: i32,
    x: i32,
    y: i32,
}

#[derive(Debug)]
struct Symbol {
    x: i32,
    y: i32,
}

fn part1(input: &str) -> i32 {
    let width: i32 = input.trim().find(('\n')).unwrap().try_into().unwrap();
    dbg!(width);

    lazy_static! {
        static ref REGEX_SYMBOLS: Regex = Regex::new(r"([^.\n\w])").unwrap();
    }
    lazy_static! {
        static ref REGEX_NUMBERS: Regex = Regex::new(r"(\w+)").unwrap();
    }

    let mut symbols: Vec<Symbol> = vec![];
    let mut numbers: Vec<Number> = vec![];

    let binding = input.replace("\n", "");
    let cleaned = &binding.trim();

    let symbol_matches = REGEX_SYMBOLS.find_iter(cleaned);
    for capture in symbol_matches {
        symbols.push(Symbol {
            x: capture.start() as i32 % width,
            y: (capture.start() as f32 / width as f32).floor() as i32,
        });
    }

    let binding = input;
    let cleaned = &binding.trim().replace('\n', ".");
    dbg!(cleaned);

    let number_matches = REGEX_NUMBERS.find_iter(cleaned);
    for capture in number_matches {
        numbers.push(Number {
            x: capture.start() as i32 % (width + 1),
            y: (capture.start() as f32 / (width + 1) as f32).floor() as i32,
            number: capture.as_str().parse().unwrap(),
        });
    }

    let mut sum = 0;
    dbg!(&numbers);
    dbg!(&symbols);

    for number in &numbers {
        'symbs: for symbol in &symbols {
            if (symbol.y >= (number.y - 1)
                && symbol.y <= (number.y + 1)
                && symbol.x >= (number.x - 1)
                && symbol.x <= (number.x + number.number.to_string().len() as i32))
            {
                sum += number.number;
                break 'symbs;
            }
        }
    }
    sum
}
fn part2(input: &str) -> i32 {
    let width: i32 = input.trim().find(('\n')).unwrap().try_into().unwrap();
    dbg!(width);

    lazy_static! {
        static ref REGEX_SYMBOLS: Regex = Regex::new(r"([^.\n\w])").unwrap();
    }
    lazy_static! {
        static ref REGEX_NUMBERS: Regex = Regex::new(r"(\w+)").unwrap();
    }

    let mut symbols: Vec<Symbol> = vec![];
    let mut numbers: Vec<Number> = vec![];

    let binding = input.replace("\n", "");
    let cleaned = &binding.trim();

    let symbol_matches = REGEX_SYMBOLS.find_iter(cleaned);
    for capture in symbol_matches {
        if (capture.as_str() == "*") {
            symbols.push(Symbol {
                x: capture.start() as i32 % width,
                y: (capture.start() as f32 / width as f32).floor() as i32,
            });
        }
    }

    let binding = input;
    let cleaned = &binding.trim().replace('\n', ".");
    dbg!(cleaned);

    let number_matches = REGEX_NUMBERS.find_iter(cleaned);
    for capture in number_matches {
        numbers.push(Number {
            x: capture.start() as i32 % (width + 1),
            y: (capture.start() as f32 / (width + 1) as f32).floor() as i32,
            number: capture.as_str().parse().unwrap(),
        });
    }

    let mut sum = 0;
    dbg!(&numbers);
    dbg!(&symbols);

    for symbol in &symbols {
        let mut num1 = 0;

        for number in &numbers {
            if (symbol.y >= (number.y - 1)
                && symbol.y <= (number.y + 1)
                && symbol.x >= (number.x - 1)
                && symbol.x <= (number.x + number.number.to_string().len() as i32))
            {
                if (num1 != 0) {
                    sum += num1 * number.number
                } else {
                    num1 = number.number
                }
            }
        }
    }
    sum
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        const EXAMPLE_INPUT1: &'static str = r#"
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
"#;

        let real_input = include_str!("../inputs/day03.txt");
        assert_eq!(part1(EXAMPLE_INPUT1), 4361);
        assert_eq!(part1(real_input), 556367);

        assert_eq!(part2(EXAMPLE_INPUT1), 467835);
        assert_eq!(part2(real_input), 89471771);
    }
}
