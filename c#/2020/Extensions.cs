using System;
using System.Collections.Generic;
using System.Numerics;
using System.Text;

namespace Seskarpt
{
    public static class Extensions
    {
        public static T Dump<T>(this T obj, string message)
        {
            Console.WriteLine(message + ": " + obj);
            return obj;
        }

        public static ulong DumpBinary(this ulong obj, ConsoleColor color = ConsoleColor.White)
        {
            if (color != ConsoleColor.White)
                Console.ForegroundColor = color;

            var str = Convert.ToString((long)obj, 2).PadLeft(64);
            Console.WriteLine(str
                .Insert(54, "-")
                .Insert(44, "-")
                .Insert(34, "-")
                .Insert(24, "-")
                .Insert(14, "-")
                .Insert(04, "-")
                );

            if (color != ConsoleColor.White)
                Console.ForegroundColor = ConsoleColor.White;

            return obj;
        }

        public static IEnumerable<int> DumpLayer(this IEnumerable<int> layer)
        {
            foreach (var line in layer)
            {
                line.DumpBinary();
            }

            return layer;
        }

        public static Day17.Day17.Space DumpSpace(this Day17.Day17.Space space)
        {
            var layerindex = 0;
            foreach (var layer in space.Layers)
            {
                $"layer = {layerindex}".Dump();
                layer.DumpLayer();
            }

            return space;
        }

        public static int DumpBinary(this int obj, ConsoleColor color = ConsoleColor.White)
        {
            if (color != ConsoleColor.White)
                Console.ForegroundColor = color;

            var str = Convert.ToString((long)obj, 2).PadLeft(32, '0');
            Console.WriteLine(str
                .Insert(24, "-")
                .Insert(16, "-")
                .Insert(8, "-")
                );

            if (color != ConsoleColor.White)
                Console.ForegroundColor = ConsoleColor.White;

            return obj;
        }

        public static T Dump<T>(this T obj, ConsoleColor color = ConsoleColor.White)
        {
            Console.ForegroundColor = color;
            Console.WriteLine(obj);
            Console.ForegroundColor = ConsoleColor.White;
            return obj;
        }

        public static T DumpOneLine<T>(this T obj, ConsoleColor color = ConsoleColor.White)
        {
            Console.ForegroundColor = color;
            Console.Write(obj);
            Console.ForegroundColor = ConsoleColor.White;
            return obj;
        }

        public static IEnumerable<T> DumpEnumerable<T>(this IEnumerable<T> list, ConsoleColor color = ConsoleColor.White)
        {
            foreach (var obj in list)
                obj.Dump(color);
            return list;
        }

        public static IEnumerable<T> DumpEnumerableOneLine<T>(this IEnumerable<T> list, ConsoleColor color = ConsoleColor.White)
        {
            Console.WriteLine();
            foreach (var obj in list)
                $"{obj}, ".DumpOneLine(color);
            Console.WriteLine();
            return list;
        }

        public static Dictionary<TKey, IEnumerable<TVal>> DumpDict<TKey, TVal>(this Dictionary<TKey, IEnumerable<TVal>> list)
        {
            foreach (var obj in list)
            {
                Console.ForegroundColor = ConsoleColor.DarkRed;
                obj.Key.Dump();
                Console.ForegroundColor = ConsoleColor.Blue;
                obj.Value.DumpEnumerable();
                Console.ForegroundColor = ConsoleColor.DarkGray;
            }
            return list;
        }
    }

    public record Bag
    {
        public Bag(string color, IEnumerable<Container> containers) => (Color, Containers) = (color, containers);

        public string Color { get; }
        public IEnumerable<Container> Containers { get; }
    }

    public record Container
    {
        public string Color { get; }
        public int Count { get; }

        public Container(string color, int count) => (Color, Count) = (color, count);
    }

    public static class BigIntegerExtensions
    {
        public static BigInteger BinaryToBigInteger(this string value)
        {
            // BigInteger can be found in the System.Numerics dll
            BigInteger res = 0;

            // I'm totally skipping error handling here
            foreach (char c in value)
            {
                res <<= 1;
                res += c == '1' ? 1 : 0;
            }

            return res;
        }

        /// <summary>
        /// Converts a <see cref="BigInteger"/> to a binary string.
        /// </summary>
        /// <param name="bigint">A <see cref="BigInteger"/>.</param>
        /// <returns>
        /// A <see cref="System.String"/> containing a binary
        /// representation of the supplied <see cref="BigInteger"/>.
        /// </returns>
        public static string ToBinaryString(this BigInteger bigint)
        {
            var bytes = bigint.ToByteArray();
            var idx = bytes.Length - 1;

            // Create a StringBuilder having appropriate capacity.
            var base2 = new StringBuilder(bytes.Length * 8);

            // Convert first byte to binary.
            var binary = Convert.ToString(bytes[idx], 2);

            // Ensure leading zero exists if value is positive.
            if (binary[0] != '0' && bigint.Sign == 1)
            {
                //base2.Append('0');
            }

            // Append binary string to StringBuilder.
            base2.Append(binary);

            // Convert remaining bytes adding leading zeros.
            for (idx--; idx >= 0; idx--)
            {
                base2.Append(Convert.ToString(bytes[idx], 2).PadLeft(8, '0'));
            }

            return base2.ToString();
        }

        /// <summary>
        /// Converts a <see cref="BigInteger"/> to a hexadecimal string.
        /// </summary>
        /// <param name="bigint">A <see cref="BigInteger"/>.</param>
        /// <returns>
        /// A <see cref="System.String"/> containing a hexadecimal
        /// representation of the supplied <see cref="BigInteger"/>.
        /// </returns>
        public static string ToHexadecimalString(this BigInteger bigint)
        {
            return bigint.ToString("X");
        }

        /// <summary>
        /// Converts a <see cref="BigInteger"/> to a octal string.
        /// </summary>
        /// <param name="bigint">A <see cref="BigInteger"/>.</param>
        /// <returns>
        /// A <see cref="System.String"/> containing an octal
        /// representation of the supplied <see cref="BigInteger"/>.
        /// </returns>
        public static string ToOctalString(this BigInteger bigint)
        {
            var bytes = bigint.ToByteArray();
            var idx = bytes.Length - 1;

            // Create a StringBuilder having appropriate capacity.
            var base8 = new StringBuilder(((bytes.Length / 3) + 1) * 8);

            // Calculate how many bytes are extra when byte array is split
            // into three-byte (24-bit) chunks.
            var extra = bytes.Length % 3;

            // If no bytes are extra, use three bytes for first chunk.
            if (extra == 0)
            {
                extra = 3;
            }

            // Convert first chunk (24-bits) to integer value.
            int int24 = 0;
            for (; extra != 0; extra--)
            {
                int24 <<= 8;
                int24 += bytes[idx--];
            }

            // Convert 24-bit integer to octal without adding leading zeros.
            var octal = Convert.ToString(int24, 8);

            // Ensure leading zero exists if value is positive.
            if (octal[0] != '0' && bigint.Sign == 1)
            {
                base8.Append('0');
            }

            // Append first converted chunk to StringBuilder.
            base8.Append(octal);

            // Convert remaining 24-bit chunks, adding leading zeros.
            for (; idx >= 0; idx -= 3)
            {
                int24 = (bytes[idx] << 16) + (bytes[idx - 1] << 8) + bytes[idx - 2];
                base8.Append(Convert.ToString(int24, 8).PadLeft(8, '0'));
            }

            return base8.ToString();
        }
    }
}