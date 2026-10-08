'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tazkia-tasbih-state';
const SESSIONS_KEY = 'tazkia-tasbih-sessions';

export function useTasbih() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [dhikrId, setDhikrId] = useState('subhanallah');
  const [totalToday, setTotalToday] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (stored.count !== undefined) setCount(stored.count);
      if (stored.target) setTarget(stored.target);
      if (stored.dhikrId) setDhikrId(stored.dhikrId);
      if (stored.totalToday) setTotalToday(stored.totalToday);

      const storedSessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
      setSessions(storedSessions);
    } catch (e) {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ count, target, dhikrId, totalToday })
      );
    } catch (e) {}
  }, [count, target, dhikrId, totalToday, mounted]);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
    setTotalToday((prev) => prev + 1);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  const complete = useCallback(() => {
    const session = {
      id: Date.now(),
      dhikrId,
      count,
      target,
      completedAt: new Date().toISOString(),
    };
    const newSessions = [session, ...sessions].slice(0, 50);
    setSessions(newSessions);
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    } catch (e) {}
  }, [dhikrId, count, target, sessions]);

  const changeDhikr = useCallback((newDhikrId, newTarget) => {
    setDhikrId(newDhikrId);
    if (newTarget) setTarget(newTarget);
    setCount(0);
  }, []);

  const changeTarget = useCallback((newTarget) => {
    setTarget(newTarget);
    setCount(0);
  }, []);

  const resetAll = useCallback(() => {
    setCount(0);
    setTotalToday(0);
    setSessions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSIONS_KEY);
    } catch (e) {}
  }, []);

  return {
    count, target, dhikrId, totalToday, sessions, mounted,
    increment, decrement, reset, complete,
    changeDhikr, changeTarget, resetAll,
    progress: target > 0 ? Math.min(100, (count / target) * 100) : 0,
    isComplete: count >= target && target > 0,
  };
}
