export function span(from: number, to: number) {
  const count = Math.abs(to - from) + 1;
  return Array(count)
    .fill(null)
    .map((_, i) => from + Math.sign(to - from) * i);
}
