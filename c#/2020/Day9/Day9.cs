using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day9
{
    internal static class Day9
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day9\input.txt");
            var parsedLongs = input.Select(long.Parse);

            var invalidNumber = FindNumberNotSumOfPrecedingNumbers(parsedLongs, 25).Dump(ConsoleColor.Green);

            var (a, b) = GetSmallestAndLargestOfContigousSetWithSum(parsedLongs, invalidNumber).Dump(ConsoleColor.Green);
            (a + b).Dump(ConsoleColor.Green);
        }

        private static (long, long) GetSmallestAndLargestOfContigousSetWithSum(IEnumerable<long> input, long invalidNumber)
        {
            var list = input.ToList();

            var startIndex = 0;
            int i = 1;

            while (startIndex < list.Count)
            {
                long lowest;
                long highest;
                long sum = lowest = highest = list[startIndex];
                //sum.Dump(ConsoleColor.DarkGreen);
                i = startIndex + 1;
                if (i > input.Count()) return (-2, -2);

                while (true)
                {
                    //(i - startIndex).Dump(ConsoleColor.Magenta);
                    var current = list[i];
                    if (current < lowest)
                        lowest = current;
                    if (current > highest)
                        highest = current;
                    //current.Dump(ConsoleColor.Red);
                    sum += current;
                    //sum.Dump(ConsoleColor.Blue);
                    if (current > invalidNumber) return (-1, -1);
                    if (sum > invalidNumber) break;
                    if (sum == invalidNumber)
                    {
                        sum.Dump(ConsoleColor.DarkGreen);

                        return (lowest, highest);
                    }

                    i++;
                }

                startIndex++;
                //startIndex.Dump(ConsoleColor.Cyan);
            }

            return (0, 0);
        }

        private static long FindNumberNotSumOfPrecedingNumbers(IEnumerable<long> input, int preambleCount)
        {
            var inputList = input.ToList();
            var queue = new Queue<long>();
            foreach (var preNum in input.Take(preambleCount))
                queue.Enqueue(preNum);

            for (int i = preambleCount; i < inputList.Count(); i++)
            {
                var newNum = inputList[i];
                if (!FindPair(queue, newNum, out int a, out int b)) return newNum;
                queue.Dequeue();
                queue.Enqueue(newNum);
            }

            return 0;
        }

        public static bool FindPair(IEnumerable<long> input, long goal, out int a, out int b)
        {
            var len = input.Count();
            var list = input.ToList();

            for (int i = 0; i < len; i++)
            {
                var iNum = list[i];
                for (int k = i + 1; k < len; k++)
                {
                    var kNum = list[k];
                    //Console.WriteLine($"{iNum:D4}, , {kNum:D4} --- {iNum + kNum}");

                    if (iNum + kNum == goal)
                    {
                        a = i;
                        b = k;
                        return true;
                    }
                }
            }

            a = b = -1;
            return false;
        }
    }
}