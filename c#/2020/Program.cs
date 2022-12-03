using Seskarpt;
using Seskarpt.Day23;
using System;
using System.Diagnostics;

namespace AdventOfCode2020
{
    internal class Program
    {
        //public const string fileRoot = @"C:\repos\AdventOfCode2020\Seskarpt";
        public const string fileRoot = @"c:\Users\AlbinLjunghusen\source\repos\Albinlj\AdventOfCode2020\Seskarpt";

        public static TimeSpan Time(Func<int> func, int times)
        {
            var stopWatch = Stopwatch.StartNew();

            for (int i = 0; i < times; i++)
            {
                Console.WriteLine(func());
            }
            stopWatch.Stop();
            Console.WriteLine(stopWatch.Elapsed);
            return stopWatch.Elapsed;
        }

        public static TimeSpan Time<T>(Func<T> func, int times)
        {
            var stopWatch = Stopwatch.StartNew();

            for (int i = 0; i < times; i++)
            {
                Console.WriteLine(func());
            }
            stopWatch.Stop();
            Console.WriteLine(stopWatch.Elapsed);
            return stopWatch.Elapsed;
        }

        private static void Main(string[] args)
        {
            Day23.Do();
            "end".Dump(ConsoleColor.Red);
            Console.ReadLine();
        }
    }
}