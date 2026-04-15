import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypographyComponent } from './typography.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lc-test-wrapper',
  standalone: true,
  imports: [TypographyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lc-typography
      [variant]="variant"
      [align]="align"
      [color]="color"
      [weight]="weight"
      [transform]="transform"
      [noWrap]="noWrap"
      [lineClamp]="lineClamp"
      [gutterBottom]="gutterBottom"
    >
      {{ content }}
    </lc-typography>
  `,
})
class TestWrapperComponent {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'subtitle1'
    | 'subtitle2'
    | 'caption'
    | 'overline' = 'body1';
  align: 'left' | 'center' | 'right' | 'justify' = 'left';
  color: 'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning' | 'info' =
    'primary';
  weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular';
  transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize' = 'none';
  noWrap = false;
  lineClamp?: number;
  gutterBottom = false;
  content = 'Test content';
}

describe('TypographyComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges() here - let each test control it
  });

  function getTypographyElement(): HTMLElement {
    const element = fixture.nativeElement.querySelector('[class*="typography"]');
    if (!element) {
      throw new Error('Typography element not found');
    }
    return element as HTMLElement;
  }

  describe('Basic', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should render content', () => {
      component.content = 'Hello World';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.textContent?.trim()).toBe('Hello World');
    });
  });

  describe('Variants - Semantic HTML Elements', () => {
    it('should render h1 element for h1 variant', () => {
      component.variant = 'h1';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h1');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h1')).toBe(true);
    });

    it('should render h2 element for h2 variant', () => {
      component.variant = 'h2';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h2');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h2')).toBe(true);
    });

    it('should render h3 element for h3 variant', () => {
      component.variant = 'h3';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h3');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h3')).toBe(true);
    });

    it('should render h4 element for h4 variant', () => {
      component.variant = 'h4';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h4');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h4')).toBe(true);
    });

    it('should render h5 element for h5 variant', () => {
      component.variant = 'h5';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h5');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h5')).toBe(true);
    });

    it('should render h6 element for h6 variant', () => {
      component.variant = 'h6';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('h6');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h6')).toBe(true);
    });

    it('should render p element for body1 variant (default)', () => {
      component.variant = 'body1';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('p');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-body1')).toBe(true);
    });

    it('should render p element for body2 variant', () => {
      component.variant = 'body2';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('p');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-body2')).toBe(true);
    });

    it('should render p element for subtitle1 variant', () => {
      component.variant = 'subtitle1';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('p');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-subtitle1')).toBe(true);
    });

    it('should render p element for subtitle2 variant', () => {
      component.variant = 'subtitle2';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('p');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-subtitle2')).toBe(true);
    });

    it('should render span element for caption variant', () => {
      component.variant = 'caption';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('span');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-caption')).toBe(true);
    });

    it('should render span element for overline variant', () => {
      component.variant = 'overline';
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('span');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-overline')).toBe(true);
    });
  });

  describe('Text Alignment', () => {
    it('should apply left alignment by default', () => {
      component.align = 'left';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-left')).toBe(true);
    });

    it('should apply center alignment', () => {
      component.align = 'center';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-center')).toBe(true);
    });

    it('should apply right alignment', () => {
      component.align = 'right';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-right')).toBe(true);
    });

    it('should apply justify alignment', () => {
      component.align = 'justify';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-justify')).toBe(true);
    });
  });

  describe('Color Variants', () => {
    it('should apply primary color by default', () => {
      component.color = 'primary';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-primary')).toBe(true);
    });

    it('should apply secondary color', () => {
      component.color = 'secondary';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-secondary')).toBe(true);
    });

    it('should apply disabled color', () => {
      component.color = 'disabled';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-disabled')).toBe(true);
    });

    it('should apply error color', () => {
      component.color = 'error';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-error')).toBe(true);
    });

    it('should apply success color', () => {
      component.color = 'success';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-success')).toBe(true);
    });

    it('should apply warning color', () => {
      component.color = 'warning';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-warning')).toBe(true);
    });

    it('should apply info color', () => {
      component.color = 'info';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('text-info')).toBe(true);
    });
  });

  describe('Font Weights', () => {
    it('should apply regular weight by default', () => {
      component.weight = 'regular';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('font-regular')).toBe(true);
    });

    it('should apply medium weight', () => {
      component.weight = 'medium';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('font-medium')).toBe(true);
    });

    it('should apply semibold weight', () => {
      component.weight = 'semibold';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('font-semibold')).toBe(true);
    });

    it('should apply bold weight', () => {
      component.weight = 'bold';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('font-bold')).toBe(true);
    });
  });

  describe('Text Transform', () => {
    it('should apply no transform by default', () => {
      component.transform = 'none';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('uppercase')).toBe(false);
      expect(element.classList.contains('lowercase')).toBe(false);
      expect(element.classList.contains('capitalize')).toBe(false);
    });

    it('should apply uppercase transform', () => {
      component.transform = 'uppercase';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('uppercase')).toBe(true);
    });

    it('should apply lowercase transform', () => {
      component.transform = 'lowercase';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('lowercase')).toBe(true);
    });

    it('should apply capitalize transform', () => {
      component.transform = 'capitalize';
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('capitalize')).toBe(true);
    });
  });

  describe('Text Wrapping', () => {
    it('should wrap text by default', () => {
      component.noWrap = false;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('whitespace-nowrap')).toBe(false);
    });

    it('should not wrap text when noWrap is true', () => {
      component.noWrap = true;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('whitespace-nowrap')).toBe(true);
      expect(element.classList.contains('overflow-hidden')).toBe(true);
      expect(element.classList.contains('text-ellipsis')).toBe(true);
    });
  });

  describe('Line Clamping', () => {
    it('should not clamp lines by default', () => {
      component.lineClamp = undefined;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-1')).toBe(false);
      expect(element.classList.contains('line-clamp-2')).toBe(false);
      expect(element.classList.contains('line-clamp-3')).toBe(false);
    });

    it('should clamp to 1 line', () => {
      component.lineClamp = 1;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-1')).toBe(true);
    });

    it('should clamp to 2 lines', () => {
      component.lineClamp = 2;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-2')).toBe(true);
    });

    it('should clamp to 3 lines', () => {
      component.lineClamp = 3;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-3')).toBe(true);
    });

    it('should clamp to 4 lines', () => {
      component.lineClamp = 4;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-4')).toBe(true);
    });

    it('should clamp to 5 lines', () => {
      component.lineClamp = 5;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-5')).toBe(true);
    });

    it('should clamp to 6 lines', () => {
      component.lineClamp = 6;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('line-clamp-6')).toBe(true);
    });
  });

  describe('Gutter Bottom', () => {
    it('should not have gutter bottom by default', () => {
      component.gutterBottom = false;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('mb-4')).toBe(false);
    });

    it('should apply gutter bottom spacing', () => {
      component.gutterBottom = true;
      fixture.detectChanges();
      const element = getTypographyElement();
      expect(element.classList.contains('mb-4')).toBe(true);
    });
  });

  describe('Component Initialization', () => {
    it('should use body1 variant by default', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('p');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-body1')).toBe(true);
    });

    it('should accept all input properties', () => {
      component.variant = 'h1';
      component.align = 'center';
      component.color = 'error';
      component.weight = 'bold';
      component.transform = 'uppercase';
      component.noWrap = true;
      component.lineClamp = 2;
      component.gutterBottom = true;
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('h1');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h1')).toBe(true);
      expect(element.classList.contains('text-center')).toBe(true);
      expect(element.classList.contains('text-error')).toBe(true);
      expect(element.classList.contains('font-bold')).toBe(true);
      expect(element.classList.contains('uppercase')).toBe(true);
      expect(element.classList.contains('whitespace-nowrap')).toBe(true);
      expect(element.classList.contains('line-clamp-2')).toBe(true);
      expect(element.classList.contains('mb-4')).toBe(true);
    });
  });

  describe('Class Combinations', () => {
    it('should combine variant, alignment, and color classes', () => {
      component.variant = 'h2';
      component.align = 'right';
      component.color = 'success';
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('h2');
      expect(element.classList.contains('typography-h2')).toBe(true);
      expect(element.classList.contains('text-right')).toBe(true);
      expect(element.classList.contains('text-success')).toBe(true);
    });

    it('should combine weight and transform classes', () => {
      component.variant = 'body1';
      component.weight = 'semibold';
      component.transform = 'capitalize';
      fixture.detectChanges();

      const element = getTypographyElement();
      expect(element.classList.contains('font-semibold')).toBe(true);
      expect(element.classList.contains('capitalize')).toBe(true);
    });

    it('should combine noWrap and gutterBottom classes', () => {
      component.variant = 'subtitle1';
      component.noWrap = true;
      component.gutterBottom = true;
      fixture.detectChanges();

      const element = getTypographyElement();
      expect(element.classList.contains('whitespace-nowrap')).toBe(true);
      expect(element.classList.contains('mb-4')).toBe(true);
    });

    it('should handle all properties together', () => {
      component.variant = 'h3';
      component.align = 'justify';
      component.color = 'warning';
      component.weight = 'bold';
      component.transform = 'lowercase';
      component.lineClamp = 3;
      component.gutterBottom = true;
      fixture.detectChanges();

      const element = fixture.nativeElement.querySelector('h3');
      expect(element).toBeTruthy();
      expect(element.classList.contains('typography-h3')).toBe(true);
      expect(element.classList.contains('text-justify')).toBe(true);
      expect(element.classList.contains('text-warning')).toBe(true);
      expect(element.classList.contains('font-bold')).toBe(true);
      expect(element.classList.contains('lowercase')).toBe(true);
      expect(element.classList.contains('line-clamp-3')).toBe(true);
      expect(element.classList.contains('mb-4')).toBe(true);
    });
  });
});
