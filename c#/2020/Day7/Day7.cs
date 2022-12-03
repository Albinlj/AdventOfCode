using AdventOfCode2020;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day7
{
    internal class Day7
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day7\input.txt");
            var bags = input.Select(StringToBag);

            GetTotalBagCount("shiny gold", bags).Dump();
        }

        public static Bag StringToBag(string str)
        {
            var match = new Regex(@"^(?<bagColor>.+) bags contain (?<containers>.*$)").Match(str);
            var color = match.Groups["bagColor"].Value;
            var containerString = match.Groups["containers"].Value;

            var containers = containerString == "no other bags."
                ? Enumerable.Empty<Container>()
                : ContainerStringToContainers(containerString);

            return new Bag(color, containers);
        }

        private static IEnumerable<Container> ContainerStringToContainers(string containerString) =>
            new Regex(@"(?<count>\d) (?<containerColor>\w+\s\w+) bags?")
                .Matches(containerString)
                .Select(m => new Container(
                    Color: m.Groups["containerColor"].Value,
                    Count: int.Parse(m.Groups["count"].Value))
                );

        public static int GetTotalBagCount(string color, IEnumerable<Bag> bags, int current = 0)
        {
            var containers = bags
                .First(b => b.Color == color)
                .Containers
                .ToList();
            return 1 + current + containers.Sum(c => c.Count * GetTotalBagCount(c.Color, bags, current));
        }

        public record Bag(string Color, IEnumerable<Container> Containers);
        public record Container(string Color, int Count);
    }
}