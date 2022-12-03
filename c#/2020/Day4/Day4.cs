using AdventOfCode2020;
using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day4
{
    public static class Day4
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllText(@$"{Program.fileRoot}\day4\input.txt");
            var split = input.Split(Environment.NewLine + Environment.NewLine);
            var validCount = split.Count(IsValidPassport);
            Console.WriteLine(validCount);
        }

        private static bool IsValidPassport(string s)
        {
            var regexes = new[] {
                new Regex( @"byr:(19[2-8][0-9]|199[0-9]|200[0-2])(\s|$)"),
                new Regex( @"iyr:(201[0-9]|2020)(\s|$)"),
                new Regex( @"eyr:(202[0-9]|2030)(\s|$)"),
                new Regex( @"hcl:#[\da-f]{6}(\s|$)"),
                new Regex( @"hgt:((1[5-8][0-9]|19[0-3])cm|(59|6[0-9]|7[0-6])in)(\s|$)"),
                new Regex( @"ecl:(amb|blu|brn|gry|grn|hzl|oth)(\s|$)"),
                new Regex( @"pid:\d{9}(\s|$)"),
            };

            return regexes.All(r => r.IsMatch(s));
        }
    }
}