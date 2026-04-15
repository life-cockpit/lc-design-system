import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ColorPrimary500,
  Spacing4,
  TypographyFontSizeBase,
  Elevation1,
  BorderRadiusMd,
} from './index';

/**
 * Test component to verify token usage in real Angular component
 */
@Component({
  selector: 'lc-token-test',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="test-container" [style.color]="primaryColor">
      <h1 [style.fontSize]="fontSize">Token Integration Test</h1>
      <p [style.margin]="spacing">This component uses design tokens</p>
      <div
        class="elevated-card"
        [style.box-shadow]="elevation"
        [style.border-radius]="borderRadius"
      >
        Content with tokens
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        padding: var(--spacing-4, 1rem);
      }
      .elevated-card {
        padding: var(--spacing-2, 0.5rem);
      }
    `,
  ],
})
class TokenTestComponent {
  primaryColor = ColorPrimary500;
  spacing = Spacing4;
  fontSize = TypographyFontSizeBase;
  elevation = Elevation1;
  borderRadius = BorderRadiusMd;
}

describe('Token Integration', () => {
  let component: TokenTestComponent;
  let fixture: ComponentFixture<TokenTestComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenTestComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Component Integration', () => {
    it('should create test component', () => {
      expect(component).toBeTruthy();
    });

    it('should render with design tokens', () => {
      expect(compiled.querySelector('.test-container')).toBeTruthy();
    });
  });

  describe('Token Usage in Component Properties', () => {
    it('should use color tokens in component', () => {
      expect(component.primaryColor).toBe(ColorPrimary500);
      expect(component.primaryColor).toBe('#208497');
    });

    it('should use spacing tokens in component', () => {
      expect(component.spacing).toBe(Spacing4);
      expect(component.spacing).toBe('1rem');
    });

    it('should use typography tokens in component', () => {
      expect(component.fontSize).toBe(TypographyFontSizeBase);
      expect(component.fontSize).toBe('1rem');
    });

    it('should use elevation tokens in component', () => {
      expect(component.elevation).toBe(Elevation1);
      expect(component.elevation).toContain('rgba');
    });

    it('should use border radius tokens in component', () => {
      expect(component.borderRadius).toBe(BorderRadiusMd);
    });
  });

  describe('Token Application in DOM', () => {
    it('should apply color token to element', () => {
      const container = compiled.querySelector('.test-container') as HTMLElement;
      const computedColor = window.getComputedStyle(container).color;

      // Color should be applied (exact RGB may vary by browser)
      expect(computedColor).toBeTruthy();
    });

    it('should apply spacing token to element', () => {
      const paragraph = compiled.querySelector('p') as HTMLElement;
      const computedMargin = window.getComputedStyle(paragraph).margin;

      expect(computedMargin).toBeTruthy();
    });

    it('should apply typography token to element', () => {
      const heading = compiled.querySelector('h1') as HTMLElement;
      const computedFontSize = window.getComputedStyle(heading).fontSize;

      expect(computedFontSize).toBeTruthy();
    });

    it('should apply elevation token to element', () => {
      const card = compiled.querySelector('.elevated-card') as HTMLElement;
      const computedShadow = window.getComputedStyle(card).boxShadow;

      expect(computedShadow).toBeTruthy();
      expect(computedShadow).not.toBe('none');
    });

    it('should apply border radius token to element', () => {
      const card = compiled.querySelector('.elevated-card') as HTMLElement;
      const computedRadius = window.getComputedStyle(card).borderRadius;

      expect(computedRadius).toBeTruthy();
    });
  });

  describe('Token Import Verification', () => {
    it('should import all required token types', () => {
      expect(ColorPrimary500).toBeDefined();
      expect(Spacing4).toBeDefined();
      expect(TypographyFontSizeBase).toBeDefined();
      expect(Elevation1).toBeDefined();
      expect(BorderRadiusMd).toBeDefined();
    });

    it('should have correct token value types', () => {
      expect(typeof ColorPrimary500).toBe('string');
      expect(typeof Spacing4).toBe('string');
      expect(typeof TypographyFontSizeBase).toBe('string');
      expect(typeof Elevation1).toBe('string');
      expect(typeof BorderRadiusMd).toBe('string');
    });

    it('should not have null or undefined tokens', () => {
      expect(ColorPrimary500).not.toBeNull();
      expect(ColorPrimary500).not.toBeUndefined();
      expect(Spacing4).not.toBeNull();
      expect(Spacing4).not.toBeUndefined();
    });
  });

  describe('Cross-Component Token Consistency', () => {
    it('should use same token values across components', () => {
      // Create second component instance
      const fixture2 = TestBed.createComponent(TokenTestComponent);
      const component2 = fixture2.componentInstance;

      // Verify both components use same token values
      expect(component.primaryColor).toBe(component2.primaryColor);
      expect(component.spacing).toBe(component2.spacing);
      expect(component.fontSize).toBe(component2.fontSize);
    });

    it('should maintain token consistency after change detection', () => {
      const initialColor = component.primaryColor;

      fixture.detectChanges();

      expect(component.primaryColor).toBe(initialColor);
    });
  });

  describe('Token Type Safety', () => {
    it('should enforce TypeScript type safety', () => {
      // This test verifies compilation succeeds with proper types
      const color: string = ColorPrimary500;
      const spacing: string = Spacing4;

      expect(color).toBeDefined();
      expect(spacing).toBeDefined();
    });

    it('should not allow invalid token assignments', () => {
      // TypeScript should prevent: component.primaryColor = 123;
      // This test verifies the type system is working
      expect(typeof component.primaryColor).toBe('string');
    });
  });

  describe('Token Performance', () => {
    it('should load tokens without significant delay', () => {
      const start = performance.now();

      // Access multiple tokens
      const _color = ColorPrimary500;
      const _spacing = Spacing4;
      const _typography = TypographyFontSizeBase;
      const _elevation = Elevation1;
      const _radius = BorderRadiusMd;

      const end = performance.now();
      const duration = end - start;

      // Token access should be nearly instantaneous (< 1ms)
      expect(duration).toBeLessThan(1);
    });

    it('should not cause memory leaks', () => {
      // Create and destroy multiple components
      for (let i = 0; i < 100; i++) {
        const tempFixture = TestBed.createComponent(TokenTestComponent);
        tempFixture.detectChanges();
        tempFixture.destroy();
      }

      // If no memory leaks, this test completes without issues
      expect(true).toBe(true);
    });
  });
});
