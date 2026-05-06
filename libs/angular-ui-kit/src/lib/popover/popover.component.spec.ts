import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PopoverComponent, PopoverPosition, PopoverTrigger } from './popover.component';

@Component({
  standalone: true,
  imports: [PopoverComponent],
  template: `
    <lc-popover [position]="position" [trigger]="trigger" [showArrow]="showArrow" (openChange)="onOpenChange($event)">
      <button popover-trigger>Click me</button>
      <div popover-content class="test-content">
        <p>Popover body</p>
      </div>
    </lc-popover>
  `,
})
class TestHostComponent {
  position: PopoverPosition = 'bottom';
  trigger: PopoverTrigger = 'click';
  showArrow = true;
  lastOpen: boolean | null = null;

  onOpenChange(open: boolean): void {
    this.lastOpen = open;
  }
}

describe('PopoverComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(PopoverComponent))).toBeTruthy();
  });

  it('should not show panel by default', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeNull();
  });

  it('should open on trigger click', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeTruthy();
    expect(host.lastOpen).toBe(true);
  });

  it('should close on second click', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeNull();
    expect(host.lastOpen).toBe(false);
  });

  it('should apply position class', () => {
    host.position = 'top';
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.popover__panel'));
    expect(panel.nativeElement.classList).toContain('popover__panel--top');
  });

  it('should show arrow by default', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.popover__panel'));
    expect(panel.nativeElement.classList).toContain('popover__panel--arrow');
  });

  it('should hide arrow when showArrow is false', () => {
    host.showArrow = false;
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('.popover__panel'));
    expect(panel.nativeElement.classList).not.toContain('popover__panel--arrow');
  });

  it('should close on Escape key', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeNull();
  });

  it('should render projected content', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const content = fixture.debugElement.query(By.css('.test-content'));
    expect(content).toBeTruthy();
    expect(content.nativeElement.textContent).toContain('Popover body');
  });

  it('should have role dialog', () => {
    fixture.detectChanges();
    const trigger = fixture.debugElement.query(By.css('.popover__trigger'));
    trigger.nativeElement.click();
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.css('[role="dialog"]'));
    expect(panel).toBeTruthy();
  });

  describe('hover trigger', () => {
    beforeEach(() => {
      host.trigger = 'hover';
    });

    it('should open on mouseenter', () => {
      fixture.detectChanges();
      const popover = fixture.debugElement.query(By.css('.popover'));
      popover.nativeElement.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeTruthy();
    });

    it('should close on mouseleave', () => {
      fixture.detectChanges();
      const popover = fixture.debugElement.query(By.css('.popover'));
      popover.nativeElement.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      popover.nativeElement.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.popover__panel'))).toBeNull();
    });
  });
});
