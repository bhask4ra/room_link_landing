import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useJourney } from "./useJourney";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("honors reduced motion changes and removes observers when unmounted", async () => {
  const listeners = new EventTarget();
  let reduce = true;
  const remove = vi.fn((name: string, fn: EventListener) =>
    listeners.removeEventListener(name, fn),
  );
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduce;
    },
    addEventListener: listeners.addEventListener.bind(listeners),
    removeEventListener: remove,
  }));
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  const { result, unmount } = renderHook(() => useJourney());
  expect(result.current.reducedMotion).toBe(true);
  act(() => {
    reduce = false;
    listeners.dispatchEvent(new Event("change"));
  });
  await waitFor(() => expect(result.current.reducedMotion).toBe(false));
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
});
