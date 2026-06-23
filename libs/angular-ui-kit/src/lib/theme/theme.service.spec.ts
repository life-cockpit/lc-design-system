import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import type { ThemeMode } from './theme.types';

function mockPrefersDark(matches: boolean): void {
  window.matchMedia = jest.fn().mockReturnValue({
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    onchange: null,
    dispatchEvent: jest.fn(),
  } as unknown as MediaQueryList);
}

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    mockPrefersDark(false);

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with dark theme by default (DS 2.0 is dark-first)', () => {
      expect(service.currentTheme().currentMode).toBe('dark');
      expect(service.isDark()).toBe(true);
    });

    it('should apply the dark class to the document root on init', () => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });
  });

  describe('Theme Switching', () => {
    it('should switch to light when setTheme("light") is called', () => {
      service.setTheme('light');
      expect(service.currentTheme().currentMode).toBe('light');
      expect(service.isDark()).toBe(false);
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should switch back to dark when setTheme("dark") is called', () => {
      service.setTheme('light');
      service.setTheme('dark');
      expect(service.currentTheme().currentMode).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should toggle between dark and light', () => {
      // starts dark
      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('light');
      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('dark');
    });

    it('should keep isDark in sync with the active mode', () => {
      service.setTheme('light');
      expect(service.isDark()).toBe(false);
      service.setTheme('dark');
      expect(service.isDark()).toBe(true);
    });
  });

  describe('System Preference', () => {
    it('should adopt light when the OS prefers light', () => {
      mockPrefersDark(false);
      service.useSystemPreference();
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should adopt dark when the OS prefers dark', () => {
      mockPrefersDark(true);
      service.useSystemPreference();
      expect(service.currentTheme().currentMode).toBe('dark');
    });
  });

  describe('DOM Updates', () => {
    it('should set the mobile meta theme-color to the dark value by default', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);

      service.setTheme('dark');
      expect(meta.getAttribute('content')).toBe('#111827');

      service.setTheme('light');
      expect(meta.getAttribute('content')).toBe('#ffffff');

      meta.remove();
    });
  });

  describe('Reactivity', () => {
    it('should provide a readonly theme state signal', () => {
      expect(service.currentTheme).toBeDefined();
      expect(typeof service.currentTheme).toBe('function');
    });

    it('should maintain signal synchronization', () => {
      service.setTheme('light');
      expect(service.currentTheme().currentMode).toBe('light');
      expect(service.isDark()).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should accept all valid theme modes', () => {
      const validModes: ThemeMode[] = ['light', 'dark'];
      validModes.forEach((mode) => {
        expect(() => service.setTheme(mode)).not.toThrow();
      });
    });

    it('should expose a correctly shaped theme state', () => {
      const themeState = service.currentTheme();
      expect(themeState).toHaveProperty('currentMode');
      expect(themeState).toHaveProperty('prefersDark');
      expect(typeof themeState.currentMode).toBe('string');
      expect(typeof themeState.prefersDark).toBe('boolean');
    });
  });
});
