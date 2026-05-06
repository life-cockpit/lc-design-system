import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DiffViewerComponent, DiffViewMode } from './diff-viewer.component';

@Component({
  standalone: true,
  imports: [DiffViewerComponent],
  template: `<lc-diff-viewer
    [oldText]="oldText()"
    [newText]="newText()"
    [oldLabel]="oldLabel()"
    [newLabel]="newLabel()"
    [mode]="mode()"
    [showLineNumbers]="showLineNumbers()"
    [contextLines]="contextLines()"
  />`,
})
class TestHost {
  oldText = signal('line1\nline2\nline3');
  newText = signal('line1\nline2 modified\nline3\nline4');
  oldLabel = signal('Original');
  newLabel = signal('Modified');
  mode = signal<DiffViewMode>('side-by-side');
  showLineNumbers = signal(true);
  contextLines = signal(Infinity);
}

describe('DiffViewerComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(el.querySelector('lc-diff-viewer')).toBeTruthy();
  });

  it('should show stats', () => {
    const stats = el.querySelectorAll('.lc-diff__stat');
    expect(stats.length).toBe(2);
  });

  it('should show additions count', () => {
    const add = el.querySelector('.lc-diff__stat--add');
    expect(add?.textContent?.trim()).toMatch(/\+\d+/);
  });

  it('should show deletions count', () => {
    const del = el.querySelector('.lc-diff__stat--del');
    expect(del?.textContent?.trim()).toMatch(/−\d+/);
  });

  it('should render side-by-side by default', () => {
    expect(el.querySelector('.lc-diff__side-by-side')).toBeTruthy();
    expect(el.querySelector('.lc-diff__inline')).toBeFalsy();
  });

  it('should render inline mode', () => {
    host.mode.set('inline');
    fixture.detectChanges();
    expect(el.querySelector('.lc-diff__inline')).toBeTruthy();
    expect(el.querySelector('.lc-diff__side-by-side')).toBeFalsy();
  });

  it('should render left and right panes', () => {
    expect(el.querySelector('.lc-diff__pane--left')).toBeTruthy();
    expect(el.querySelector('.lc-diff__pane--right')).toBeTruthy();
  });

  it('should show diff lines', () => {
    const lines = el.querySelectorAll('.lc-diff__line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should highlight added lines', () => {
    const added = el.querySelectorAll('.lc-diff__line--added');
    expect(added.length).toBeGreaterThan(0);
  });

  it('should highlight removed lines', () => {
    const removed = el.querySelectorAll('.lc-diff__line--removed');
    expect(removed.length).toBeGreaterThan(0);
  });

  it('should show pane headers', () => {
    const headers = el.querySelectorAll('.lc-diff__pane-header');
    expect(headers[0]?.textContent?.trim()).toBe('Original');
    expect(headers[1]?.textContent?.trim()).toBe('Modified');
  });

  it('should show line numbers by default', () => {
    expect(el.querySelectorAll('.lc-diff__num').length).toBeGreaterThan(0);
  });

  it('should hide line numbers when disabled', () => {
    host.showLineNumbers.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-diff__num').length).toBe(0);
  });

  it('should handle identical texts', () => {
    host.newText.set('line1\nline2\nline3');
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-diff__line--added').length).toBe(0);
    expect(el.querySelectorAll('.lc-diff__line--removed').length).toBe(0);
  });

  it('should show inline file label', () => {
    host.mode.set('inline');
    fixture.detectChanges();
    expect(el.querySelector('.lc-diff__file-label')?.textContent).toContain('→');
  });

  it('should support context lines', () => {
    host.oldText.set('a\nb\nc\nd\ne\nf\ng\nh\ni\nj');
    host.newText.set('a\nb\nc\nD\ne\nf\ng\nh\ni\nj');
    host.contextLines.set(1);
    host.mode.set('inline');
    fixture.detectChanges();
    const lines = el.querySelectorAll('.lc-diff__line');
    expect(lines.length).toBeLessThan(12); // less than all
  });
});
