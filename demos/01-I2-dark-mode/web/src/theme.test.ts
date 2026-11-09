import { act, renderHook } from '@testing-library/react';
import { applyTheme, readThemePreference, useTheme } from './theme';

let systemDark = false;
let media: EventTarget;
beforeEach(() => {
  localStorage.clear();
  systemDark = false;
  media = new EventTarget();
  vi.stubGlobal('matchMedia', () => ({
    matches: systemDark,
    addEventListener: media.addEventListener.bind(media),
    removeEventListener: media.removeEventListener.bind(media),
  }));
});
afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

it('follows system changes and keeps an explicit choice', () => {
  const { result } = renderHook(useTheme);
  expect(document.documentElement.dataset.theme).toBe('light');
  act(() => { systemDark = true; media.dispatchEvent(new Event('change')); });
  expect(document.documentElement.dataset.theme).toBe('dark');
  act(() => result.current.changeTheme('light'));
  act(() => media.dispatchEvent(new Event('change')));
  expect(document.documentElement.dataset.theme).toBe('light');
  act(() => result.current.changeTheme('system'));
  expect(document.documentElement.dataset.theme).toBe('dark');
});

it('restores the chosen appearance on a later visit', () => {
  const first = renderHook(useTheme);
  act(() => first.result.current.changeTheme('dark'));
  first.unmount();
  const next = renderHook(useTheme);
  expect(next.result.current.preference).toBe('dark');
  expect(document.documentElement.dataset.theme).toBe('dark');
});

it('falls back to the system for invalid or inaccessible storage', () => {
  localStorage.setItem('request-workbench-theme', 'invalid');
  expect(readThemePreference()).toBe('system');
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Unavailable'); });
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Unavailable'); });
  const { result } = renderHook(useTheme);
  act(() => result.current.changeTheme('dark'));
  expect(document.documentElement.dataset.theme).toBe('dark');
  expect(() => applyTheme(readThemePreference())).not.toThrow();
});
