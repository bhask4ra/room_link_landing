export type Vec3 = [number, number, number];
export type CameraPose = { position: Vec3; target: Vec3 };
const stops: CameraPose[] = [
  { position: [12, 11, 15], target: [0, 0.4, 0] },
  { position: [2, 5.5, 9], target: [-2, 0.8, 1.8] },
  { position: [0.2, 3.2, 2.1], target: [-2.05, 1.05, -1.6] },
  { position: [6.7, 5.5, 5.3], target: [2.5, 0.8, -1.6] },
  { position: [9, 5.3, 9], target: [3.5, 0.8, 2.7] },
];
const clamp = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

export function progressAt(top: number, height: number, viewport: number) {
  if (![top, height, viewport].every(Number.isFinite) || height <= viewport)
    return 0;
  return clamp(-top / (height - viewport));
}
export function stageAt(progress: number) {
  return Math.round(clamp(progress) * (stops.length - 1));
}
export function presentationAt(progress: number) {
  const position = clamp(progress) * 4;
  const stage = stageAt(progress);
  const distance = Math.abs(position - stage);
  const opacity = clamp((0.46 - distance) / 0.2);
  return {
    stage,
    opacity: Math.round(opacity * 100) / 100,
    interactive: opacity > 0.15,
  };
}
export function cameraAt(progress: number): CameraPose {
  const position = clamp(progress) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(position));
  const fraction = clamp((position - index - 0.22) / 0.56);
  const t = fraction * fraction * (3 - 2 * fraction);
  const interpolate = (a: Vec3, b: Vec3) =>
    a.map((v, i) => v + (b[i] - v) * t) as Vec3;
  return {
    position: interpolate(stops[index].position, stops[index + 1].position),
    target: interpolate(stops[index].target, stops[index + 1].target),
  };
}
export function splitRent(total: number, people: number) {
  if (
    !Number.isFinite(total) ||
    total < 0 ||
    total > 1000000 ||
    !Number.isInteger(people) ||
    people < 1 ||
    people > 6
  )
    throw new RangeError("Revisa la renta y el número de roomies.");
  const cents = Math.round(total * 100);
  const base = Math.floor(cents / people);
  return Array.from(
    { length: people },
    (_, i) => (base + (i < cents % people ? 1 : 0)) / 100,
  );
}
