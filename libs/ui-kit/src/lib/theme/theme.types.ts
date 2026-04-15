/**
 * Theme Types
 * Defines theme modes and configuration interfaces
 */

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  autoDetect?: boolean;
}

export interface ThemeState {
  currentMode: ThemeMode;
  prefersDark: boolean;
}
