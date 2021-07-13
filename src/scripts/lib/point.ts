export type Point = {
  x: number,
  y: number,
};

export function add(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}