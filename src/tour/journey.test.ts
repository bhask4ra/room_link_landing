import { describe, expect, it } from "vitest";
import {
  progressAt,
  stageAt,
  cameraAt,
  splitRent,
  presentationAt,
} from "./journey";

// Cases come from the agreed journey: five stops, reversible scroll, continuous
// camera, and an illustrative shared monthly rent. They do not copy scene data.
describe("scroll journey", () => {
  it("holds copy at each room and hides it during travel in both directions", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      expect(presentationAt(progress).opacity).toBe(1);
      expect(presentationAt(progress).interactive).toBe(true);
    }
    for (const seam of [0.125, 0.375, 0.625, 0.875]) {
      expect(presentationAt(seam).opacity).toBe(0);
      expect(presentationAt(seam).interactive).toBe(false);
      expect(presentationAt(seam - 0.01).opacity).toBe(
        presentationAt(seam + 0.01).opacity,
      );
    }
    expect(cameraAt(0.25)).toEqual(cameraAt(0.27));
  });
  it("clamps before entry and after the last stop", () => {
    expect(progressAt(100, 5000, 1000)).toBe(0);
    expect(progressAt(-6000, 5000, 1000)).toBe(1);
    expect(progressAt(-2000, 5000, 1000)).toBe(0.5);
  });
  it("handles invalid and zero-height layouts without NaN", () => {
    expect(progressAt(0, 0, 1000)).toBe(0);
    expect(progressAt(NaN, 5000, 1000)).toBe(0);
    expect(progressAt(0, Infinity, 1000)).toBe(0);
  });
  it("reaches every stop and reverses when scrolling up", () => {
    expect([0, 0.25, 0.5, 0.75, 1].map(stageAt)).toEqual([0, 1, 2, 3, 4]);
    expect([1, 0.5, 0].map(stageAt)).toEqual([4, 2, 0]);
    expect(stageAt(-1)).toBe(0);
    expect(stageAt(9)).toBe(4);
  });
  it("moves the actual camera and stays continuous across room boundaries", () => {
    expect(cameraAt(0).position).not.toEqual(cameraAt(0.5).position);
    expect(cameraAt(0)).toEqual(cameraAt(-1));
    expect(cameraAt(1)).toEqual(cameraAt(2));
    for (const seam of [0.25, 0.5, 0.75]) {
      const before = cameraAt(seam - 0.00001);
      const after = cameraAt(seam + 0.00001);
      before.position.forEach((v, i) =>
        expect(Math.abs(v - after.position[i])).toBeLessThan(0.01),
      );
      before.target.forEach((v, i) =>
        expect(Math.abs(v - after.target[i])).toBeLessThan(0.01),
      );
    }
  });
});

describe("illustrative rent split", () => {
  it("divides the monthly amount and conserves cents", () => {
    expect(splitRent(8400, 3)).toEqual([2800, 2800, 2800]);
    expect(splitRent(100, 3)).toEqual([33.34, 33.33, 33.33]);
    expect(splitRent(0, 2)).toEqual([0, 0]);
  });
  it("rejects impossible totals and household sizes", () => {
    for (const [total, people] of [
      [-1, 2],
      [10, 0],
      [10, 2.5],
      [NaN, 2],
      [100, 7],
    ]) {
      expect(() => splitRent(total, people)).toThrow(RangeError);
    }
  });
});
