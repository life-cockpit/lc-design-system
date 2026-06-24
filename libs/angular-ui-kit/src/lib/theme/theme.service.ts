import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ThemeMode, ThemeState } from './theme.types';

/**
 * Theme Service
 *
 * Design System 2.0 is dark-first: dark is the default theme. Light remains a
 * fully supported opt-in. Theme is applied via a `dark` / `light` class on the
 * document root (`:root.dark` / `:root.light`), matching the theme stylesheets.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Meta theme-color values for mobile browser chrome.
  private static readonly META_COLOR: Record<ThemeMode, string> = {
    dark: '#111827',
    light: '#ffffff',
  };

  // Reactive theme state using Angular signals. Dark by default (DS 2.0).
  private readonly themeState = signal<ThemeState>({
    currentMode: 'dark',
    prefersDark: true,
  });

  // Public readonly signals (declared after themeState due to initialization dependency)
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly currentTheme = this.themeState.asReadonly();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isDark = computed(() => this.themeState().currentMode === 'dark');

  constructor() {
    this.applyTheme(this.themeState().currentMode);
  }

  /**
   * Set the active theme mode.
   */
  public setTheme(mode: ThemeMode): void {
    this.themeState.update((state) => ({
      ...state,
      currentMode: mode,
    }));
    this.applyTheme(mode);
  }

  /**
   * Toggle between dark and light.
   */
  public toggleTheme(): void {
    this.setTheme(this.themeState().currentMode === 'dark' ? 'light' : 'dark');
  }

  /**
   * Adopt the OS-level color-scheme preference.
   */
  public useSystemPreference(): void {
    if (!this.isBrowser) {
      return;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
    this.themeState.update((state) => ({ ...state, prefersDark }));
    this.setTheme(prefersDark ? 'dark' : 'light');
  }

  /**
   * Apply the theme class + mobile meta color to the document.
   */
  private applyTheme(mode: ThemeMode): void {
    if (!this.isBrowser) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', ThemeService.META_COLOR[mode]);
    }
  }
}
