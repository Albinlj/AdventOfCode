export const readFile = (fileName: string) => {
	const path = new URL(".", import.meta.url).pathname + "/days/" + fileName;
	return Deno.readTextFileSync(path);
};

export function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

export function dump<T>(obj:T) {
	console.log(obj)
	return obj
}