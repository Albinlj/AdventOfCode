using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day15
{
    internal static class Day15
    {
        public static void Do()
        {
            var input = new[] { 0, 3, 1, 6, 7, 5 };

            var num = DoTheStuff(input, 30000000).Dump(ConsoleColor.Green);
        }

        private static int DoTheStuff(int[] input, int iterations)
        {
            var dict = new Dictionary<int, int>();

            for (var i = 0; i < input.Length; i++)
                dict.Add(input[i], i);

            //dict.DumpEnumerable(ConsoleColor.Yellow);

            bool wasFirstTime = true;
            int roundDiff = input.Length - input.ToList().IndexOf(0);
            int lastnum = dict.Last().Key;
            for (int i = input.Length; i < iterations; i++)
            {
                //lastnum.Dump(ConsoleColor.Magenta);
                int AddOrChange(int key)
                {
                    wasFirstTime = true;
                    lastnum = key;
                    //$"{key} spoken".Dump();
                    if (dict.TryAdd(key, i)) return key;
                    wasFirstTime = false;
                    int lastSaid = dict[key];
                    roundDiff = i - lastSaid;
                    dict[key] = i;
                    return key;
                }

                if (i % 10000 == 0)
                    i.Dump();
                //i.Dump(ConsoleColor.Red);

                //if (i == 10)
                //    Console.ReadLine();

                AddOrChange(wasFirstTime ? 0 : roundDiff);
                //wasFirstTime.Dump(ConsoleColor.DarkRed);

                //dict.DumpEnumerable();
            }

            return lastnum;
        }
    }
}