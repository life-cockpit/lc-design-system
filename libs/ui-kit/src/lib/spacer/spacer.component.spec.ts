import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SpacerComponent } from './spacer.component';
import { StackComponent } from '../stack/stack.component';

@Component({
  standalone: true,
  imports: [SpacerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex;">
      <div>Start</div>
      <lc-spacer [size]="size"></lc-spacer>
      <div>End</div>
    </div>
  `,
})
class TestHostComponent {
  size: 'auto' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'auto';
}

describe('SpacerComponent', () => {
  let component: SpacerComponent;
  let fixture: ComponentFixture<SpacerComponent>;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let spacerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Size Variations', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      spacerElement = hostFixture.debugElement.query(By.css('lc-spacer')).nativeElement;
    });

    it('should render auto size by default (flex-grow)', () => {
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-auto');
    });

    it('should render xs size', () => {
      hostFixture.componentInstance.size = 'xs';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-xs');
    });

    it('should render sm size', () => {
      hostFixture.componentInstance.size = 'sm';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-sm');
    });

    it('should render md size', () => {
      hostFixture.componentInstance.size = 'md';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-md');
    });

    it('should render lg size', () => {
      hostFixture.componentInstance.size = 'lg';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-lg');
    });

    it('should render xl size', () => {
      hostFixture.componentInstance.size = 'xl';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('spacer-xl');
    });
  });

  describe('Flex Behavior', () => {
    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      spacerElement = hostFixture.debugElement.query(By.css('lc-spacer')).nativeElement;
    });

    it('should grow to fill available space with auto size', () => {
      hostFixture.componentInstance.size = 'auto';
      hostFixture.detectChanges();
      expect(spacerElement.classList).toContain('flex-1');
    });

    it('should not grow with fixed sizes', () => {
      hostFixture.componentInstance.size = 'md';
      hostFixture.detectChanges();
      expect(spacerElement.classList).not.toContain('flex-1');
    });
  });

  describe('Usage in Stack', () => {
    it('should work within horizontal stack', () => {
      @Component({
        standalone: true,
        imports: [SpacerComponent, StackComponent],
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: `
          <lc-stack direction="horizontal">
            <div>Left</div>
            <lc-spacer></lc-spacer>
            <div>Right</div>
          </lc-stack>
        `,
      })
      class StackTestComponent {}

      const stackFixture = TestBed.createComponent(StackTestComponent);
      stackFixture.detectChanges();

      const spacer = stackFixture.debugElement.query(By.css('lc-spacer'));
      expect(spacer).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden attribute', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      spacerElement = hostFixture.debugElement.query(By.css('lc-spacer')).nativeElement;
      expect(spacerElement.getAttribute('aria-hidden')).toBe('true');
    });

    it('should not be focusable', () => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      spacerElement = hostFixture.debugElement.query(By.css('lc-spacer')).nativeElement;
      expect(spacerElement.tabIndex).toBe(-1);
    });
  });
});
