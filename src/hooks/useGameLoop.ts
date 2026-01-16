import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void, interval: number = 16) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const isPausedRef = useRef<boolean>(false);

  const animate = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }

    const deltaTime = time - previousTimeRef.current;

    if (deltaTime >= interval && !isPausedRef.current) {
      previousTimeRef.current = time;
      callback();
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    pause: () => { isPausedRef.current = true; },
    resume: () => { isPausedRef.current = false; },
    togglePause: () => { isPausedRef.current = !isPausedRef.current; },
    isPaused: isPausedRef.current,
  };
};