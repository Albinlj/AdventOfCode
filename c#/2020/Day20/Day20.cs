using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day20
{
    public static class Day20
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day20\input.txt");

            List<Tile> tiles = new List<Tile>();
            for (int i = 0; i < input.Length / 12; i++)
            {
                var startindex = 12 * i;
                tiles.Add(new Tile(
                    int.Parse(input[startindex].Substring(5, 4)),
                        input.Skip(startindex + 1).Take(10).ToArray())
                    );
            }

            tiles[1].Id.Dump();
            tiles[1].Chars.DumpEnumerable();

            "yo".DumpEnumerable();
            tiles[1].Edges.DumpEnumerable();

            var dict = tiles.ToDictionary(tile => tile,
                tile => tiles.Where(otherTile => otherTile.Edges.Any(edge => tile.Edges.Contains(edge))));

            dict.Select(pair => pair.Value.Count()).DumpEnumerable();
            var corners = dict.Where(pair => pair.Value.Count() == 3).Select(pair => pair.Key.Id).DumpEnumerable();

            corners.Aggregate(1l, (a, b) => a * b).Dump(ConsoleColor.Green);
            //.Dump(ConsoleColor.Green);
        }
    }

    public class Tile
    {
        public Tile(int id, string[] chars)
        {
            Id = id;
            Chars = chars;
        }

        public string[] Chars { get; }
        public int Id { get; }

        public string[] Edges
        {
            get
            {
                var a = Chars[0];
                var b = Chars[9];
                var c = new string(Chars.Select(line => line[0]).ToArray());
                var d = new string(Chars.Select(line => line[9]).ToArray());

                var ar = new string(a.Reverse().ToArray());
                var br = new string(b.Reverse().ToArray());
                var cr = new string(c.Reverse().ToArray());
                var dr = new string(d.Reverse().ToArray());

                return new string[] { a, b, c, d, ar, br, cr, dr };
            }
        }

        public override string ToString()
        {
            return $"Tile {Id}, edges: {string.Join("   ", Edges)} end!";
        }
    }
}