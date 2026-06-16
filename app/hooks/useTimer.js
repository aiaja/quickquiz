import { useState, useEffect, useRef } from "react";

/**
 * A highly accurate timer hook using Date.now() anchor.
 * Handles tab backgrounding/resuming by re-calculating remaining time from the anchor.
 */
export const useTimer = ({ initialSeconds, onExpire, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // Initialize/Reset anchor when active or initialSeconds changes
  useEffect(() => {
    if (isActive) {
      // Always set a new end time based on current time + remaining seconds
      endTimeRef.current = Date.now() + initialSeconds * 1000;
      setTimeRemaining(initialSeconds);
    } else {
      endTimeRef.current = null;
    }
  }, [isActive, initialSeconds]);

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
      
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onExpire();
      }
    };

    // Immediate tick to sync
    tick();

    intervalRef.current = setInterval(tick, 1000);

    // Re-sync on visibility change (re-focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, onExpire]);

  return { timeRemaining };
};
