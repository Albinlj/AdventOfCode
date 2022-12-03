using AdventOfCode2020;
using System;
using System.Linq;

namespace Seskarpt.Day5
{
    internal class Day5
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day5\input.txt");
            Console.WriteLine(GetMaxId(input));
            Console.WriteLine(GetMissingId(input));
        }

        public static int GetMaxId(string[] input)
        {
            return input.ToList().Max(GetSeatId);
        }

        public static int GetMissingId(string[] input)
        {
            var allRows = Enumerable.Range(0, 128);
            var allCols = Enumerable.Range(0, 8);
            var allIds = allRows.SelectMany(row => allCols.Select(col => row * 8 + col));

            var inputIds = input.Select(GetSeatId).ToList();

            return allIds.FirstOrDefault(id => !inputIds.Contains(id)
                                               && inputIds.Contains(id + 1)
                                               && inputIds.Contains(id - 1));
        }

        public static int GetSeatId(string str)
        {
            var rowString = str.Substring(0, 7);
            var row = CharsToBinary(rowString, 'B');

            var colString = str.Substring(7, 3);
            var col = CharsToBinary(colString, 'R');

            return row * 8 + col;
        }

        private static int CharsToBinary(string str, char upperChar)
        {
            int num = 0;
            foreach (var ch in str)
            {
                if (ch == upperChar)
                    num += 1;
                num <<= 1;
            }

            num >>= 1;
            return num;
        }
    }
}