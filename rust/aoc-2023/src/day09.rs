use itertools::Itertools;

fn part1(input: &str) -> i32 {
    let extrapolated = extrapolate(input);

    let strut = extrapolated
        .iter()
        .map(|arr| {
            arr.iter()
                .map(|x| x.last().unwrap())
                .collect_vec()
        })
        .collect_vec();

    let kaos = strut
        .iter()
        .map(|ass| {
            ass.iter()
                .rev()
                .fold(0, |acc, curr| curr.clone() + acc)
        })
        .collect_vec();

    kaos.iter().sum()
}

fn extrapolate(input: &str) -> Vec<Vec<Vec<i32>>> {
    let mut histories = input
        .trim()
        .lines()
        .map(|line| {
            line.trim()
                .split_whitespace()
                .map(|num| num.parse::<i32>().unwrap())
                .collect_vec()
        })
        .collect_vec();

    let extrapolated = histories
        .iter()
        .map(|original| {
            let mut history = vec![original.clone()];

            'outer: loop {
                let prev = history.last().unwrap();
                let mut prediction = vec![];

                let mut prev_val =
                    prev.first().unwrap().clone();
                for num in &prev[1..] {
                    let diff = num - prev_val;
                    prediction.push(diff);
                    prev_val = num.clone();
                }

                if (prediction.iter().all(|&num| num == 0))
                {
                    break 'outer;
                }

                history.push(prediction);
            }

            history
        })
        .collect_vec();
    extrapolated
}

fn part2(input: &str) -> i32 {
    let extrapolated = extrapolate(input);

    let strut = extrapolated
        .iter()
        .map(|arr| {
            arr.iter()
                .map(|x| x.first().unwrap())
                .collect_vec()
        })
        .collect_vec();

    let kaos = strut
        .iter()
        .map(|ass| {
            ass.iter()
                .rev()
                .fold(0, |acc, curr| curr.clone() - acc)
        })
        .collect_vec();

    kaos.iter().sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test() {
        const EXAMPLE_INPUT1: &'static str = r#"
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
"#;

        let real_input =
            include_str!("../inputs/day09.txt");

        assert_eq!(part1(EXAMPLE_INPUT1), 114);
        assert_eq!(part1(real_input), 1972648895);

        assert_eq!(part2(EXAMPLE_INPUT1), 2);
        assert_eq!(part2(real_input), 919);
    }
}
