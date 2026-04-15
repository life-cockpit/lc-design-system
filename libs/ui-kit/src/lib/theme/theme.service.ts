import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { ThemeMode, ThemeState } from './theme.types';

/**
 * Theme Service
 * Currently only supports light theme (dark mode disabled)
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Reactive theme state using Angular signals - always light mode
  private readonly themeState = signal<ThemeState>({
    currentMode: 'light',
    prefersDark: false,
  });

  // Public readonly signals (declared after themeState due to initialization dependency)
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly currentTheme = this.themeState.asReadonly();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public readonly isDark = signal(false);

  constructor() {
    // Apply light theme on initialization
    this.applyTheme('light');
  }

  /**
   * Set the theme mode (currently only light is supported)
   */
  public setTheme(mode: ThemeMode): void {
    // Always use light mode
    this.themeState.update((state) => ({
      ...state,
      currentMode: 'light',
    }));
    this.applyTheme('light');
  }

  /**
   * Toggle theme (disabled - always light)
   */
  public toggleTheme(): void {
    // No-op: dark mode disabled
  }

  /**
   * Reset to system preference (disabled - always light)
   */
  public useSystemPreference(): void {
    // No-op: always use light mode
  }

  /**
   * Apply light theme to document
   */
  private applyTheme(mode: ThemeMode): void {
    if (!this.isBrowser) {
      return;
    }

    const root = document.documentElement;
    // Always apply light mode
    root.classList.add('light');
    root.classList.remove('dark');

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#ffffff');
    }
  }
}
