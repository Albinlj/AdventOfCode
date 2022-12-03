using AdventOfCode2020;
using System;
using System.Collections.Generic;

namespace Seskarpt.Day8
{
    internal static class Day8
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day8\input.txt");

            input.Run(out var looped).Dump(ConsoleColor.Green);
            input.Repair().Dump(ConsoleColor.DarkGreen);
        }

        private static bool Run(this string[] input, out int acc)
        {
            acc = 0;
            int i = 0;

            var visited = new List<int>();
            while (!visited.Contains(i) && i < input.Length)
            {
                visited.Add(i);
                var line = (input[i]);
                var argument = int.Parse(line.Substring(4));

                switch (line.Substring(0, 3))
                {
                    case "acc":
                        acc += argument;
                        break;

                    case "jmp":
                        i += argument;
                        continue;
                }

                i++;
                if (i == input.Length - 1) return true;
            }
            return false;
        }

        private static int Repair(this string[] input)
        {
            var inp = (string[])input.Clone();
            var toChange = 0;

            int acc;

            while (!Run(inp, out acc))
            {
                if (toChange != 0)
                    Flip(toChange, ref inp);
                toChange++;
                toChange.Dump();
                Flip(toChange, ref inp);
            }

            return acc;
        }

        private static void Flip(int i, ref string[] input)
        {
            i.Dump(ConsoleColor.Red);
            var instruction = input[i].Substring(0, 3);
            switch (instruction)
            {
                case "jmp":
                    input[i] = $"nop{input[i].Substring(3)}".Dump();
                    break;

                case "nop":
                    input[i] = $"jmp{input[i].Substring(3)}".Dump();
                    break;
            }
        }
    }
}