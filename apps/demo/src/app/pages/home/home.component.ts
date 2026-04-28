import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private sanitizer = inject(DomSanitizer);

  // Moved template to home.component.html
  protected usageExample = `import { ButtonComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  imports: [ButtonComponent],
  template: \`
    <lc-button variant="primary" size="md">
      Click Me
    </lc-button>
  \`
})
export class MyComponent {}`;

  protected features: { title: string; description: string; icon: SafeHtml }[] = [
    {
      title: 'Design Tokens',
      description:
        'Centralized design tokens generated via Style Dictionary for consistent styling across all components.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>'),
    },
    {
      title: 'Accessible',
      description:
        'WCAG 2.1 AA compliant components with proper ARIA attributes and keyboard navigation support.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'),
    },
    {
      title: 'Dark Mode',
      description:
        'Built-in theme system with light and dark modes. Seamlessly toggle between themes with persistent preferences.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>'),
    },
    {
      title: 'Mobile First',
      description:
        'Responsive components designed for mobile devices first, then progressively enhanced for larger screens.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>'),
    },
    {
      title: 'TypeScript',
      description:
        'Fully typed with strict TypeScript configuration. Excellent IDE support and type safety throughout.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>'),
    },
    {
      title: 'TDD Approach',
      description:
        'Comprehensive test coverage with unit, integration, and E2E tests. Built with Test-Driven Development methodology.',
      icon: this.sanitizer.bypassSecurityTrustHtml('<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'),
    },
  ];
}
