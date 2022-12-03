using AdventOfCode2020;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Seskarpt.Day21
{
    public static class Day21
    {
        public static void Do()
        {
            var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day21\input.txt");
            //var input = System.IO.File.ReadAllLines(@$"{Program.fileRoot}\day21\smallinput.txt");

            var foods = ParseFoods(input).ToList();

            var allergens = foods.SelectMany(food => food.Allergens).Distinct()
                .Where(all => !string.IsNullOrWhiteSpace(all))
                .ToDictionary(all => all, all => foods.Where(food => food.Allergens.Contains(all)));
            var ingredients = foods.SelectMany(food => food.Ingredients).Distinct()
                .Where(ing => !string.IsNullOrWhiteSpace(ing))
                .ToDictionary(ing => ing, ing => foods.Where(food => food.Ingredients.Contains(ing)));

            allergens.Keys.DumpEnumerable();
            ingredients.Keys.DumpEnumerable(ConsoleColor.Blue);

            var allergenIngredientsDict = allergens.OrderBy(pair => pair.Key).ToDictionary(
                a => a.Key,
                a => a.Value.SelectMany(food => food.Ingredients).GroupBy(i => i)
                    .Where(g => g.Count() == a.Value.Count()).Select(grp => grp.Key));

            List<string> doneIngredients = new List<string>();
            while (allergenIngredientsDict.Any(pair => pair.Value.Count() > 1))
            {
                foreach (var (allergen, ingreds) in allergenIngredientsDict)
                {
                    allergen.Dump(ConsoleColor.Red);
                    ingreds.DumpEnumerable(ConsoleColor.Yellow);
                }
                var ingredient = allergenIngredientsDict.First(pair =>
                {
                    var (allergen, ingredientz) = pair;
                    return ingredientz.Count() == 1 && !doneIngredients.Contains(allergen);
                }).Value.First();
                doneIngredients.Add(ingredient);
                doneIngredients.DumpEnumerable(ConsoleColor.Blue);
                ingredient.Dump(ConsoleColor.Magenta);
                Console.ReadKey();

                foreach (var (allergen, ingred) in allergenIngredientsDict.Where(pair => pair.Value.Count() != 1))
                {
                    allergenIngredientsDict[allergen] = ingred.Where(ingredients => !ingredients.Contains(ingredient));
                }
            }

            foreach (var ali in allergenIngredientsDict)
            {
                ali.Key.Dump(ConsoleColor.Blue);
                ali.Value.DumpEnumerable(ConsoleColor.Gray);
            }

            var ingredientsThatMightContainAllergens =
                allergenIngredientsDict.SelectMany(pair => pair.Value).Distinct();

            var ingredientsClean = ingredients.Keys.Where(i => !ingredientsThatMightContainAllergens.Contains(i)).ToList();

            var cleanIngredientsMentionCount = foods.SelectMany(food => food.Ingredients).Where(i => ingredientsClean.Contains(i)).GroupBy(i => i).Sum(grp => grp.Count()).Dump(ConsoleColor.Magenta);
            "wat".Dump();
        }

        private static IEnumerable<Food> ParseFoods(string[] input)
        {
            var regex = new Regex(@"( ?(\w+) ?)+\(contains( ?(\w*),?)+");

            return input.Select((line, i) =>
            {
                var groups = regex.Match(line).Groups;
                var ingredients = groups[2].Captures.Select(c => c.Value).ToArray();
                var allergens = groups[4].Captures.Select(c => c.Value).ToArray();
                return new Food() { Allergens = allergens, Ingredients = ingredients, Id = i };
            });
        }
    }

    public class Food
    {
        public int Id { get; set; }
        public string[] Allergens { get; set; }
        public string[] Ingredients { get; set; }
    }
}