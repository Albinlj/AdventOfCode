using AdventOfCode2020;
using System;

namespace Seskarpt.Day12
{
    internal static class Day12
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day11\smallinput.txt");
            //var width = System.IO.File.ReadLines(@$"{Program.fileRoot}\day11\smallinput.txt").First().Length.Dump();
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day12\smallinput.txt");
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day12\input.txt");

            GetManHattanDistanceAtEndB(input).Dump(ConsoleColor.Green);
        }

        private static int GetManHattanDistanceAtEndB(string[] input)
        {
            int x = 0;
            int y = 0;

            int wx = 10;
            int wy = 1;

            foreach (var command in input)
            {
                var action = command[0];
                var value = int.Parse(command.Substring(1));
                action.Dump(ConsoleColor.Blue);
                value.Dump(ConsoleColor.Red);

                int rotation = 0;

                switch (action)
                {
                    case 'N':
                        wy += value;
                        break;

                    case 'S':
                        wy -= value;
                        break;

                    case 'E':
                        wx += value;
                        break;

                    case 'W':
                        wx -= value;
                        break;

                    case 'L':
                        rotation = value;
                        break;

                    case 'R':
                        rotation = -value;
                        break;

                    case 'F':
                        x += wx * value;
                        y += wy * value;
                        break;
                }

                var oldwx = wx;
                var oldwy = wy;
                rotation.Dump(ConsoleColor.DarkMagenta);
                var l = (rotation + 9000000000000) % 360;
                l.Dump(ConsoleColor.DarkRed);
                switch (l)
                {
                    case 90:
                        wx = -oldwy;
                        wy = oldwx;
                        break;

                    case 180:
                        wx = -oldwx;
                        wy = -oldwy;
                        break;

                    case 270:
                        wx = oldwy;
                        wy = -oldwx;
                        break;
                }

                wx.Dump(ConsoleColor.Cyan);
                wy.Dump(ConsoleColor.Cyan);
                x.Dump();
                y.Dump();
                "".Dump();
            }

            return Math.Abs(x) + Math.Abs(y);
        }

        private static int GetManHattanDistanceAtEnd(string[] input)
        {
            var direction = 0;

            int x = 0;
            int y = 0;

            foreach (var command in input)
            {
                var action = command[0];
                action.Dump(ConsoleColor.Blue);
                var value = int.Parse(command.Substring(1));
                value.Dump(ConsoleColor.Red);

                switch (action)
                {
                    case 'N':
                        y += value;
                        break;

                    case 'S':
                        y -= value;
                        break;

                    case 'E':
                        x += value;
                        break;

                    case 'W':
                        x -= value;
                        break;

                    case 'L':
                        direction.Dump(ConsoleColor.Magenta);
                        direction += value / 90;
                        direction.Dump(ConsoleColor.Magenta);
                        break;

                    case 'R':
                        value.Dump(ConsoleColor.Magenta);
                        direction.Dump(ConsoleColor.Magenta);
                        direction -= value / 90;
                        direction.Dump(ConsoleColor.Magenta);
                        break;

                    case 'F':
                        switch ((direction + 4000) % 4)

                        {
                            case 0:
                                x += value;
                                break;

                            case 1:
                                y += value;
                                break;

                            case 2:
                                x -= value;
                                break;

                            case 3:
                                y -= value;
                                break;
                        }
                        break;
                }

                x.Dump();
                y.Dump();
                "".Dump();
            }

            return Math.Abs(x) + Math.Abs(y);
        }
    }
}