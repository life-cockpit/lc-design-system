import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import type { ThemeMode } from './theme.types';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Ensure matchMedia returns light mode preference
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

    it('should detect system dark mode preference', () => {
      // Clear the existing service
      localStorage.clear();

      // Mock prefers-color-scheme: dark BEFORE creating service
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

      // Create fresh TestBed and service with the mocked matchMedia
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      const themeState = newService.currentTheme();

      expect(themeState.prefersDark).toBe(true);
    });

    it('should load saved theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');

      // Reset TestBed to create fresh service that will read localStorage
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(ThemeService);
      const themeState = newService.currentTheme();

      expect(themeState.currentMode).toBe('dark');

      // Clean up
      localStorage.clear();
    });
  });

  describe('Theme Switching', () => {
    it('should switch to dark theme', () => {
      service.setTheme('dark');

      const themeState = service.currentTheme();
      expect(themeState.currentMode).toBe('dark');
    });

    it('should switch to light theme', () => {
      service.setTheme('light');

      const themeState = service.currentTheme();
      expect(themeState.currentMode).toBe('light');
    });

    it('should toggle between light and dark', () => {
      service.setTheme('light');
      expect(service.currentTheme().currentMode).toBe('light');

      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('dark');

      service.toggleTheme();
      expect(service.currentTheme().currentMode).toBe('light');
    });

    it('should update isDark signal when theme changes', () => {
      service.setTheme('light');
      TestBed.flushEffects(); // Flush effects in zoneless environment
      expect(service.isDark()).toBe(false);

      service.setTheme('dark');
      TestBed.flushEffects(); // Flush effects in zoneless environment
      expect(service.isDark()).toBe(true);
    });
  });

  describe('Theme Persistence', () => {
    it('should save theme preference to localStorage', () => {
      service.setTheme('dark');

      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should persist theme across service instances', () => {
      service.setTheme('dark');

      // Create new service instance
      const newService = TestBed.inject(ThemeService);
      const themeState = newService.currentTheme();

      expect(themeState.currentMode).toBe('dark');
    });
  });

  describe('System Preference', () => {
    it('should use system preference when requested', () => {
      // Mock prefers-color-scheme: dark
      const mockMediaQuery = {
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      jest.spyOn(window, 'matchMedia').mockReturnValue(mockMediaQuery as any);

      service.useSystemPreference();

      const themeState = service.currentTheme();
      expect(themeState.currentMode).toBe('dark');
    });

    it('should clear saved preference when using system default', () => {
      service.setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      service.useSystemPreference();
      expect(localStorage.getItem('theme')).toBeNull();
    });
  });

  describe('DOM Updates', () => {
    it('should apply theme class to document element', () => {
      service.setTheme('dark');

      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('should remove old theme class when switching', () => {
      service.setTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);

      service.setTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should update meta theme-color if it exists', () => {
      // Create meta tag first
      const metaTag = document.createElement('meta');
      metaTag.name = 'theme-color';
      metaTag.content = '#ffffff';
      document.head.appendChild(metaTag);

      service.setTheme('dark');

      const updatedMetaTag = document.querySelector('meta[name="theme-color"]');
      expect(updatedMetaTag).toBeTruthy();
      expect(updatedMetaTag?.getAttribute('content')).toBe('#111827');

      // Cleanup
      metaTag.remove();
    });
  });

  describe('Reactivity', () => {
    it('should provide readonly theme state signal', () => {
      const themeSignal = service.currentTheme;
      expect(themeSignal).toBeDefined();
      expect(typeof themeSignal).toBe('function');
    });

    it('should update signals reactively', () => {
      const initialTheme = service.currentTheme().currentMode;
      expect(initialTheme).toBe('light');

      service.toggleTheme();

      const updatedTheme = service.currentTheme().currentMode;
      expect(updatedTheme).toBe('dark');
    });

    it('should maintain signal synchronization', () => {
      service.setTheme('dark');
      TestBed.flushEffects(); // Flush effects in zoneless environment

      expect(service.currentTheme().currentMode).toBe('dark');
      expect(service.isDark()).toBe(true);
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
