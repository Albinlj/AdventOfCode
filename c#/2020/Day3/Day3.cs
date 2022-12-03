namespace Seskarpt.Day3
{
    public static class Day3
    {
        public static int Do(string[] strings, int slopeRight, int slopeDown = 1)
        {
            int x = 0;
            int count = 0;
            int width = strings[0].Length;

            for (int y = slopeDown; y < strings.Length; y += slopeDown)
            {
                x += slopeRight;
                if (strings[y][x % width] == '#')
                {
                    count++;
                }
            }
            return count;
        }
    }
}