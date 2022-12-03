let input = System.IO.File.ReadAllLines $"{__SOURCE_DIRECTORY__}/input.txt"

let masses = Seq.map int input

let rec CalculateFuelRequirementOfModule mass  =
     let fuel = mass / 3 - 2
     if fuel <= 0 then
        0
     else
        fuel + CalculateFuelRequirementOfModule fuel

let totalFuelRequired = 
    masses |> Seq.sumBy CalculateFuelRequirementOfModule

totalFuelRequired