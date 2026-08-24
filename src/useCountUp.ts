import { useEffect, useState } from 'react';

export const useCountUp = (target: number, duration: number = 800) => {
  const [count, setCount] = useState(target);

  useEffect(() => {
    let start = count;
    const end = target;
    if (start === end) return;

    const range = end - start;
    const startTime = performance.now();

    let animationFrameId: number;

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const val = Math.round(start + range * easeProgress);
      setCount(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return count;
};
