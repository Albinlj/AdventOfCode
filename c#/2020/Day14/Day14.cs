using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day14
{
    internal static class Day14
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day14\input.txt");
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day14\smallinput.txt");
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day14\smallinput2.txt");

            //MemoryStuff(input).Dump(ConsoleColor.Green);
            MemoryStuffB(input).Dump(ConsoleColor.Green);
        }

        private static ulong MemoryStuffB(string[] input)
        {
            var memory = new Dictionary<ulong, ulong>();
            ulong maskDec = 0;
            int[] xIndexes = new int[0];
            foreach (var line in input)
            {
                if (line.StartsWith("mask"))
                {
                    var maskBinString = line.Split('=')[1].Trim().Dump(ConsoleColor.Blue);
                    maskDec = Convert.ToUInt64(maskBinString.Replace('X', '0').Dump(ConsoleColor.DarkGreen), 2);
                    xIndexes = maskBinString.Select((ch, i) => ch == 'X' ? i : -1).Where(num => num != -1).ToArray();
                }
                else
                {
                    var valueDecString = line.Split('=')[1].TrimStart();
                    var value = Convert.ToUInt64(valueDecString);

                    var indexDecString = line.Substring(line.IndexOf('[') + 1, line.IndexOf(']') - 4);
                    var indexDec = Convert.ToUInt64(indexDecString);
                    var indexBinString = Convert.ToString((long)indexDec, 2).PadLeft(36).Dump();
                    var maskedUlong = indexDec | maskDec;

                    List<ulong> indexes = new List<ulong>() { maskedUlong };
                    Convert.ToString((long)maskedUlong, 2).PadLeft(36).Dump(ConsoleColor.DarkMagenta);

                    foreach (var index in xIndexes)
                    {
                        var copied = new List<ulong>(indexes.Select(num => num ^ 1ul << (35 - index)).ToList());
                        indexes.AddRange(copied);
                    }

                    foreach (var i in indexes)
                    {
                        Convert.ToString((long)i, 2).PadLeft(36, '0').Dump(ConsoleColor.Yellow);
                        Convert.ToString((long)maskDec, 2).PadLeft(36).Dump(ConsoleColor.Red);
                        if (!memory.TryAdd(i, value))
                            memory[i] = value;
                    }
                }
            }
            return memory.Aggregate(0UL, (a, c) => a + c.Value);
        }

        private static ulong MemoryStuff(string[] input)
        {
            var memory = new Dictionary<ulong, ulong>();
            string mask = "";
            foreach (var line in input)
            {
                if (line.StartsWith("mask"))
                {
                    mask = line.Split('=')[1].TrimStart().Dump();
                }
                else
                {
                    var indexUlongString = line.Substring(line.IndexOf('[') + 1, line.IndexOf(']') - 4).Dump();
                    var indexUlong = Convert.ToUInt64(indexUlongString);

                    var valueUlongString = line.Split('=')[1].TrimStart().Dump(ConsoleColor.Red);
                    var valueBitString = Convert.ToString((long)Convert.ToUInt64(valueUlongString), 2).Dump(ConsoleColor.Blue);
                    valueBitString = valueBitString.PadLeft(36, '0');
                    var maskedBitString = "";
                    mask.Dump();
                    for (var i = 0; i < valueBitString.Length; i++)
                    {
                        var maskChar = mask[mask.Length - valueBitString.Length + i];
                        maskedBitString += maskChar != 'X' ? maskChar : valueBitString[i];
                    }

                    maskedBitString.Dump();

                    var valueUlong = Convert.ToUInt64(maskedBitString, 2).Dump();

                    if (!memory.TryAdd(indexUlong, valueUlong))
                        memory[indexUlong] = valueUlong;
                }
            }
            return memory.Aggregate(0UL, (a, c) => a + c.Value);
        }
    }
}