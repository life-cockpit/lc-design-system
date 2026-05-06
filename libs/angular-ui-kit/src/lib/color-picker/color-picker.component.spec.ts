import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ColorPickerComponent } from './color-picker.component';

@Component({
  standalone: true,
  imports: [ColorPickerComponent],
  template: `
    <lc-color-picker
      [label]="label"
      [swatches]="swatches"
      [showInput]="showInput"
      [disabled]="disabled"
      (colorChange)="onColor($event)"
    />
  `,
})
class TestHostComponent {
  label = '';
  swatches = ['#ef4444', '#22c55e', '#3b82f6', '#000000'];
  showInput = true;
  disabled = false;
  lastColor: string | null = null;
  onColor(val: string) {
    this.lastColor = val;
  }
}

describe('ColorPickerComponent', () => {
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
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render swatches', () => {
    fixture.detectChanges();
    const swatches = fixture.nativeElement.querySelectorAll('.color-picker__swatch');
    expect(swatches.length).toBe(4);
  });

  it('should emit color on swatch click', () => {
    fixture.detectChanges();
    const swatches = fixture.nativeElement.querySelectorAll('.color-picker__swatch');
    swatches[0].click();
    expect(host.lastColor).toBe('#ef4444');
  });

  it('should render native color input', () => {
    fixture.detectChanges();
    const native = fixture.nativeElement.querySelector('input[type="color"]');
    expect(native).toBeTruthy();
  });

  it('should render hex input when showInput is true', () => {
    fixture.detectChanges();
    const hexInput = fixture.nativeElement.querySelector('.color-picker__hex-input');
    expect(hexInput).toBeTruthy();
  });

  it('should not render hex input when showInput is false', () => {
    host.showInput = false;
    fixture.detectChanges();
    const hexInput = fixture.nativeElement.querySelector('.color-picker__hex-input');
    expect(hexInput).toBeNull();
  });

  it('should render label when provided', () => {
    host.label = 'Farbe wählen';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.color-picker__label');
    expect(label.textContent.trim()).toBe('Farbe wählen');
  });

  it('should apply disabled class', () => {
    host.disabled = true;
    fixture.detectChanges();
    const picker = fixture.nativeElement.querySelector('.color-picker');
    expect(picker.classList).toContain('color-picker--disabled');
  });

  it('should not emit when disabled', () => {
    host.disabled = true;
    fixture.detectChanges();
    const swatches = fixture.nativeElement.querySelectorAll('.color-picker__swatch');
    swatches[0].click();
    expect(host.lastColor).toBeNull();
  });

  it('should mark selected swatch', () => {
    fixture.detectChanges();
    const swatches = fixture.nativeElement.querySelectorAll('.color-picker__swatch');
    swatches[2].click(); // #3b82f6
    fixture.detectChanges();
    expect(swatches[2].classList).toContain('color-picker__swatch--selected');
  });
});
