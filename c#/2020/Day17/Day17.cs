using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day17
{
    public static class Day17
    {
        public static void Do()
        {
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day17\input.txt");
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day17\input.txt");
            //DoStuff(input, 1);

            DoStuffNotStupidly4d(input, 6).Dump(ConsoleColor.Green);
        }

        private readonly struct Vector
        {
            public readonly int X;
            public readonly int Y;
            public readonly int Z;

            public Vector(int x, int y, int z)
            {
                X = x; Y = y; Z = z;
            }

            public override string ToString()
            {
                return $"[{X: 000}, {Y: 000}, {Z: 000}]";
            }
        }

        private readonly struct Vector4
        {
            public readonly int X;
            public readonly int Y;
            public readonly int Z;
            public readonly int W;

            public Vector4(int x, int y, int z, int w)
            {
                X = x; Y = y; Z = z;
                W = w;
            }

            public override string ToString()
            {
                return $"[{X: 000}, {Y: 000}, {Z: 000}, {W: 000}]";
            }
        }

        private static int DoStuffNotStupidly4d(string[] input, int cycles)
        {
            List<Vector4> Actives = new List<Vector4>();
            for (int y = 0; y < input.Length; y++)
                for (int x = 0; x < input.First().Length; x++)
                    if (input[y][x] == '#')
                        Actives.Add(new Vector4(x, input.Length - y - 1, 0, 0)); ;

            Actives.DumpEnumerable();

            for (int cycle = 0; cycle < cycles; cycle++)
            {
                Dictionary<Vector4, int> influences = new Dictionary<Vector4, int>();
                foreach (var active in Actives)
                {
                    for (int x = -1; x < 2; x++)
                        for (int y = -1; y < 2; y++)
                            for (int z = -1; z < 2; z++)
                                for (int w = -1; w < 2; w++)
                                {
                                    if (x == 0 && y == 0 && z == 0 && w == 0)
                                        continue;
                                    var vector = new Vector4(active.X + x, active.Y + y, active.Z + z, active.W + w);
                                    if (!influences.TryAdd(vector, 1))
                                        influences[vector] = influences[vector] + 1;
                                }
                }

                for (var index = Actives.Count - 1; index >= 0; index--)
                {
                    var active = Actives[index];
                    if (!influences.TryGetValue(active, out int count) || count != 2)
                        Actives.RemoveAt(index);
                }

                foreach (var inf in influences.Where(inf => inf.Value == 3))
                {
                    Actives.Add(inf.Key);
                }

                influences.OrderByDescending(inf => inf.Value).DumpEnumerable(ConsoleColor.Red);

                Actives.DumpEnumerable(ConsoleColor.Green);
            }

            return Actives.Count;
        }

        private static int DoStuffNotStupidly(string[] input, int cycles)
        {
            List<Vector> Actives = new List<Vector>();
            for (int y = 0; y < input.Length; y++)
                for (int x = 0; x < input.First().Length; x++)
                    if (input[y][x] == '#')
                        Actives.Add(new Vector(x, input.Length - y - 1, 0)); ;

            Actives.DumpEnumerable();

            for (int cycle = 0; cycle < cycles; cycle++)
            {
                Dictionary<Vector, int> influences = new Dictionary<Vector, int>();
                foreach (var active in Actives)
                {
                    for (int x = -1; x < 2; x++)
                        for (int y = -1; y < 2; y++)
                            for (int z = -1; z < 2; z++)
                            {
                                if (x == 0 && y == 0 && z == 0)
                                    continue;
                                var vector = new Vector(active.X + x, active.Y + y, active.Z + z);
                                if (!influences.TryAdd(vector, 1))
                                    influences[vector] = influences[vector] + 1;
                            }
                }

                for (var index = Actives.Count - 1; index >= 0; index--)
                {
                    var active = Actives[index];
                    if (!influences.TryGetValue(active, out int count) || count != 2)
                        Actives.RemoveAt(index);
                }

                foreach (var inf in influences.Where(inf => inf.Value == 3))
                {
                    Actives.Add(inf.Key);
                }

                influences.OrderByDescending(inf => inf.Value).DumpEnumerable(ConsoleColor.Red);

                Actives.DumpEnumerable(ConsoleColor.Green);
            }

            return Actives.Count;
        }

        public class Space
        {
            public Space(int size)
            {
                Layers = new List<List<int>>();
                for (int depth = 0; depth < size; depth++)
                {
                    var newLayer = (new List<int>());
                    for (int y = 0; y < size; y++) newLayer.Add(0);
                    Layers.Add(newLayer);
                }
            }

            public Space(List<int> layer)
            {
                Layers = new List<List<int>>() { layer };
            }

            public void Set(int x, int y, int z)
            {
                Layers[z].Get(x, y);
            }

            public bool Get(int x, int y, int z)
            {
                return Layers[z].Get(x, y);
            }

            public int Size => Layers.First().Count;

            public List<List<int>> Layers { get; set; }
        }

        private static bool Get(this List<int> layer, int x, int y)
        {
            return (layer[y] & (1 << x)) != 0;
        }

        private static void Set(this List<int> layer, int x, int y)
        {
            layer[y] = layer[y] | (1 << x);
        }

        private static int DoStuff(string[] input, int cycles)
        {
            var initialLayer = input.Select(str => str.Replace('.', '0').Replace('#', '1')).Select(str => Convert.ToInt32(str, 2) << cycles).ToList();

            initialLayer.AddRange(Enumerable.Repeat(0, cycles));
            initialLayer.InsertRange(0, Enumerable.Repeat(0, cycles));

            initialLayer.DumpLayer();

            var oldSpace = new Space(initialLayer);

            for (int i = 0; i < cycles; i++)
            {
                var size = oldSpace.Size;
                var newSpace = new Space(size);

                for (int z = 0; z < size; z++)
                    for (int y = 0; y < size; y++)
                        for (int x = 0; x < size; x++)
                        {
                        }

                oldSpace = newSpace;
            }

            return 0;
        }

        private static List<List<int>> GetShiftedLayers(this List<int> initialLayer)
        {
            var lineCount = initialLayer.Count;

            var layers = new List<List<int>>();

            var leftShift = initialLayer.Select(x => x << 1).ToList();
            var rightShift = initialLayer.Select(x => x >> 1).ToList();

            var downLeftShift = new List<int>(leftShift);
            downLeftShift.Insert(0, 0);
            downLeftShift.RemoveAt(lineCount);

            var upLeftShift = new List<int>(leftShift);
            upLeftShift.RemoveAt(0);
            upLeftShift.Add(0);

            var downRightShift = new List<int>(rightShift);
            downRightShift.Insert(0, 0);
            downRightShift.RemoveAt(lineCount);

            var upRightShift = new List<int>(rightShift);
            upRightShift.RemoveAt(0);
            upRightShift.Add(0);

            var upShift = new List<int>(initialLayer);
            upShift.RemoveAt(0);
            upShift.Add(0);

            var downShift = new List<int>(initialLayer);
            downShift.Insert(0, 0);
            downShift.RemoveAt(lineCount);

            layers.Add(upLeftShift);
            layers.Add(upShift);
            layers.Add(upRightShift);

            layers.Add(leftShift);
            layers.Add(rightShift);
            layers.Add(downLeftShift);
            layers.Add(downShift);
            layers.Add(downRightShift);
            layers.Add(initialLayer);

            return layers;
        }
    }
}