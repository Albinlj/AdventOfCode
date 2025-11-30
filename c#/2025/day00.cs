namespace _2025;

public static class Day00
{
    [Fact]
    public static void Test1()
    {
        Assert.Equal(110, Part1());
    }

    public static int Part1()
    {
        var lines = Utils.ReadInputLines("day00.txt");
        return lines.Select(int.Parse).ToList().Sum();
    }
}
