import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { TagInputComponent } from './tag-input.component';

@Component({
  standalone: true,
  imports: [TagInputComponent],
  template: `<lc-tag-input
    [placeholder]="placeholder()"
    [maxTags]="maxTags()"
    [allowDuplicates]="allowDuplicates()"
    [removable]="removable()"
    [disabled]="disabled()"
    [suggestions]="suggestions()"
    [label]="label()"
    (tagAdded)="added.push($event)"
    (tagRemoved)="removed.push($event)"
  />`,
})
class TestHost {
  placeholder = signal('Add tag…');
  maxTags = signal(Infinity);
  allowDuplicates = signal(false);
  removable = signal(true);
  disabled = signal(false);
  suggestions = signal<string[]>([]);
  label = signal('');
  added: string[] = [];
  removed: string[] = [];
}

describe('TagInputComponent', () => {
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

  function getInput(): HTMLInputElement {
    return el.querySelector('.lc-tag-input__input') as HTMLInputElement;
  }

  function addTagViaEnter(value: string): void {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(el.querySelector('lc-tag-input')).toBeTruthy();
  });

  it('should show placeholder when empty', () => {
    expect(getInput().placeholder).toBe('Add tag…');
  });

  it('should add tag on Enter', () => {
    addTagViaEnter('Angular');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(1);
    expect(el.querySelector('.lc-tag-input__tag-text')?.textContent?.trim()).toBe('Angular');
  });

  it('should emit tagAdded event', () => {
    addTagViaEnter('React');
    expect(host.added).toContain('React');
  });

  it('should remove tag on remove button click', () => {
    addTagViaEnter('Vue');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(1);
    const btn = el.querySelector('.lc-tag-input__tag-remove') as HTMLElement;
    btn.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(0);
  });

  it('should emit tagRemoved event', () => {
    addTagViaEnter('Svelte');
    const btn = el.querySelector('.lc-tag-input__tag-remove') as HTMLElement;
    btn.click();
    fixture.detectChanges();
    expect(host.removed).toContain('Svelte');
  });

  it('should prevent duplicates by default', () => {
    addTagViaEnter('TypeScript');
    addTagViaEnter('TypeScript');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(1);
  });

  it('should allow duplicates when enabled', () => {
    host.allowDuplicates.set(true);
    fixture.detectChanges();
    addTagViaEnter('TypeScript');
    addTagViaEnter('TypeScript');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(2);
  });

  it('should respect maxTags', () => {
    host.maxTags.set(2);
    fixture.detectChanges();
    addTagViaEnter('A');
    addTagViaEnter('B');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(2);
    // Input should be gone since limit reached
    expect(getInput()).toBeFalsy();
  });

  it('should remove last tag on Backspace when input is empty', () => {
    addTagViaEnter('First');
    addTagViaEnter('Second');
    const input = getInput();
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(1);
  });

  it('should not add empty tags', () => {
    addTagViaEnter('   ');
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(0);
  });

  it('should show label when provided', () => {
    host.label.set('Tags');
    fixture.detectChanges();
    expect(el.querySelector('.lc-tag-input__label')?.textContent?.trim()).toBe('Tags');
  });

  it('should disable input', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(el.querySelector('.lc-tag-input__container--disabled')).toBeTruthy();
    expect(el.querySelector('.lc-tag-input__input')).toBeFalsy();
  });

  it('should hide remove buttons when not removable', () => {
    host.removable.set(false);
    fixture.detectChanges();
    addTagViaEnter('Tag');
    expect(el.querySelector('.lc-tag-input__tag-remove')).toBeFalsy();
  });

  it('should add tag on comma', () => {
    const input = getInput();
    input.value = 'Test';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: ',', bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-tag-input__tag').length).toBe(1);
  });
});
