using AdventOfCode2020;
using System;
using System.Linq;
using System.Numerics;

namespace Seskarpt.Day11
{
    internal static class Day11
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day11\smallinput.txt");
            var input = System.IO.File.ReadAllText(@$"{Program.fileRoot}\day11\smallinput.txt");
            var width = System.IO.File.ReadLines(@$"{Program.fileRoot}\day11\smallinput.txt").First().Length.Dump();

            FindOccupiedSeatCountWhenStable(input, width).Dump(ConsoleColor.Green);
        }

        private static int FindOccupiedSeatCountWhenStable(string input, int width)
        {
            var bitString = input.Replace('L', '1').Replace('.', '0').Replace(System.Environment.NewLine, "");
            var seats = bitString.BinaryToBigInteger();

            int height = input.Length / width;

            //seats.Print(width);

            Console.WriteLine();
            var lastArrangement = seats;
            (seats >> 1).Print(width);
            (seats >> 2).Print(width);
            (seats >> 3).Print(width);
            (seats << 1).Print(width);
            (seats << 2).Print(width);
            (seats << 3).Print(width);

            //lastArrangement.Print(width);

            while (true)
            {
                finalArrangement = GoOneRound(finalArrangement, width, height);
                finalArrangement.Print(width);
                if (lastArrangement == finalArrangement)
                    break;
                lastArrangement = finalArrangement;
            }

            //return finalArrangement.Count(seat => seat == '#');
            return 0;
        }

        private static string GoOneRound(BigInteger input, int width)
        {
            int height = input.Length / width;
            var builder = new StringBuilder();
            for (int i = 0; i < input.Length; i++)
            {
                var count = 0;
                bool topEdge = (i > width - 1 && input[i - width] == '#');
                bool leftEdge = i % width > 0 && input[i - 1] == '#';
                bool rightEdge = (i % width != width - 1 && input[i + 1] == '#');
                bool bottomEdge = (i < width * (height - 1) && input[i + width] == '#');

                if (topEdge)
                    count++;
                if (leftEdge)
                    count++;
                if (rightEdge)
                    count++;
                if (bottomEdge)
                    count++;

                if (topEdge && leftEdge)
                    count++;
                if (topEdge && rightEdge)
                    count++;
                if (bottomEdge && leftEdge)
                    count++;
                if (bottomEdge && rightEdge)
                    count++;

                builder.Append(count switch
                {
                    0 when input[i] == 'L' => '#',
                    >= 4 when input[i] == '#' => 'L',
                    _ => input[i]
                });
            }
        }

        private static BigInteger Print(this BigInteger intput, int width)
        {
            var input = intput.ToBinaryString();
            var height = input.Length / width;
            for (int i = 0; i < height; i++)
                Console.WriteLine(input.Substring(i * width, width));
            Console.WriteLine(input.Substring(height * width, input.Length % width));
            Console.WriteLine();
            return intput;
        }
    }
}