let input = System.IO.File.ReadAllText $"{__SOURCE_DIRECTORY__}/input.txt"
let splitted = input.Split ',' |> Array.map System.Int32.Parse

type Action = Add | Multiply | End

let rec run ( pos:int ) ( state:int [] )  =
    match state.[pos .. pos + 2] with
    | [99, _, _] -> state
    | 1 -> state
    | 2 -> state
    | _ -> failwith "illegal code"



splitted.[0]

run 0 splitted
