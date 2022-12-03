import { span } from "./span";

test("span", () => {
  const s = span(0, 3);
  expect(s).toEqual([0, 1, 2, 3]);
});
test("span", () => {
  const s = span(-1, 2);
  expect(s).toEqual([-1, 0, 1, 2]);
});

test("span", () => {
  const s = span(-3, -1);
  expect(s).toEqual([-3, -2, -1]);
});

test("span", () => {
  const s = span(3, 1);
  expect(s).toEqual([3, 2, 1]);
});

test("span", () => {
  const s = span(2, -1);
  expect(s).toEqual([2, 1, 0, -1]);
});

test("span", () => {
  const s = span(-1, -3);
  expect(s).toEqual([-1, -2, -3]);
});
