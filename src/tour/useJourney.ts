import { useEffect, useRef, useState } from "react";
import { progressAt, stageAt } from "./journey";

export function useJourney() {
  const container = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReducedMotion(media.matches);
    motion();
    media.addEventListener("change", motion);
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!container.current) return;
      const bounds = container.current.getBoundingClientRect();
      progress.current = progressAt(
        bounds.top,
        bounds.height,
        window.innerHeight,
      );
      setStage(stageAt(progress.current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    if (container.current) resize.observe(container.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      media.removeEventListener("change", motion);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return { container, progress, stage, reducedMotion };
}
