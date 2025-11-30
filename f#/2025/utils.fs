namespace _2025

open System.IO

module Utils =
    let ReadInputLines (filename: string) =
        Path.Combine(__SOURCE_DIRECTORY__, "inputs", filename)
        |> File.ReadAllLines
        |> Array.filter (fun line -> not (line.Trim().Length = 0))
        |> Array.map (fun line -> line.Trim())

