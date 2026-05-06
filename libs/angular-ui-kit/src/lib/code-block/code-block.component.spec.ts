import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CodeBlockComponent, CodeBlockLanguage } from './code-block.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <lc-code-block
      [code]="code"
      [language]="language"
      [filename]="filename"
      [showLineNumbers]="showLineNumbers"
      [showCopy]="showCopy"
      [showHeader]="showHeader"
    />
  `,
})
class TestHostComponent {
  code = 'const x = 42;';
  language: CodeBlockLanguage = 'typescript';
  filename = '';
  showLineNumbers = true;
  showCopy = true;
  showHeader = true;
}

describe('CodeBlockComponent', () => {
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

  it('should render code content', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.code-block__line-content');
    expect(content.textContent).toContain('const x = 42;');
  });

  it('should render line numbers', () => {
    host.code = 'line1\nline2\nline3';
    fixture.detectChanges();
    const lineNums = fixture.nativeElement.querySelectorAll('.code-block__line-number');
    expect(lineNums.length).toBe(3);
    expect(lineNums[0].textContent.trim()).toBe('1');
    expect(lineNums[2].textContent.trim()).toBe('3');
  });

  it('should hide line numbers when disabled', () => {
    host.showLineNumbers = false;
    fixture.detectChanges();
    const lineNums = fixture.nativeElement.querySelectorAll('.code-block__line-number');
    expect(lineNums.length).toBe(0);
  });

  it('should render header with language', () => {
    fixture.detectChanges();
    const langLabel = fixture.nativeElement.querySelector('.code-block__language');
    expect(langLabel.textContent.trim()).toBe('typescript');
  });

  it('should show filename in header when provided', () => {
    host.filename = 'app.ts';
    fixture.detectChanges();
    const langLabel = fixture.nativeElement.querySelector('.code-block__language');
    expect(langLabel.textContent.trim()).toBe('app.ts');
  });

  it('should hide header when showHeader is false', () => {
    host.showHeader = false;
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.code-block__header');
    expect(header).toBeNull();
  });

  it('should render copy button', () => {
    fixture.detectChanges();
    const copyBtn = fixture.nativeElement.querySelector('.code-block__copy');
    expect(copyBtn).toBeTruthy();
  });

  it('should hide copy button when disabled', () => {
    host.showCopy = false;
    fixture.detectChanges();
    const copyBtn = fixture.nativeElement.querySelector('.code-block__copy');
    expect(copyBtn).toBeNull();
  });

  it('should render multiple lines', () => {
    host.code = 'const a = 1;\nconst b = 2;\nconst c = 3;';
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.code-block__line');
    expect(lines.length).toBe(3);
  });
});
