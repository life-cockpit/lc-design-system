import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ToolbarComponent } from './toolbar.component';

@Component({
  standalone: true,
  imports: [ToolbarComponent],
  template: `
    <lc-toolbar>
      <span slot="start">Title</span>
      <button slot="end">Action</button>
    </lc-toolbar>
  `,
})
class SlotsHostComponent {}

describe('ToolbarComponent', () => {
  describe('inputs (direct fixture)', () => {
    let fixture: ComponentFixture<ToolbarComponent>;
    let toolbarEl: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ToolbarComponent] }).compileComponents();
      fixture = TestBed.createComponent(ToolbarComponent);
      fixture.detectChanges();
      toolbarEl = fixture.nativeElement as HTMLElement;
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
      fixture.componentRef.setInput('density', 'compact');
      fixture.componentRef.setInput('background', 'surface');
      fixture.componentRef.setInput('border', 'bottom');
      fixture.detectChanges();

      expect(toolbarEl.classList).toContain('lc-toolbar--density-compact');
      expect(toolbarEl.classList).toContain('lc-toolbar--bg-surface');
      expect(toolbarEl.classList).toContain('lc-toolbar--border-bottom');
    });

    it('toggles wrap and sticky', () => {
      fixture.componentRef.setInput('wrap', false);
      fixture.componentRef.setInput('sticky', true);
      fixture.detectChanges();

      expect(toolbarEl.classList).not.toContain('lc-toolbar--wrap');
      expect(toolbarEl.classList).toContain('lc-toolbar--sticky');
    });
  });

  describe('content projection (host wrapper)', () => {
    let fixture: ComponentFixture<SlotsHostComponent>;
    let toolbarEl: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SlotsHostComponent],
      }).compileComponents();
      fixture = TestBed.createComponent(SlotsHostComponent);
      fixture.detectChanges();
      toolbarEl = fixture.nativeElement.querySelector('lc-toolbar') as HTMLElement;
    });

    it('projects start and end slots', () => {
      const start = toolbarEl.querySelector('.lc-toolbar__start');
      const end = toolbarEl.querySelector('.lc-toolbar__end');
      expect(start?.textContent).toContain('Title');
      expect(end?.textContent).toContain('Action');
    });
  });
});
