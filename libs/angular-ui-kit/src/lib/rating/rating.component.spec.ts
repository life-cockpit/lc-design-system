import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RatingComponent, RatingSize } from './rating.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [RatingComponent],
  template: `
    <lc-rating
      [max]="max"
      [size]="size"
      [readonly]="readonly"
      [disabled]="disabled"
      [label]="label"
      [showValue]="showValue"
      (ratingChange)="onRating($event)"
    />
  `,
})
class TestHostComponent {
  max = 5;
  size: RatingSize = 'md';
  readonly = false;
  disabled = false;
  label = '';
  showValue = false;
  lastRating: number | null = null;
  onRating(val: number) {
    this.lastRating = val;
  }
}

describe('RatingComponent', () => {
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
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 5 stars by default', () => {
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    expect(stars.length).toBe(5);
  });

  it('should render custom number of stars', () => {
    host.max = 10;
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    expect(stars.length).toBe(10);
  });

  it('should emit rating on click', () => {
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    stars[2].click();
    fixture.detectChanges();
    expect(host.lastRating).toBe(3);
  });

  it('should not emit when readonly', () => {
    host.readonly = true;
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    stars[2].click();
    expect(host.lastRating).toBeNull();
  });

  it('should not emit when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    stars[2].click();
    expect(host.lastRating).toBeNull();
  });

  it('should apply readonly class', () => {
    host.readonly = true;
    fixture.detectChanges();
    const rating = fixture.nativeElement.querySelector('.rating');
    expect(rating.classList).toContain('rating--readonly');
  });

  it('should apply disabled class', () => {
    host.disabled = true;
    fixture.detectChanges();
    const rating = fixture.nativeElement.querySelector('.rating');
    expect(rating.classList).toContain('rating--disabled');
  });

  it('should render label', () => {
    host.label = 'Your rating';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.rating__label');
    expect(label.textContent.trim()).toBe('Your rating');
  });

  it('should show value when enabled', () => {
    host.showValue = true;
    fixture.detectChanges();
    const valueEl = fixture.nativeElement.querySelector('.rating__value');
    expect(valueEl).toBeTruthy();
    expect(valueEl.textContent).toContain('0/5');
  });

  it('should apply size class', () => {
    host.size = 'lg';
    fixture.detectChanges();
    const rating = fixture.nativeElement.querySelector('.rating');
    expect(rating.classList).toContain('rating--lg');
  });

  it('should fill stars up to selected value', () => {
    fixture.detectChanges();
    const stars = fixture.nativeElement.querySelectorAll('.rating__star');
    stars[3].click(); // rate 4
    fixture.detectChanges();

    const filledIcons = fixture.nativeElement.querySelectorAll('.rating__icon--filled');
    expect(filledIcons.length).toBe(4);
  });
});
