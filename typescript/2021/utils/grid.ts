export type Coord = [number, number];
export type Grid = number[][];

export const isInGrid = (grid: number[][], [y, x]: Coord) =>
  !(x < 0 || y < 0 || x >= grid[0].length || y >= grid.length);

export const getHeight = (grid: number[][], [y, x]: Coord) =>
  !isInGrid(grid, [y, x]) ? undefined : grid[y][x];
