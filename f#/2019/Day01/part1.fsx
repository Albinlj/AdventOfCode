module day1part1

let input = System.IO.File.ReadAllLines $"{__SOURCE_DIRECTORY__}/input.txt"

let masses = Seq.map int input

let CalculateFuelRequirementOfModule mass  =
     mass / 3 - 2

let totalFuelRequired = 
    masses |> Seq.sumBy CalculateFuelRequirementOfModule

totalFuelRequired

