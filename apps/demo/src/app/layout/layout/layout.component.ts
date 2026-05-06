import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  HeaderComponent,
  ToastComponent,
  ToastService,
  SidenavComponent,
  NavigationItem,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidenavComponent, ToastComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  protected sidebarOpen = signal(true);
  protected toastService = inject(ToastService);

  protected readonly navItems: NavigationItem[] = [
    // Getting Started
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: '',
      route: '',
      displayOrder: 1,
      isSection: true,
      children: [{ id: 'home', label: 'Home', icon: 'home', route: '/', displayOrder: 1 }],
    },
    // Design Tokens
    {
      id: 'design-tokens',
      label: 'Design Tokens',
      icon: '',
      route: '',
      displayOrder: 2,
      isSection: true,
      children: [
        {
          id: 'colors',
          label: 'Colors',
          icon: 'paint-brush',
          route: '/tokens/colors',
          displayOrder: 1,
        },
        {
          id: 'spacing',
          label: 'Spacing',
          icon: 'arrows-pointing-out',
          route: '/tokens/spacing',
          displayOrder: 2,
        },
        {
          id: 'typography-token',
          label: 'Typography',
          icon: 'language',
          route: '/tokens/typography',
          displayOrder: 3,
        },
        {
          id: 'elevation',
          label: 'Elevation',
          icon: 'folder',
          route: '/tokens/elevation',
          displayOrder: 4,
        },
        {
          id: 'animation',
          label: 'Animation',
          icon: 'bolt',
          route: '/tokens/animation',
          displayOrder: 5,
        },
        {
          id: 'sizes',
          label: 'Sizes',
          icon: 'squares-2x2',
          route: '/tokens/sizes',
          displayOrder: 6,
        },
      ],
    },
    // Components
    {
      id: 'components',
      label: 'Components',
      icon: '',
      route: '',
      displayOrder: 3,
      isSection: true,
      children: [
        {
          id: 'accordion',
          label: 'Accordion',
          icon: 'bars-3-bottom-left',
          route: '/components/accordion',
          displayOrder: 0,
        },
        {
          id: 'button',
          label: 'Button',
          icon: 'cursor-arrow-rays',
          route: '/components/button',
          displayOrder: 1,
        },
        {
          id: 'card',
          label: 'Card',
          icon: 'rectangle-stack',
          route: '/components/card',
          displayOrder: 2,
        },
        {
          id: 'checkbox',
          label: 'Checkbox',
          icon: 'check-circle',
          route: '/components/checkbox',
          displayOrder: 3,
        },
        {
          id: 'container',
          label: 'Container',
          icon: 'cube',
          route: '/components/container',
          displayOrder: 4,
        },
        {
          id: 'datepicker',
          label: 'DatePicker',
          icon: 'calendar',
          route: '/components/datepicker',
          displayOrder: 5,
        },
        {
          id: 'divider',
          label: 'Divider',
          icon: 'minus',
          route: '/components/divider',
          displayOrder: 6,
        },
        {
          id: 'field-group',
          label: 'Field Group',
          icon: 'queue-list',
          route: '/components/field-group',
          displayOrder: 7,
        },
        {
          id: 'file-upload',
          label: 'File Upload',
          icon: 'cloud-arrow-up',
          route: '/components/file-upload',
          displayOrder: 8,
        },
        {
          id: 'hero',
          label: 'Hero',
          icon: 'window',
          route: '/components/hero',
          displayOrder: 7,
        },
        { id: 'icon', label: 'Icon', icon: 'photo', route: '/components/icon', displayOrder: 8 },
        {
          id: 'logo',
          label: 'Logo',
          icon: 'identification',
          route: '/components/logo',
          displayOrder: 8,
        },
        {
          id: 'input',
          label: 'Input',
          icon: 'pencil-square',
          route: '/components/input',
          displayOrder: 9,
        },
        {
          id: 'email-input',
          label: 'Email Input',
          icon: 'envelope',
          route: '/components/email-input',
          displayOrder: 10,
        },
        {
          id: 'password-input',
          label: 'Password Input',
          icon: 'lock-closed',
          route: '/components/password-input',
          displayOrder: 11,
        },
        {
          id: 'verification-code',
          label: 'Verification Code',
          icon: 'shield-check',
          route: '/components/verification-code-input',
          displayOrder: 12,
        },
        {
          id: 'radio',
          label: 'Radio',
          icon: 'check-circle',
          route: '/components/radio',
          displayOrder: 13,
        },
        {
          id: 'select',
          label: 'Select',
          icon: 'clipboard-document-check',
          route: '/components/select',
          displayOrder: 14,
        },
        {
          id: 'stack',
          label: 'Stack',
          icon: 'bars-3',
          route: '/components/stack',
          displayOrder: 15,
        },
        {
          id: 'switch',
          label: 'Switch',
          icon: 'arrow-path',
          route: '/components/switch',
          displayOrder: 16,
        },
        {
          id: 'textarea',
          label: 'Textarea',
          icon: 'document-text',
          route: '/components/textarea',
          displayOrder: 17,
        },
        {
          id: 'typography',
          label: 'Typography',
          icon: 'language',
          route: '/components/typography',
          displayOrder: 18,
        },
        {
          id: 'popover',
          label: 'Popover',
          icon: 'chat-bubble-bottom-center-text',
          route: '/components/popover',
          displayOrder: 19,
        },
        {
          id: 'progress-bar',
          label: 'Progress Bar',
          icon: 'chart-bar',
          route: '/components/progress-bar',
          displayOrder: 20,
        },
        {
          id: 'search-input',
          label: 'Search Input',
          icon: 'magnifying-glass',
          route: '/components/search-input',
          displayOrder: 21,
        },
      ],
    },
    // Feedback
    {
      id: 'feedback',
      label: 'Feedback',
      icon: '',
      route: '',
      displayOrder: 4,
      isSection: true,
      children: [
        {
          id: 'alert',
          label: 'Alert',
          icon: 'exclamation-triangle',
          route: '/components/alert',
          displayOrder: 1,
        },
        {
          id: 'error-display',
          label: 'Error Display',
          icon: 'exclamation-circle',
          route: '/components/error-display',
          displayOrder: 2,
        },
        {
          id: 'toast',
          label: 'Toast',
          icon: 'chat-bubble-left',
          route: '/components/toast',
          displayOrder: 3,
        },
        {
          id: 'modal',
          label: 'Modal',
          icon: 'rectangle-group',
          route: '/components/modal',
          displayOrder: 4,
        },
        {
          id: 'tooltip',
          label: 'Tooltip',
          icon: 'information-circle',
          route: '/components/tooltip',
          displayOrder: 5,
        },
        {
          id: 'spinner',
          label: 'Spinner',
          icon: 'arrow-path-rounded-square',
          route: '/components/spinner',
          displayOrder: 6,
        },
        {
          id: 'empty-state',
          label: 'Empty State',
          icon: 'inbox-stack',
          route: '/components/empty-state',
          displayOrder: 7,
        },
        {
          id: 'skeleton',
          label: 'Skeleton',
          icon: 'rectangle-stack',
          route: '/components/skeleton',
          displayOrder: 8,
        },
      ],
    },
    // Navigation
    {
      id: 'navigation',
      label: 'Navigation',
      icon: '',
      route: '',
      displayOrder: 5,
      isSection: true,
      children: [
        {
          id: 'breadcrumbs',
          label: 'Breadcrumbs',
          icon: 'home',
          route: '/components/breadcrumbs',
          displayOrder: 1,
        },
        {
          id: 'header',
          label: 'Header',
          icon: 'window',
          route: '/components/header',
          displayOrder: 2,
        },
        {
          id: 'pagination',
          label: 'Pagination',
          icon: 'document-duplicate',
          route: '/components/pagination',
          displayOrder: 3,
        },
        {
          id: 'sidenav',
          label: 'Sidenav',
          icon: 'bars-3-bottom-left',
          route: '/components/sidenav',
          displayOrder: 4,
        },
        {
          id: 'tabs',
          label: 'Tabs',
          icon: 'squares-plus',
          route: '/components/tabs',
          displayOrder: 5,
        },
      ],
    },
    // Data Display
    {
      id: 'data-display',
      label: 'Data Display',
      icon: '',
      route: '',
      displayOrder: 6,
      isSection: true,
      children: [
        { id: 'badge', label: 'Badge', icon: 'tag', route: '/components/badge', displayOrder: 1 },
        {
          id: 'avatar',
          label: 'Avatar',
          icon: 'user-circle',
          route: '/components/avatar',
          displayOrder: 2,
        },
        {
          id: 'list',
          label: 'List',
          icon: 'list-bullet',
          route: '/components/list',
          displayOrder: 3,
        },
        { id: 'chip', label: 'Chip', icon: 'hashtag', route: '/components/chip', displayOrder: 4 },
        {
          id: 'table',
          label: 'Table',
          icon: 'table-cells',
          route: '/components/table',
          displayOrder: 5,
        },
        {
          id: 'filter-bar',
          label: 'Filter Bar',
          icon: 'funnel',
          route: '/components/filter-bar',
          displayOrder: 6,
        },
        {
          id: 'stepper',
          label: 'Stepper',
          icon: 'numbered-list',
          route: '/components/stepper',
          displayOrder: 7,
        },
        {
          id: 'menu',
          label: 'Menu',
          icon: 'ellipsis-vertical',
          route: '/components/menu',
          displayOrder: 8,
        },
      ],
    },
    // Patterns
    {
      id: 'patterns',
      label: 'Patterns',
      icon: '',
      route: '',
      displayOrder: 7,
      isSection: true,
      children: [
        {
          id: 'grid',
          label: 'Grid',
          icon: 'squares-2x2',
          route: '/patterns/grid',
          displayOrder: 1,
        },
      ],
    },
  ];

  protected handleProfileClick(): void {
    this.toastService.show({
      message: 'Navigate to profile page',
      variant: 'info',
    });
  }

  protected onNavItemClick(): void {
    // On mobile, close the sidebar when navigating
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarOpen.set(false);
    }
  }
}
