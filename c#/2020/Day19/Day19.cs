using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day19
{
    public static class Day19
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day17\input.txt");
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day19\smallinput.txt");
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day19\myinput.txt");

            var (rules, messageStrings) = ParseRules(input);

            int count = GetMatchCount(messageStrings, rules);
            count.Dump(ConsoleColor.Green);
            count.Dump(ConsoleColor.Green);
            count.Dump(ConsoleColor.Green);
        }

        private static (IEnumerable<Rule>, IEnumerable<string>) ParseRules(string[] input)
        {
            var ruleStrings = input.TakeWhile(line => line != "").DumpEnumerable();

            var ruleStringDict = ruleStrings.ToDictionary(line => new Rule(int.Parse(line.Substring(0, line.IndexOf(':')))),
                line => line.Substring(line.IndexOf(':') + 1)).DumpEnumerable();
            ruleStringDict.DumpEnumerable(ConsoleColor.Yellow);
            var rules = ruleStringDict.Select(pair => pair.Key);
            foreach (var (key, value) in ruleStringDict)
            {
                var regex = new Regex("( ?\\d+ ?)*\\|?( ?\\d+ ?)*");
                var groups = regex.Match(value).Groups;

                key.RulesA = groups[1]
                    .Captures.Select(capture => capture.Value.Trim())
                    .Select(id => rules.First(rule => rule.Id == int.Parse(id)))
                    .ToArray();

                key.RulesB = groups[2]
                    .Captures.Select(capture => capture.Value.Trim())
                    .Select(id => rules.First(rule => rule.Id == int.Parse(id)))
                    .ToArray();

                groups[3].Value.Dump(ConsoleColor.DarkYellow);
                var regex2 = new Regex("\"(\\w)\"");

                var match2 = regex2.Match(value);
                if (regex2.Match(value).Success)
                {
                    "laser".Dump();
                    key.Ch = match2.Groups[1].Value[0].Dump(ConsoleColor.DarkMagenta);
                }
            }

            var messageStrings = input.Skip(ruleStrings.Count() + 1).DumpEnumerable();

            rules.DumpEnumerable(ConsoleColor.Cyan);
            return (rules, messageStrings);
        }

        private static int GetMatchCount(IEnumerable<string> messageStrings, IEnumerable<Rule> rules)
        {
            var rule0 = rules.First(rule => rule.Id == 0);

            var count = 0;
            foreach (var messageString in messageStrings)
            {
                $"Attemtping to match {messageString}".Dump(ConsoleColor.DarkGreen);
                if (rule0.Matches(messageString, out var _).Dump(ConsoleColor.DarkRed))//oboe
                    count++;
            }

            messageStrings.Count(message => rule0.Matches(message, out var _)).Dump(ConsoleColor.Yellow);

            return count;
        }
    }

    internal class Rule
    {
        public int Id { get; }

        public Rule(int id)
        {
            Id = id;
        }

        public Rule[] RulesA { get; set; }
        public Rule[] RulesB { get; set; }
        public char Ch { get; set; }

        public override string ToString()
        {
            string rulesA = string.Join(",", RulesA?.Select(rule => rule.Id.ToString()) ?? Enumerable.Empty<string>());
            string rulesB = string.Join(",", RulesB?.Select(rule => rule.Id.ToString()) ?? Enumerable.Empty<string>());
            return $"Rule {Id}\t Rules: {rulesA} \t| {rulesB} \t char: {Ch} ";
        }

        public bool Matches(string messageString, out int lastIndex, int index = 0)
        {
            ("matching " + this.ToString() + "\t" + index).Dump(ConsoleColor.Blue);
            lastIndex = 9999;

            if (index >= messageString.Length)
            {
                $"index {index} too high".Dump();
                return false;
            }

            if (Ch != default(char))
            {
                index.Dump(ConsoleColor.DarkGreen);
                Ch.Dump(ConsoleColor.DarkGray);
                var currChar = messageString[index].Dump(ConsoleColor.DarkMagenta);
                if (messageString[index] != Ch) return false;
                lastIndex = index;
                return true;
            }

            bool allAMatches = true;
            int aIndex = 0;
            foreach (var rule in RulesA)
            {
                if (rule.Matches(messageString, out var theLastIndex, index + aIndex))
                    aIndex = theLastIndex;
                else
                {
                    allAMatches = false;
                    break;
                }
            }
            if (allAMatches)
                return true;

            int bIndex = 0;
            foreach (var rule in RulesB)
            {
                if (rule.Matches(messageString, out var theLastIndex, index + bIndex))
                    bIndex = theLastIndex;
                else
                    return false;
            }

            return true; // or false...
        }
    }
}