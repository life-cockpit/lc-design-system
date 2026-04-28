import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DrawerComponent } from './drawer.component';

@Component({
  standalone: true,
  imports: [DrawerComponent],
  template: `
    <lc-drawer
      [open]="open()"
      [heading]="heading()"
      [position]="position()"
      [size]="size()"
      (closed)="onClosed()"
    >
      <p>Drawer content</p>
    </lc-drawer>
  `,
})
class TestHostComponent {
  open = signal(false);
  heading = signal('Test Heading');
  position = signal<'left' | 'right'>('right');
  size = signal<'sm' | 'md' | 'lg' | 'xl'>('md');
  closedCount = 0;
  onClosed() {
    this.closedCount++;
  }
}

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render content when closed', () => {
    expect(fixture.nativeElement.querySelector('.lc-drawer')).toBeNull();
  });

  it('should render content when open', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const drawer = fixture.nativeElement.querySelector('.lc-drawer');
    expect(drawer).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lc-drawer__heading')?.textContent?.trim()).toBe(
      'Test Heading',
    );
  });

  it('should project child content', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.lc-drawer__body p')?.textContent?.trim()).toBe(
      'Drawer content',
    );
  });

  it('should apply position class', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.lc-drawer__panel--right')).toBeTruthy();
  });

  it('should emit closed on close button click', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const closeBtn = fixture.nativeElement.querySelector('.lc-drawer__close');
    closeBtn?.click();
    fixture.detectChanges();

    expect(host.closedCount).toBe(1);
  });

  it('should emit closed on overlay click', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.lc-drawer__overlay');
    overlay?.click();
    fixture.detectChanges();

    expect(host.closedCount).toBe(1);
  });

  it('should emit closed on Escape key', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(host.closedCount).toBe(1);
  });

  it('should have correct width for size md', async () => {
    host.open.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = fixture.nativeElement.querySelector('.lc-drawer__panel') as HTMLElement;
    expect(panel.style.width).toBe('400px');
  });
});
