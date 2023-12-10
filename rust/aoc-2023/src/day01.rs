fn part1(input: &str) -> u32 {
    let lines = input.trim().lines();

    let mut sum = 0;

    for line in lines {
        let mut digitcount: u32 = 0;
        let mut digits: Vec<u32> = Vec::new();

        for ch in line.chars() {
            match ch.to_digit(10) {
                Some(d) => {
                    digitcount += 1;
                    digits.push(d);
                }
                None => {}
            }
        }

        sum += digits[0] * 10 + digits[digits.len() - 1]
    }

    sum
}

fn part2(input: &str) -> u32 {
    let lines = input.trim().lines();

    let mut sum = 0;

    for line in lines {
        let mut digitcount: u32 = 0;
        let mut digits: Vec<u32> = Vec::new();

        for (i, ch) in line.chars().enumerate() {
            match ch.to_digit(10) {
                Some(d) => {
                    digitcount += 1;
                    digits.push(d);
                }
                None => {
                    let sub = &line[i..];
                    if sub.starts_with(("one")) {
                        digits.push(1)
                    }
                    if sub.starts_with(("two")) {
                        digits.push(2)
                    }
                    if sub.starts_with(("three")) {
                        digits.push(3)
                    }
                    if sub.starts_with(("four")) {
                        digits.push(4)
                    }
                    if sub.starts_with(("five")) {
                        digits.push(5)
                    }
                    if sub.starts_with(("six")) {
                        digits.push(6)
                    }
                    if sub.starts_with(("seven")) {
                        digits.push(7)
                    }
                    if sub.starts_with(("eight")) {
                        digits.push(8)
                    }
                    if sub.starts_with(("nine")) {
                        digits.push(9)
                    }
                    if sub.starts_with(("zero")) {
                        digits.push(0)
                    }
                }
            }
        }
        sum += digits[0] * 10 + digits[digits.len() - 1]
    }

    sum
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn example1() {
        const EXAMPLE_INPUT1: &'static str = r#"
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
"#;

        const EXAMPLE_INPUT2: &'static str = r#"
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
"#;

        let real_input =
            include_str!("../inputs/day01.txt");

        assert_eq!(part1(EXAMPLE_INPUT1), 142);
        assert_eq!(part1(real_input), 56049);

        assert_eq!(part2(EXAMPLE_INPUT2), 281);
        assert_eq!(part2(real_input), 54530);
    }
}
