import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';

@Component({
  standalone: true,
  imports: [ToolbarComponent],
  template: `
    <lc-toolbar
      [density]="density"
      [background]="background"
      [border]="border"
      [wrap]="wrap"
      [align]="align"
      [sticky]="sticky"
    >
      <span slot="start">Title</span>
      <button slot="end">Action</button>
    </lc-toolbar>
  `,
})
class HostComponent {
  density: 'compact' | 'cosy' | 'comfortable' = 'cosy';
  background: 'transparent' | 'surface' | 'muted' = 'transparent';
  border: 'none' | 'bottom' | 'top' | 'around' = 'none';
  wrap = true;
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline' = 'center';
  sticky = false;
}

describe('ToolbarComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let toolbarEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    toolbarEl = fixture.nativeElement.querySelector('lc-toolbar') as HTMLElement;
  });

  it('creates the toolbar with default classes', () => {
    expect(toolbarEl.classList).toContain('lc-toolbar');
    expect(toolbarEl.classList).toContain('lc-toolbar--density-cosy');
    expect(toolbarEl.classList).toContain('lc-toolbar--bg-transparent');
    expect(toolbarEl.classList).toContain('lc-toolbar--border-none');
    expect(toolbarEl.classList).toContain('lc-toolbar--align-center');
    expect(toolbarEl.classList).toContain('lc-toolbar--wrap');
    expect(toolbarEl.getAttribute('role')).toBe('toolbar');
  });

  it('reflects density / background / border inputs', () => {
    host.density = 'compact';
    host.background = 'surface';
    host.border = 'bottom';
    fixture.detectChanges();

    expect(toolbarEl.classList).toContain('lc-toolbar--density-compact');
    expect(toolbarEl.classList).toContain('lc-toolbar--bg-surface');
    expect(toolbarEl.classList).toContain('lc-toolbar--border-bottom');
  });

  it('toggles wrap and sticky', () => {
    host.wrap = false;
    host.sticky = true;
    fixture.detectChanges();

    expect(toolbarEl.classList).not.toContain('lc-toolbar--wrap');
    expect(toolbarEl.classList).toContain('lc-toolbar--sticky');
  });

  it('projects start and end slots', () => {
    const start = toolbarEl.querySelector('.lc-toolbar__start');
    const end = toolbarEl.querySelector('.lc-toolbar__end');
    expect(start?.textContent).toContain('Title');
    expect(end?.textContent).toContain('Action');
  });
});
