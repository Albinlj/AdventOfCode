export const readFile = (fileName: string) => {
  const path = `${new URL(".", import.meta.url).pathname}/days/${fileName}`;
  return Deno.readTextFileSync(path);
};

export const readInput = (day: number) =>
  readFile(`day${padLeft(day)}.input.txt`);
export const readExample = (day: number) =>
  readFile(`day${padLeft(day)}.example.txt`);

const padLeft = (num: number) =>
  num.toString().length == 1 ? "0" + num : "" + num;

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export function dump<T>(obj: T) {
  console.log(obj);
  return obj;
}

export const findGcd = (arr: number[]):number => {

const _gcd = (a: number, b: number): number => (b === 0 ? a : _gcd(b, a % b));
  return arr.reduce((a, b) => _gcd(a, b));
};


declare global {
  interface Array<T> {
    dump(): Array<T>;
  }
}

Array.prototype.dump = function () {
  // console.log(this);
  return this;
};