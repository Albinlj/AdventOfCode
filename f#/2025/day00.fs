namespace _2025

open Xunit

module Day00 =
    let Part1 () =
        let lines = Utils.ReadInputLines("day00.txt")
        lines |> Array.map int |> Array.sum


    [<Fact>]
    let Test1 () = Assert.Equal(110, Part1())
