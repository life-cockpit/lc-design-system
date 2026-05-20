import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PageHeaderComponent } from './page-header.component';

@Component({
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <lc-page-header
      [title]="title"
      [subtitle]="subtitle"
      [level]="level"
      [size]="size"
      [showDivider]="showDivider"
      [badge]="badge"
    >
      <span slot="breadcrumbs">Home / Reports</span>
      <button slot="actions">New</button>
      <span slot="meta">12 active</span>
      <p>Description text</p>
    </lc-page-header>
  `,
})
class HostComponent {
  title: string | undefined = 'Reports';
  subtitle: string | undefined = 'Compare metrics';
  level: 1 | 2 | 3 = 1;
  size: 'compact' | 'default' | 'comfortable' = 'default';
  showDivider = false;
  badge: string | undefined = undefined;
}

describe('PageHeaderComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let rootEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    rootEl = fixture.nativeElement.querySelector('lc-page-header') as HTMLElement;
  });

  it('creates with default classes', () => {
    expect(rootEl.classList).toContain('lc-page-header');
    expect(rootEl.classList).toContain('lc-page-header--size-default');
    expect(rootEl.classList).not.toContain('lc-page-header--divided');
  });

  it('renders title at requested level', () => {
    host.level = 2;
    fixture.detectChanges();
    expect(rootEl.querySelector('h2.lc-page-header__title')?.textContent).toContain('Reports');

    host.level = 3;
    fixture.detectChanges();
    expect(rootEl.querySelector('h3.lc-page-header__title')?.textContent).toContain('Reports');
  });

  it('renders subtitle when provided', () => {
    expect(rootEl.querySelector('.lc-page-header__subtitle')?.textContent).toContain(
      'Compare metrics',
    );
  });

  it('renders badge inside title when provided', () => {
    host.badge = 'Beta';
    fixture.detectChanges();
    expect(rootEl.querySelector('.lc-page-header__badge')?.textContent).toContain('Beta');
  });

  it('omits title block when title is empty', () => {
    host.title = undefined;
    fixture.detectChanges();
    expect(rootEl.querySelector('.lc-page-header__title')).toBeNull();
  });

  it('applies divider class when showDivider is true', () => {
    host.showDivider = true;
    fixture.detectChanges();
    expect(rootEl.classList).toContain('lc-page-header--divided');
  });

  it('applies size variant', () => {
    host.size = 'compact';
    fixture.detectChanges();
    expect(rootEl.classList).toContain('lc-page-header--size-compact');
  });

  it('projects breadcrumbs / actions / meta / default slots', () => {
    expect(rootEl.querySelector('.lc-page-header__breadcrumbs')?.textContent).toContain(
      'Home / Reports',
    );
    expect(rootEl.querySelector('.lc-page-header__actions')?.textContent).toContain('New');
    expect(rootEl.querySelector('.lc-page-header__meta')?.textContent).toContain('12 active');
    expect(rootEl.querySelector('.lc-page-header__body')?.textContent).toContain('Description');
  });
});
