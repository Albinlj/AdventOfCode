using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day10
{
    internal static class Day10
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day10\input.txt");
            var parsed = input.Select(long.Parse);

            var sorted = parsed.ToList();
            sorted.Sort();

            GetPossibleArrangementCountB(sorted).Dump(ConsoleColor.Green);
        }

        private static long GetPossibleArrangementCountB(List<long> adapters)
        {
            var possibleJumps = GetJumpCounts(adapters);

            long total = 1;

            var thingie = new List<int>();
            foreach (var i in possibleJumps)
            {
                if (i != 1)
                    thingie.Add(i);
                else if (thingie.Count > 0)
                {
                    thingie.Add(i);
                    total *= GetPossibleArrangementsRecursive(thingie);
                    thingie.Clear();
                }
            }

            return total;
        }

        private static List<int> GetJumpCounts(List<long> adapters)
        {
            List<int> jumpCounts = Enumerable.Repeat(0, adapters.Count).ToList();
            for (int i = 0; i < adapters.Count; i++)
            {
                var thisJoltage = adapters[i];
                for (int j = 1; j < 4; j++)
                    if (i + j >= adapters.Count)
                        break;
                    else if (adapters[i + j] <= thisJoltage + 3)
                        jumpCounts[i] = jumpCounts[i] + 1;
            }

            return jumpCounts;
        }

        private static long GetPossibleArrangementsRecursive(List<int> jumps, int index = 0)
        {
            if (index >= jumps.Count) return 1;
            return Enumerable.Range(1, jumps[index]).Sum(n => GetPossibleArrangementsRecursive(jumps, index + n));
        }

        private static long GetJoltDifferences(IEnumerable<long> input)
        {
            var dic = new Dictionary<long, long>();

            long prev = 0;
            foreach (var l in input)
            {
                Increment(dic, l - prev);
                prev = l;
            }
            Increment(dic, 3);
            return dic[1] * dic[3];
        }

        private static void Increment(Dictionary<long, long> dic, long l)
        {
            if (dic.ContainsKey(l))
                dic[l] = dic[l] + 1;
            else
                dic.Add(l, 1);
        }
    }
}