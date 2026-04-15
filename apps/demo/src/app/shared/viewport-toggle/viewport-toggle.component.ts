import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full';

export interface Viewport {
  name: ViewportSize;
  width: string;
  height: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-viewport-toggle',
  imports: [CommonModule],
  templateUrl: './viewport-toggle.component.html',
  styleUrl: './viewport-toggle.component.scss',
})
export class ViewportToggleComponent {
  // Moved template to viewport-toggle.component.html
  showInfo = signal(true);
  currentViewport = signal<ViewportSize>('full');

  viewportChange = output<Viewport>();

  protected viewports: Viewport[] = [
    {
      name: 'mobile',
      width: '375px',
      height: '667px',
      label: 'Mobile',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    },
    {
      name: 'tablet',
      width: '768px',
      height: '1024px',
      label: 'Tablet',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    },
    {
      name: 'desktop',
      width: '1280px',
      height: '720px',
      label: 'Desktop',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
    },
    {
      name: 'full',
      width: '100%',
      height: '100%',
      label: 'Full Width',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>',
    },
  ];

  protected selectViewport(size: ViewportSize): void {
    this.currentViewport.set(size);
    const viewport = this.viewports.find((v) => v.name === size);
    if (viewport) {
      this.viewportChange.emit(viewport);
    }
  }

  protected getCurrentViewport(): Viewport | undefined {
    return this.viewports.find((v) => v.name === this.currentViewport());
  }

  /**
   * Programmatically set the current viewport
   */
  setViewport(size: ViewportSize): void {
    this.selectViewport(size);
  }

  /**
   * Toggle info display
   */
  toggleInfo(): void {
    this.showInfo.update((show) => !show);
  }
}
