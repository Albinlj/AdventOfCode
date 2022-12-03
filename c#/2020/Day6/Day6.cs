using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day6
{
    internal class Day6
    {
        public static void Do()
        {
            var input = ReadFile();

            var countShared = input.ToList().Select(GetSharedBits).Select(CountSetBits).Sum();
            Console.WriteLine(countShared);

            var countAll = input.ToList().Select(GetAllBits).Select(CountSetBits).Sum();
            Console.WriteLine(countAll);
        }

        private static int GetSharedBits(IEnumerable<int> binaries)
        {
            return binaries.Skip(1).Aggregate(binaries.First(), (acc, i) => acc & i);
        }

        private static int GetAllBits(IEnumerable<int> binaries)
        {
            return binaries.Aggregate(0, (acc, i) => acc | i);
        }

        private static int CountSetBits(int n)
        {
            int count = 0;
            while (n > 0)
            {
                count += n & 1;
                n >>= 1;
            }
            return count;
        }

        private static IEnumerable<IEnumerable<int>> ReadFile()
        {
            using var file = new System.IO.StreamReader(@$"{Program.fileRoot}\day6\input.txt");
            var list = new List<List<int>>() { new List<int>() };
            string line;
            while ((line = file.ReadLine()) != null)
                if (line == "")
                    list.Add(new List<int>());
                else
                    list.Last().Add(CharStringToBinary(line));

            return list;
        }

        public static int CharStringToBinary(string str)
        {
            return str.Aggregate(0, (current, cha) => current | 1 << (cha - 97));
        }
    }
}