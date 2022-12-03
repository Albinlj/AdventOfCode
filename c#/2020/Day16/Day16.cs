using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day16
{
    internal static class Day16
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day16\input.txt");

            //(int errorRate, var validTickets) = GetErrorRateAndValidTickets(input);

            var rules = GetRulesWithIndexes(input);
            var myTicket = GetYourTicket(input);
            myTicket.DumpEnumerable(ConsoleColor.Blue);

            rules.DumpEnumerable(ConsoleColor.Green);
            "wow".DumpEnumerable(ConsoleColor.Green);

            rules.Where(rule => rule.Field.Contains("departure")).Select(rule => myTicket[rule.TicketIndex]).DumpEnumerable()
                .Aggregate(1, (acc, x) => acc * x).Dump(ConsoleColor.Green);
        }

        private static IEnumerable<Rule> GetRulesWithIndexes(string[] input)
        {
            var rules = GetRules(input).ToList();

            var rulesPossibleIndicesCollection = Enumerable.Repeat(Enumerable.Range(0, rules.Count).ToList(), rules.Count).ToArray();
            var (_, tickets) = GetErrorRateAndValidTickets(input);

            while (rulesPossibleIndicesCollection.Any(ri => ri.Count != 1))
            {
                for (var ruleIndex = 0; ruleIndex < rules.Count; ruleIndex++)
                {
                    var rule = rules[ruleIndex].Dump(ConsoleColor.Yellow);
                    var possibleFieldIndices = rulesPossibleIndicesCollection[ruleIndex];
                    var newPossibleFieldIndices = new List<int>(possibleFieldIndices);
                    //possibleFieldIndices.DumpEnumerable(ConsoleColor.Blue);
                    foreach (var indexOnTicket in possibleFieldIndices)
                    {
                        foreach (var ticket in tickets)
                        {
                            if (rule.IsValidValue(ticket[indexOnTicket])) continue;
                            ticket.DumpEnumerableOneLine(ConsoleColor.DarkCyan);
                            rule.Dump();

                            "invalid!".Dump(ConsoleColor.Red);
                            ticket[indexOnTicket].Dump(ConsoleColor.DarkRed);
                            newPossibleFieldIndices.Remove(indexOnTicket.Dump(ConsoleColor.Red));
                        }
                    }

                    rulesPossibleIndicesCollection[ruleIndex] = newPossibleFieldIndices
;

                    if (newPossibleFieldIndices.Count == 0)
                    {
                        //newPossibleFieldIndices.DumpEnumerable(ConsoleColor.Magenta);
                        throw new Exception();
                    }

                    if (newPossibleFieldIndices.Count == 1)
                    {
                        var foundIndex = newPossibleFieldIndices.First().Dump(ConsoleColor.Cyan);
                        foreach (var rulesPossibleIndices in rulesPossibleIndicesCollection)
                        {
                            if (rulesPossibleIndices.Count() != 1)
                                rulesPossibleIndices.Remove(foundIndex.Dump());
                        }
                    }

                    newPossibleFieldIndices.DumpEnumerable(ConsoleColor.Green);
                    //Console.ReadKey();
                }
            }

            return rules.Select((rule, i) => new Rule(rule, rulesPossibleIndicesCollection[i].First()));
        }

        private static (int, IEnumerable<int[]>) GetErrorRateAndValidTickets(string[] input)
        {
            var rules = GetRules(input);
            var otherTickets = GetOtherTickets(input);
            var validTickets = new List<int[]>(otherTickets);

            List<int> errors = new List<int>();

            foreach (var otherTicket in otherTickets)
                foreach (var value in otherTicket)
                    if (rules.All(rule => IsInvalidValue(rule, value)))
                    {
                        errors.Add(value);
                        validTickets.Remove(otherTicket);
                    }

            return (errors.Sum(), validTickets);
        }

        public static bool IsInvalidValue(this Rule rule, int value)
        {
            var (_, aFrom, aTo, bFrom, bTo, _) = rule;
            return value < aFrom
                   || value > bTo
                   || (value > aTo && value < bFrom);
        }

        public static bool IsValidValue(this Rule rule, int value) => !IsInvalidValue(rule, value);

        private static int[] GetYourTicket(string[] input)
        {
            var i = GetLastRuleIndex(input);
            return input[i + 2].Split(',').Select(int.Parse).ToArray();
        }

        private static int[][] GetOtherTickets(string[] input)
        {
            var i = GetLastRuleIndex(input);
            return input.Skip(i + 5).Select(LineToIntArray).ToArray();
        }

        private static int[] LineToIntArray(string line) => line.Split(',').Select(int.Parse).ToArray();

        private static IEnumerable<Rule> GetRules(string[] input)
        {
            var i = GetLastRuleIndex(input);
            var rules = input.Take(i).Select(line =>
                {
                    var regex = new Regex(@"(.*?): (\d+)-(\d+) or (\d+)-(\d+)");
                    var groups = regex.Match(line).Groups;
                    return new Rule(groups[1].Value,
                        int.Parse(groups[2].Value),
                        int.Parse(groups[3].Value),
                        int.Parse(groups[4].Value),
                        int.Parse(groups[5].Value));
                });
            rules.DumpEnumerable();
            return rules;
        }

        public record Rule(string Field, int AFrom, int ATo, int BFrom, int BTo, int TicketIndex = -1)
        {
            public Rule(Rule rule, int ticketIndex)
                : this(rule.Field, rule.AFrom, rule.ATo, rule.BFrom, rule.BTo, ticketIndex)
            { }
        }

        private static int GetLastRuleIndex(string[] input)
        {
            for (int i = 0; i < input.Length; i++)
            {
                if (input[i] == "")
                    return i;
            }

            return -1;
        }
    }
}