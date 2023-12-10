use std::str::FromStr;

#[derive(Debug)]
struct Race {
    time: u64,
    distance: u64,
}

fn part1(races: Vec<Race>) -> u32 {
    let mut amount_of_wins: Vec<u32> = vec![];

    for race in races {
        let mut win_count = 0;

        for n in 0..race.time {
            if (n * (race.time - n) > race.distance) {
                win_count += 1;
            }
        }

        amount_of_wins.push(win_count);
    }
    amount_of_wins.iter().product()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn day6() {
        let example_input = vec![
            Race {
                time: 7,
                distance: 9,
            },
            Race {
                time: 15,
                distance: 40,
            },
            Race {
                time: 30,
                distance: 200,
            },
        ];

        let real_input = vec![
            Race {
                time: 46,
                distance: 214,
            },
            Race {
                time: 80,
                distance: 1177,
            },
            Race {
                time: 78,
                distance: 1402,
            },
            Race {
                time: 66,
                distance: 1024,
            },
        ];

        assert_eq!(part1(example_input), 288);

        assert_eq!(part1(real_input), 512295);

        let example_input = vec![Race {
            time: 71530,
            distance: 940200,
        }];

        let real_input = vec![Race {
            time: 46807866,
            distance: 214117714021024,
        }];

        assert_eq!(part1(example_input), 71503);

        assert_eq!(part1(real_input), 36530883);
    }
}
