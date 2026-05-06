import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { SearchInputComponent, SearchInputSize } from './search-input.component';

@Component({
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <lc-search-input
      [placeholder]="placeholder"
      [size]="size"
      [debounceMs]="debounceMs"
      [disabled]="disabled"
      (searchChange)="onSearchChange($event)"
      (searchSubmit)="onSearchSubmit($event)"
    ></lc-search-input>
  `,
})
class TestHostComponent {
  placeholder = 'Search…';
  size: SearchInputSize = 'md';
  debounceMs = 0; // no debounce in tests
  disabled = false;
  lastSearchValue = '';
  lastSubmitValue = '';

  onSearchChange(value: string): void {
    this.lastSearchValue = value;
  }

  onSearchSubmit(value: string): void {
    this.lastSubmitValue = value;
  }
}

describe('SearchInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(SearchInputComponent))).toBeTruthy();
  });

  it('should render search icon', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.search-input__icon'))).toBeTruthy();
  });

  it('should apply size class', () => {
    host.size = 'lg';
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.search-input')).nativeElement.classList).toContain('search-input--lg');
  });

  it('should apply disabled class', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.search-input')).nativeElement.classList).toContain('search-input--disabled');
  });

  it('should show clear button when value is present', async () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.search-input__clear'))).toBeTruthy();
  });

  it('should not show clear button when empty', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.search-input__clear'))).toBeNull();
  });

  it('should emit searchChange on input', (done) => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));

    // debounceMs is 0, so it should emit on next microtask
    setTimeout(() => {
      expect(host.lastSearchValue).toBe('hello');
      done();
    }, 10);
  });

  it('should emit searchSubmit on Enter', () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'query';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(host.lastSubmitValue).toBe('query');
  });

  it('should clear value on clear click', async () => {
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'text';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const clearBtn = fixture.debugElement.query(By.css('.search-input__clear'));
    clearBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.lastSearchValue).toBe('');
  });

  it('should have placeholder', () => {
    host.placeholder = 'Find items...';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.placeholder).toBe('Find items...');
  });
});
});
