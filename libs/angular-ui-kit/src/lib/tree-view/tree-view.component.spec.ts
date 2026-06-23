import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { TreeViewComponent, type TreeNode } from './tree-view.component';
import { resolveFileIcon } from './file-icons';

@Component({
  standalone: true,
  imports: [TreeViewComponent],
  template: `<lc-tree-view
    [nodes]="nodes()"
    [showToolbar]="showToolbar()"
    [(selectedId)]="selectedId"
  />`,
})
class TestHost {
  nodes = signal<TreeNode[]>([
    {
      name: 'src',
      expanded: true,
      children: [
        { name: 'app.component.ts' },
        { name: 'styles.scss' },
      ],
    },
    { name: 'README.md' },
  ]);
  showToolbar = signal(true);
  selectedId = signal<string | null>(null);
}

describe('TreeViewComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  function items(): HTMLElement[] {
    return Array.from(el.querySelectorAll('.lc-tree-view__item'));
  }

  it('renders expanded folder children', () => {
    // src (expanded) + 2 children + README.md = 4 rows
    expect(items().length).toBe(4);
    expect(el.textContent).toContain('app.component.ts');
    expect(el.textContent).toContain('README.md');
  });

  it('collapses and expands a folder on toggle click', () => {
    const chevron = el.querySelector<HTMLButtonElement>(
      '.lc-tree-view__chevron-btn',
    )!;
    chevron.click();
    fixture.detectChanges();
    // children hidden: src + README.md = 2 rows
    expect(items().length).toBe(2);

    chevron.click();
    fixture.detectChanges();
    expect(items().length).toBe(4);
  });

  it('selects a node on click and updates two-way binding', () => {
    const readme = items().find((i) => i.textContent?.includes('README.md'))!;
    readme.click();
    fixture.detectChanges();
    expect(host.selectedId()).toBe('/README.md');
    expect(readme.classList).toContain('lc-tree-view__item--selected');
  });

  it('expand-all / collapse-all toolbar buttons work', () => {
    const [expandBtn, collapseBtn] = Array.from(
      el.querySelectorAll<HTMLButtonElement>('.lc-tree-view__tool-btn'),
    );

    collapseBtn.click();
    fixture.detectChanges();
    expect(items().length).toBe(2);

    expandBtn.click();
    fixture.detectChanges();
    expect(items().length).toBe(4);
  });
});

describe('resolveFileIcon', () => {
  it('matches well-known file names', () => {
    expect(resolveFileIcon('package.json')).toBe('brand-npm');
    expect(resolveFileIcon('Dockerfile')).toBe('brand-docker');
    expect(resolveFileIcon('README.md')).toBe('book');
  });

  it('matches by extension', () => {
    expect(resolveFileIcon('app.component.ts')).toBe('brand-typescript');
    expect(resolveFileIcon('logo.SVG')).toBe('file-vector');
    expect(resolveFileIcon('photo.jpeg')).toBe('photo');
  });

  it('falls back to a generic file icon', () => {
    expect(resolveFileIcon('mystery.xyz')).toBe('file');
    expect(resolveFileIcon('noextension')).toBe('file');
  });
});
