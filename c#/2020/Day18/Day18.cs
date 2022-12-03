using AdventOfCode2020;
using System;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day18
{
    public static class Day18
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day18\input.txt");
            //var input = "2 * 3 + (4 * 5)";
            //var input = "5 + (8 * 3 + 9 + 3 * 4 * 3)";
            //var input = "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))";
            //var input = "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2";

            var result = input.Select(Evaluate).Sum().Dump(ConsoleColor.Green);

            //Command[] commands = Parse(input);
        }

        private static long Evaluate(string input)
        {
            input.Dump(ConsoleColor.DarkYellow);
            var parRegex = new Regex(@"(\(+.*)?(\(.*?\))");
            var noParString = input;

            while (parRegex.IsMatch(noParString))
            {
                noParString.Dump(ConsoleColor.Red);
                var groups = parRegex.Match(noParString).Groups;
                noParString = parRegex.Replace(noParString,
                    groups[1] + DoOperations(groups[2].Value.Dump(ConsoleColor.Cyan)).ToString());
                noParString.Dump(ConsoleColor.Green);
            }

            long result = DoOperations(noParString);
            return result;
        }

        private static long DoOperations(string input2)
        {
            var newstring = "" + input2;
            if (newstring.StartsWith('('))
                newstring = newstring.Remove(0, 1);
            if (newstring.EndsWith(')'))
                newstring = newstring.Remove(newstring.Length - 1, 1);

            var plusregex = new Regex(@"(\d+) ([+]) (\d+)");
            while (plusregex.IsMatch(newstring))
            {
                var groups = plusregex.Match(newstring).Groups;

                newstring.Dump();
                DataTable dt = new DataTable();
                var v = dt.Compute($"{groups[1].Value}.0 {groups[2].Value} {groups[3].Value}.0".Dump(ConsoleColor.DarkBlue), "");
                v.Dump();
                var intstring = v.ToString();
                if (intstring.IndexOf('.') != -1)
                    intstring = intstring.Substring(0, intstring.IndexOf('.'));
                intstring.Dump(ConsoleColor.Yellow);

                newstring = plusregex.Replace(newstring, intstring, 1);
                newstring.Dump();

                //Console.ReadKey();
            }

            var opRegex = new Regex(@"(\d+) ([*]) (\d+)");
            while (opRegex.IsMatch(newstring))
            {
                var groups = opRegex.Match(newstring).Groups;

                newstring.Dump();
                DataTable dt = new DataTable();
                var v = dt.Compute($"{groups[1].Value}.0 {groups[2].Value} {groups[3].Value}.0".Dump(ConsoleColor.DarkBlue), "");
                v.Dump();
                var intstring = v.ToString();
                if (intstring.IndexOf('.') != -1)
                    intstring = intstring.Substring(0, intstring.IndexOf('.'));
                intstring.Dump(ConsoleColor.Yellow);

                newstring = opRegex.Replace(newstring, intstring, 1);
                newstring.Dump();

                //Console.ReadKey();
            }

            return Convert.ToInt64(newstring);
        }

        //private static Command[] Parse(string input)
        //{
        //    var inp = $"+ {input}";

        //    var op = inp.Take()
        //}

        private class Command
        {
            public int Value { get; set; }
            public Operator op { get; set; }

            public Command InnerCommand { get; set; }
        }
    }

    internal enum Operator
    {
        Add,
        Multiply
    }
}