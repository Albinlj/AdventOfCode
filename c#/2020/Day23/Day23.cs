using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day23
{
    public static class Day23
    {
        public static int currentLowest { get; set; } = 1000000;
        public static int currentHighest { get; set; } = 9;

        public static void Do()
        {
            var input = "389125467";
            //var input = "562893147";
            var list = input.Select(ch => int.Parse(ch.ToString())).ToList();
            list.Insert(0, 1000000);
            //list.AddRange(Enumerable.Range(10, 91 + 10000 - 100 ));

            list.Last().Dump();

            int nextindex = 1;
            for (int i = 0; i < 10000000; i++)
            {
                if (i % 10000 == 0)
                {
                    i.Dump();
                    "WOW".Dump();
                    list.Count.Dump();
                    Console.ReadKey();
                }
                list = DoMove(list, nextindex, out int next);
                nextindex = next;
            }

            var indexofone = list.IndexOf(1);
            var one = list[indexofone + 1];
            var two = list[indexofone + 2];

            var result = one * two;
            Console.WriteLine(result);
            Console.WriteLine(result);
            Console.WriteLine(result);
            Console.WriteLine(result);
            result.Dump(ConsoleColor.Green);
            result.Dump(ConsoleColor.Green);
            result.Dump(ConsoleColor.Green);

            list.DumpEnumerableOneLine();
        }

        private static List<int> DoMove(List<int> input, int index, out int nextIndex)
        {
            void AddMore()
            {
                $"adding more! {input.Count}".Dump(ConsoleColor.Blue);

                int increment = 10;
                input.AddRange(Enumerable.Range(currentHighest + 1, increment));
                currentHighest += increment;
                input.DumpEnumerable(ConsoleColor.Yellow);
                //Console.ReadKey();
            }

            $"Current index {index}".Dump(ConsoleColor.DarkRed);
            if (index + 3 > input.Count)
            {
                AddMore();
            }

            var currentNum = input[index];
            $"current {currentNum}".Dump(ConsoleColor.Yellow);
            //input.DumpEnumerable(ConsoleColor.Red);

            var indexes = Enumerable.Range(index + 1, 3).ToArray();
            var tri = indexes.Select(i => input[i]).ToArray();
            //tri.DumpEnumerable(ConsoleColor.Blue);

            input.RemoveRange(indexes.First(), 3);

            var targetLabel = currentNum - 1;
            //$"target : {targetLabel}".Dump(ConsoleColor.DarkRed);
            while (!input.Contains(targetLabel))
            {
                if (targetLabel == 0)
                    targetLabel = 1000001;
                $"not found {targetLabel}".Dump(ConsoleColor.DarkRed);
                if (targetLabel < currentLowest && targetLabel > 9)
                {
                    //"NOOOOOOO!".Dump(ConsoleColor.Green);
                    input.InsertRange(0, Enumerable.Range(currentLowest - 10, 10));
                    //rest.DumpEnumerable();
                    //Console.ReadKey();
                }
                targetLabel--;
            }

            var targetIndex = input.IndexOf(targetLabel);

            input.InsertRange(targetIndex + 1, tri);

            //input.DumpEnumerable(ConsoleColor.Green);

            nextIndex = (input.IndexOf(currentNum) + 1);

            //Console.ReadKey();
            return input.ToList();
        }
    }
}