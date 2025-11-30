namespace _2025;

public static class Utils
{
    public static string[] ReadInputLines(string filename)
    {
        var projectRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", ".."));
        var inputPath = Path.Combine(projectRoot, "inputs", filename);
        return File.ReadAllLines(inputPath)
            .Select(line => line.Trim())
            .ToArray();
    }
}

