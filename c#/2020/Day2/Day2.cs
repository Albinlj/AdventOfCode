using System.Linq;
using System.Text.RegularExpressions;

namespace AdventOfCode2020
{
    public static class Day2
    {
        public static int CheckValidCount(string[] strings)
        {
            Regex rx = new Regex(@"(\d*)-(\d*)\s(\D):\s(.*)");
            return strings.Select(s => rx.Matches(s)[0].Groups)
                .Count(group =>
                {
                    int.TryParse(group[1].Value, out var min);
                    int.TryParse(group[2].Value, out var max);
                    var ch = group[3].Value[0];
                    var password = group[4].Value;

                    return IsValidPasswordB(min, max, ch, password);
                });
        }

        public static bool IsValidPasswordA(int min, int max, char ch, string password)
        {
            var count = password.Count(c => ch == c);
            return count >= min && count <= max;
        }

        public static bool IsValidPasswordB(int indexA, int indexB, char ch, string password)
        {
            return password[indexA - 1] == ch ^ password[indexB - 1] == ch;
        }
    }
}