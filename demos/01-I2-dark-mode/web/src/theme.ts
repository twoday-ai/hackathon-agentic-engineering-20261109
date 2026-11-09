import { useEffect, useState } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
const storageKey = 'request-workbench-theme';
const darkQuery = '(prefers-color-scheme: dark)';

export function readThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* Browser storage may be unavailable. */ }
  return 'system';
}

export function applyTheme(preference: ThemePreference) {
  const dark = preference === 'dark' ||
    (preference === 'system' && window.matchMedia?.(darkQuery).matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference);
  useEffect(() => {
    applyTheme(preference);
    const media = window.matchMedia?.(darkQuery);
    const update = () => applyTheme(preference);
    media?.addEventListener('change', update);
    return () => media?.removeEventListener('change', update);
  }, [preference]);

  function changeTheme(next: ThemePreference) {
    applyTheme(next);
    setPreference(next);
    try { localStorage.setItem(storageKey, next); }
    catch { /* The choice still works for this visit. */ }
  }
  return { preference, changeTheme };
}
