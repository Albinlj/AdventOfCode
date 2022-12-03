using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Seskarpt.Day11
{
    internal static class Day11
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day11\smallinput.txt");
            //var input = System.IO.File.ReadAllText(@$"{Program.fileRoot}\day11\smallinput.txt");
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day11\input.txt").ToList();

            FindOccupiedSeatCountWhenStable(input).Dump(ConsoleColor.Green);
        }

        private static int FindOccupiedSeatCountWhenStable(List<string> input)
        {
            var seats = new Seating(input);
            Seating lastArrangement = seats;

            seats.Seats.DumpEnumerable();

            Seating finalArrangement;
            while (true)
            {
                finalArrangement = GoOneRound(lastArrangement);
                finalArrangement.Print();
                if (lastArrangement.Seats.SequenceEqual(finalArrangement.Seats))
                    break;
                lastArrangement = finalArrangement;
            }

            return finalArrangement.Seats.Sum(line => line.Count(ch => ch == '#'));
        }

        private static Seating GoOneRound(Seating input)
        {
            var builder = new StringBuilder();
            var countBuilder = new StringBuilder();

            for (int y = 0; y < input.Heigth; y++)
            {
                for (int x = 0; x < input.Width; x++)
                {
                    var seats = input.Seats;
                    var current = seats[y][x];
                    if (current == '.')
                    {
                        builder.Append('.');
                        countBuilder.Append('.');
                        continue;
                    }
                    var count = 0;

                    bool IsSeatedInDirection(int startX, int startY, int dirX, int dirY)
                    {
                        int checkX = startX + dirX;
                        int checkY = startY + dirY;
                        char checkChar;
                        do
                        {
                            var leftEdge = checkX == -1;
                            var rightEdge = (checkX) == input.Width;
                            var topEdge = checkY == -1;
                            var bottomEdge = (checkY) == input.Heigth;

                            if (leftEdge || rightEdge || topEdge || bottomEdge)
                                return false;
                            checkChar = input.Seats[checkY][checkX];

                            checkX += dirX;
                            checkY += dirY;
                        } while (checkChar == '.');
                        return checkChar == '#';
                    }

                    for (int dirX = -1; dirX <= 1; dirX++)
                    {
                        for (int dirY = -1; dirY <= 1; dirY++)
                        {
                            if (dirX == 0 && dirY == 0)
                                continue;
                            if (IsSeatedInDirection(x, y, dirX, dirY))
                                count++;
                        }
                    }

                    countBuilder.Append(count);

                    switch (current)
                    {
                        case 'L' when count == 0:
                            builder.Append('#');
                            break;

                        case '#' when count >= 5:
                            builder.Append('L');
                            break;

                        default:
                            builder.Append(current);
                            break;
                    }
                }

                if (y != input.Heigth - 1)
                {
                    builder.Append('X');
                }
            }

            var str = builder.ToString();
            var newSeating = str.Split('X').ToList();

            var countstr = countBuilder.ToString();
            var newSeatingCount = countstr.Split('X').ToList();
            new Seating(newSeatingCount).Print();

            return new Seating(newSeating);
        }

        private static Seating Print(this Seating input)
        {
            foreach (var str in input.Seats)
                Console.WriteLine(str);
            Console.WriteLine();
            return input;
        }

        record Seating
        {
            public int Width => Seats.First().Length;
            public int Heigth => Seats.Count;
            public List<string> Seats { get; }

            public Seating(List<string> seats) => this.Seats = seats;
        }
    }
}