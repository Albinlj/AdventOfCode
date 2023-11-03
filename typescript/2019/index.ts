import { expect, test } from "bun:test";

console.log("Hello via Bun!");
const foo = await Bun.file("day1.input.txt").text();
console.log(foo);
