import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import type { ThemeMode } from './theme.types';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();

    const mockMediaQuery = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      onchange: null,
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mockMediaQuery as any);

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with light theme by default', () => {
      const themeState = service.currentTheme();
      expect(themeState.currentMode).toBe('light');
    });

    it('should always use light mode regardless of system preference', () => {
      const mockMediaQuery = {
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      };
      window.matchMedia = jest.fn().mockReturnValue(mockMediaQuery as any);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      expect(newService.currentTheme().currentMode).toBe('light');
    });

    it('should always use light mode regardless of localStorage', () => {
      localStorage.setItem('theme', 'dark');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      expect(newService.currentTheme().currentMode).toBe('light');
      localStorage.clear();
    });
  });

  describe('Theme Switching (disabled)', () => {
    it('should remain light when setTheme dark is called', () => {
      service.setTheme('dark');
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should remain light when setTheme light is called', () => {
      service.setTheme('light');
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should not toggle (dark mode disabled)', () => {
      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should keep isDark as false', () => {
      service.setTheme('dark');
      expect(service.isDark()).toBe(false);
    });
  });

  describe('System Preference (disabled)', () => {
    it('should remain light when useSystemPreference is called', () => {
      const mockMediaQuery = {
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };
      jest.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery as any);

      service.useSystemPreference();
      expect(service.currentTheme().currentMode).toBe('light');
    });
  });

  describe('DOM Updates', () => {
    it('should apply light theme class to document element', () => {
      service.setTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should always keep light class regardless of setTheme call', () => {
      service.setTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Reactivity', () => {
    it('should provide readonly theme state signal', () => {
      expect(service.currentTheme).toBeDefined();
      expect(typeof service.currentTheme).toBe('function');
    });

    it('should remain light after toggleTheme', () => {
      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should maintain signal synchronization', () => {
      service.setTheme('dark');
      expect(service.currentTheme().currentMode).toBe('light');
      expect(service.isDark()).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should only accept valid theme modes', () => {
      const validModes: ThemeMode[] = ['light', 'dark'];
      validModes.forEach((mode) => {
        expect(() => service.setTheme(mode)).not.toThrow();
      });
    });

    it('should have proper TypeScript types', () => {
      const themeState = service.currentTheme();
      expect(themeState).toHaveProperty('currentMode');
      expect(themeState).toHaveProperty('prefersDark');
      expect(typeof themeState.currentMode).toBe('string');
      expect(typeof themeState.prefersDark).toBe('boolean');
    });
  });
});
