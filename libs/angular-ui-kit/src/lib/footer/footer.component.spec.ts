import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FooterComponent, FooterSection } from './footer.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [FooterComponent],
  template: `
    <lc-footer
      [sections]="sections"
      [copyright]="copyright"
      [showBorder]="showBorder"
      [compact]="compact"
    />
  `,
})
class TestHostComponent {
  sections: FooterSection[] = [];
  copyright = '';
  showBorder = true;
  compact = false;
}

describe('FooterComponent', () => {
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

  it('should render footer element', () => {
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer.getAttribute('role')).toBe('contentinfo');
  });

  it('should render copyright text', () => {
    host.copyright = '© 2026 Life-Cockpit';
    fixture.detectChanges();
    const copyright = fixture.nativeElement.querySelector('.footer__copyright');
    expect(copyright.textContent.trim()).toBe('© 2026 Life-Cockpit');
  });

  it('should render sections with links', () => {
    host.sections = [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '/features' },
          { label: 'Pricing', href: '/pricing' },
        ],
      },
      {
        title: 'Company',
        links: [{ label: 'About', href: '/about' }],
      },
    ];
    fixture.detectChanges();

    const sectionTitles = fixture.nativeElement.querySelectorAll('.footer__section-title');
    expect(sectionTitles.length).toBe(2);
    expect(sectionTitles[0].textContent.trim()).toBe('Product');

    const links = fixture.nativeElement.querySelectorAll('.footer__link');
    expect(links.length).toBe(3);
  });

  it('should apply bordered class by default', () => {
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer.classList).toContain('footer--bordered');
  });

  it('should not apply bordered class when disabled', () => {
    host.showBorder = false;
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer.classList).not.toContain('footer--bordered');
  });

  it('should apply compact class', () => {
    host.compact = true;
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('.footer');
    expect(footer.classList).toContain('footer--compact');
  });

  it('should not render sections in compact mode', () => {
    host.compact = true;
    host.sections = [
      { title: 'Test', links: [{ label: 'Link', href: '#' }] },
    ];
    fixture.detectChanges();
    const sections = fixture.nativeElement.querySelector('.footer__sections');
    expect(sections).toBeNull();
  });

  it('should set target blank for external links', () => {
    host.sections = [
      {
        title: 'External',
        links: [{ label: 'GitHub', href: 'https://github.com', external: true }],
      },
    ];
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.footer__link');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
