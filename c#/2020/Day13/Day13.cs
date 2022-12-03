using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day13
{
    internal static class Day13
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day13\input.txt");

            //var timestamp = int.Parse(input[0]);
            //var ids = input[1].Split(',').Where(ch => ch != "x").DumpEnumerable().Select(int.Parse);
            //GetEarliestBusIDMultipliedByWaitTime(timestamp, ids).Dump(ConsoleColor.Green);

            //var input = "17,x,13,19";
            //var input = "67,7,59,61";
            //var input = "1789,37,47,1889";
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day13\input.txt")[1];

            var ids2 = input.Split(',').Select((id, i) => new
            {
                Id = int.TryParse(id, out var integer) ? integer : 0,
                Index = i
            })
                .Where(pair => pair.Id != 0)
                .ToDictionary(x => x.Id, x => x.Index);

            var result = GetEarliestTimeStampWithContiguousDepartures(ids2).Dump(ConsoleColor.Green);
            Console.WriteLine(result);
            "wow".Dump();
        }

        private static ulong GetEarliestTimeStampWithContiguousDepartures(Dictionary<int, int> ids)
        {
            ids.DumpEnumerable();
            ulong max = (ulong)ids.Max(id => id.Key);
            "".Dump();

            ulong timeStamp = max * 100000000000;

            ulong goal = 0;
            foreach (var id in ids)
            {
                goal |= (ulong)1 << id.Value;
                goal.DumpBinary();
            }

            "goal".Dump();
            goal.DumpBinary(ConsoleColor.Green);

            while (true)
            {
                //timeStamp.Dump(ConsoleColor.Cyan);
                foreach (var (key, value) in ids)
                {
                    int shift = (int)(value + key * Math.Ceiling((double)timeStamp / key) %
                                       timeStamp);

                    int total = shift;
                    //shift.Dump(ConsoleColor.Yellow);
                    while (total < value)
                        total += key;
                    if (shift == value) continue;
                    if (shift > value) break;
                    return timeStamp;
                }

                timeStamp.Dump();

                if (timeStamp > 100000000000000)
                    timeStamp.Dump(ConsoleColor.Red);

                timeStamp += max;
            }
        }
    }
}

//