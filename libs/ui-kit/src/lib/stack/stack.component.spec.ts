import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StackComponent } from './stack.component';

@Component({
  standalone: true,
  imports: [StackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lc-stack
      [direction]="direction"
      [gap]="gap"
      [align]="align"
      [justify]="justify"
      [wrap]="wrap"
      [fullWidth]="fullWidth"
    >
      <div class="child-1">Child 1</div>
      <div class="child-2">Child 2</div>
      <div class="child-3">Child 3</div>
    </lc-stack>
  `,
})
class TestHostComponent {
  direction: 'horizontal' | 'vertical' = 'vertical';
  gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'start';
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' = 'start';
  wrap: boolean = false;
  fullWidth: boolean = false;
}

describe('StackComponent', () => {
  let component: StackComponent;
  let fixture: ComponentFixture<StackComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let stackElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Direction', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should render vertical direction by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-vertical');
    });

    it('should render horizontal direction', () => {
      hostFixture.componentInstance.direction = 'horizontal';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-horizontal');
    });

    it('should apply flex-col for vertical direction', () => {
      hostFixture.componentInstance.direction = 'vertical';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('flex-col');
    });

    it('should apply flex-row for horizontal direction', () => {
      hostFixture.componentInstance.direction = 'horizontal';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('flex-row');
    });
  });

  describe('Gap', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should render md gap by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-md');
      expect(stackElement.classList).toContain('gap-4');
    });

    it('should render no gap', () => {
      hostFixture.componentInstance.gap = 'none';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-none');
      expect(stackElement.classList).toContain('gap-0');
    });

    it('should render xs gap', () => {
      hostFixture.componentInstance.gap = 'xs';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-xs');
      expect(stackElement.classList).toContain('gap-1');
    });

    it('should render sm gap', () => {
      hostFixture.componentInstance.gap = 'sm';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-sm');
      expect(stackElement.classList).toContain('gap-2');
    });

    it('should render lg gap', () => {
      hostFixture.componentInstance.gap = 'lg';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-lg');
      expect(stackElement.classList).toContain('gap-6');
    });

    it('should render xl gap', () => {
      hostFixture.componentInstance.gap = 'xl';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('stack-gap-xl');
      expect(stackElement.classList).toContain('gap-8');
    });
  });

  describe('Alignment', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should render start alignment by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('items-start');
    });

    it('should render center alignment', () => {
      hostFixture.componentInstance.align = 'center';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('items-center');
    });

    it('should render end alignment', () => {
      hostFixture.componentInstance.align = 'end';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('items-end');
    });

    it('should render stretch alignment', () => {
      hostFixture.componentInstance.align = 'stretch';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('items-stretch');
    });

    it('should render baseline alignment', () => {
      hostFixture.componentInstance.align = 'baseline';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('items-baseline');
    });
  });

  describe('Justification', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should render start justification by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-start');
    });

    it('should render center justification', () => {
      hostFixture.componentInstance.justify = 'center';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-center');
    });

    it('should render end justification', () => {
      hostFixture.componentInstance.justify = 'end';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-end');
    });

    it('should render between justification', () => {
      hostFixture.componentInstance.justify = 'between';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-between');
    });

    it('should render around justification', () => {
      hostFixture.componentInstance.justify = 'around';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-around');
    });

    it('should render evenly justification', () => {
      hostFixture.componentInstance.justify = 'evenly';
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('justify-evenly');
    });
  });

  describe('Wrap', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should not wrap by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).not.toContain('flex-wrap');
    });

    it('should wrap when enabled', () => {
      hostFixture.componentInstance.wrap = true;
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('flex-wrap');
    });
  });

  describe('Full Width', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;
    });

    it('should not be full width by default', () => {
      hostFixture.detectChanges();
      expect(stackElement.classList).not.toContain('w-full');
    });

    it('should be full width when enabled', () => {
      hostFixture.componentInstance.fullWidth = true;
      hostFixture.detectChanges();
      expect(stackElement.classList).toContain('w-full');
    });
  });

  describe('Content Projection', () => {
    it('should project child elements', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const children = hostFixture.debugElement.queryAll(By.css('lc-stack > *'));
      expect(children.length).toBe(3);
      expect(children[0].nativeElement.textContent).toContain('Child 1');
      expect(children[1].nativeElement.textContent).toContain('Child 2');
      expect(children[2].nativeElement.textContent).toContain('Child 3');
    });
  });

  describe('Computed Classes', () => {
    it('should combine multiple classes correctly', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.componentInstance.direction = 'horizontal';
      hostFixture.componentInstance.gap = 'lg';
      hostFixture.componentInstance.align = 'center';
      hostFixture.componentInstance.justify = 'between';
      hostFixture.componentInstance.wrap = true;
      hostFixture.componentInstance.fullWidth = true;
      hostFixture.detectChanges();

      stackElement = hostFixture.debugElement.query(By.css('lc-stack')).nativeElement;

      expect(stackElement.classList).toContain('stack-horizontal');
      expect(stackElement.classList).toContain('flex-row');
      expect(stackElement.classList).toContain('stack-gap-lg');
      expect(stackElement.classList).toContain('gap-6');
      expect(stackElement.classList).toContain('items-center');
      expect(stackElement.classList).toContain('justify-between');
      expect(stackElement.classList).toContain('flex-wrap');
      expect(stackElement.classList).toContain('w-full');
    });
  });

  describe('Responsive Behavior', () => {
    it('should maintain layout with different numbers of children', () => {
      @Component({
        standalone: true,
        imports: [StackComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
          <lc-stack>
            @for (item of items; track item) {
              <div>{{ item }}</div>
            }
          </lc-stack>
        `,
      })
      class ResponsiveTestComponent {
        items = ['A', 'B', 'C', 'D', 'E'];
      }

      const responsiveFixture = TestBed.createComponent(ResponsiveTestComponent);
      responsiveFixture.detectChanges();

      const children = responsiveFixture.debugElement.queryAll(By.css('lc-stack > *'));
      expect(children.length).toBe(5);
    });
  });
});
