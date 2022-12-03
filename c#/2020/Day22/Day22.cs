using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Seskarpt.Day22
{
    public static class Day22
    {
        public static int gameIndex = 0;

        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day21\smallinput.txt");

            var deck1 = new List<int> { 28, 50, 9, 11, 4, 45, 19, 26, 42, 43, 31, 46, 21, 40, 33, 20, 7, 6, 17, 44, 5, 39, 35, 27, 10 };
            var deck2 = new List<int> { 18, 16, 29, 41, 14, 12, 30, 37, 36, 24, 48, 38, 47, 34, 15, 8, 49, 23, 1, 3, 32, 25, 22, 13, 2 };

            //var deck1 = new List<int> { 9, 2, 6, 3, 1 };
            //var deck2 = new List<int> { 5, 8, 4, 7, 10 };

            var count = 0;

            var player1Wins = RecursiveCombat(deck1, deck2, out var winningDeck);

            winningDeck.DumpEnumerable(ConsoleColor.Blue);

            int score = GetScore(winningDeck);
            score.Dump(ConsoleColor.Green);
        }

        private static bool RecursiveCombat(IEnumerable<int> a, IEnumerable<int> b, out IEnumerable<int> winningDeck)
        {
            gameIndex++;
            //$"Starting game {gameIndex}".Dump(ConsoleColor.Magenta);
            var deck1 = new Queue<int>(a);
            var deck2 = new Queue<int>(b);

            int round = 1;

            var oldPositions = new List<string>();

            while (deck1.Count != 0 && deck2.Count != 0)
            {
                //$"Round {round} - GO!".Dump(ConsoleColor.Green);
                //deck1.DumpEnumerableOneLine(ConsoleColor.Blue);
                //deck2.DumpEnumerableOneLine(ConsoleColor.DarkBlue);
                var haschstring = string.Join(",", deck1) + string.Join(",", deck2);

                if (oldPositions.Contains(haschstring))
                {
                    winningDeck = deck1;
                    return true;
                }

                oldPositions.Add(haschstring);

                var card1 = deck1.Dequeue();
                //card1.Dump(ConsoleColor.Magenta);
                var card2 = deck2.Dequeue();
                //card2.Dump(ConsoleColor.Magenta);

                if (card1 <= deck1.Count && card2 <= deck2.Count)
                {
                    //"RECURSION!".Dump(ConsoleColor.Cyan);
                    if (RecursiveCombat(deck1.Take(card1), deck2.Take(card2), out _))
                    {
                        deck1.Enqueue(card1);
                        deck1.Enqueue(card2);
                    }
                    else
                    {
                        deck2.Enqueue(card2);
                        deck2.Enqueue(card1);
                    }
                    continue;
                }

                if (card1 > card2)
                {
                    deck1.Enqueue(card1);
                    deck1.Enqueue(card2);
                }
                else
                {
                    deck2.Enqueue(card2);
                    deck2.Enqueue(card1);
                }

                round++;

                //deck1.DumpEnumerableOneLine(ConsoleColor.Red);
                //deck2.DumpEnumerableOneLine(ConsoleColor.DarkRed);

                //Console.ReadKey();
            }

            var player1wins = deck1.Count > deck2.Count;
            winningDeck = player1wins ? deck1 : deck2;
            return player1wins;
        }

        private static int GetScore(IEnumerable<int> deck1)
        {
            return deck1.Select((score, i) => score * (deck1.Count() - (i))).DumpEnumerable(ConsoleColor.Red).Sum();
        }
    }
}