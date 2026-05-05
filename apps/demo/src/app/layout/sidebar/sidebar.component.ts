import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@life-cockpit/angular-ui-kit';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen = input<boolean>(false);
  closeSidebar = output<void>();

  protected navSections: NavItem[] = [
    {
      label: 'Getting Started',
      path: '',
      children: [
        {
          label: 'Home',
          path: '/',
          icon: this.getHomeIcon(),
        },
      ],
    },
    {
      label: 'Design Tokens',
      path: '/tokens',
      children: [
        {
          label: 'Colors',
          path: '/tokens/colors',
          icon: this.getColorIcon(),
        },
        {
          label: 'Spacing',
          path: '/tokens/spacing',
          icon: this.getSpacingIcon(),
        },
        {
          label: 'Typography',
          path: '/tokens/typography',
          icon: this.getTypographyIcon(),
        },
        {
          label: 'Elevation',
          path: '/tokens/elevation',
          icon: this.getElevationIcon(),
        },
        {
          label: 'Animation',
          path: '/tokens/animation',
          icon: this.getAnimationIcon(),
        },
        {
          label: 'Sizes',
          path: '/tokens/sizes',
          icon: this.getSizesIcon(),
        },
      ],
    },
    {
      label: 'Components',
      path: '/components',
      children: [
        {
          label: 'Accordion',
          path: '/components/accordion',
          icon: this.getAccordionIcon(),
        },
        {
          label: 'Button',
          path: '/components/button',
          icon: this.getButtonIcon(),
        },
        {
          label: 'Card',
          path: '/components/card',
          icon: this.getCardIcon(),
        },
        {
          label: 'Checkbox',
          path: '/components/checkbox',
          icon: this.getCheckboxIcon(),
        },
        {
          label: 'Container',
          path: '/components/container',
          icon: this.getContainerIcon(),
        },
        {
          label: 'DatePicker',
          path: '/components/datepicker',
          icon: this.getCalendarIcon(),
        },
        {
          label: 'Field Group',
          path: '/components/field-group',
          icon: this.getFieldGroupIcon(),
        },
        {
          label: 'Hero',
          path: '/components/hero',
          icon: this.getHeroIcon(),
        },
        {
          label: 'Icon',
          path: '/components/icon',
          icon: this.getIconIcon(),
        },
        {
          label: 'Logo',
          path: '/components/logo',
          icon: this.getLogoIcon(),
        },
        {
          label: 'Input',
          path: '/components/input',
          icon: this.getInputIcon(),
        },
        {
          label: 'Email Input',
          path: '/components/email-input',
          icon: this.getEmailInputIcon(),
        },
        {
          label: 'Password Input',
          path: '/components/password-input',
          icon: this.getPasswordInputIcon(),
        },
        {
          label: 'Verification Code',
          path: '/components/verification-code-input',
          icon: this.getVerificationCodeIcon(),
        },
        {
          label: 'Radio',
          path: '/components/radio',
          icon: this.getRadioIcon(),
        },
        {
          label: 'Select',
          path: '/components/select',
          icon: this.getSelectIcon(),
        },
        {
          label: 'Stack',
          path: '/components/stack',
          icon: this.getStackIcon(),
        },
        {
          label: 'Switch',
          path: '/components/switch',
          icon: this.getSwitchIcon(),
        },
        {
          label: 'Textarea',
          path: '/components/textarea',
          icon: this.getTextareaIcon(),
        },
        {
          label: 'Typography',
          path: '/components/typography',
          icon: this.getTypographyIcon(),
        },
      ],
    },
    {
      label: 'Feedback',
      path: '/components',
      children: [
        {
          label: 'Alert',
          path: '/components/alert',
          icon: this.getAlertIcon(),
        },
        {
          label: 'Error Display',
          path: '/components/error-display',
          icon: this.getErrorDisplayIcon(),
        },
        {
          label: 'Toast',
          path: '/components/toast',
          icon: this.getToastIcon(),
        },
        {
          label: 'Modal',
          path: '/components/modal',
          icon: this.getModalIcon(),
        },
        {
          label: 'Tooltip',
          path: '/components/tooltip',
          icon: this.getTooltipIcon(),
        },
        {
          label: 'Spinner',
          path: '/components/spinner',
          icon: this.getSpinnerIcon(),
        },
        {
          label: 'Empty State',
          path: '/components/empty-state',
          icon: this.getEmptyStateIcon(),
        },
      ],
    },
    {
      label: 'Navigation',
      path: '/components',
      children: [
        {
          label: 'Breadcrumbs',
          path: '/components/breadcrumbs',
          icon: this.getBreadcrumbsIcon(),
        },
        {
          label: 'Header',
          path: '/components/header',
          icon: this.getHeaderIcon(),
        },
        {
          label: 'Pagination',
          path: '/components/pagination',
          icon: this.getPaginationIcon(),
        },
        {
          label: 'Sidenav',
          path: '/components/sidenav',
          icon: this.getSidenavIcon(),
        },
        {
          label: 'Tabs',
          path: '/components/tabs',
          icon: this.getTabsIcon(),
        },
        {
          label: 'Badge',
          path: '/components/badge',
          icon: this.getBadgeIcon(),
        },
        {
          label: 'Avatar',
          path: '/components/avatar',
          icon: this.getAvatarIcon(),
        },
        {
          label: 'List',
          path: '/components/list',
          icon: this.getListIcon(),
        },
        {
          label: 'Chip',
          path: '/components/chip',
          icon: this.getChipIcon(),
        },
        {
          label: 'Table',
          path: '/components/table',
          icon: this.getTableIcon(),
        },
        {
          label: 'Filter Bar',
          path: '/components/filter-bar',
          icon: this.getFilterBarIcon(),
        },
        {
          label: 'Stepper',
          path: '/components/stepper',
          icon: this.getStepperIcon(),
        },
        {
          label: 'Menu',
          path: '/components/menu',
          icon: this.getMenuIcon(),
        },
      ],
    },
    {
      label: 'Patterns',
      path: '/patterns',
      children: [
        {
          label: 'Grid',
          path: '/patterns/grid',
          icon: this.getGridIcon(),
        },
      ],
    },
  ];

  protected isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  protected onNavItemClick(): void {
    if (this.isMobile()) {
      this.closeSidebar.emit();
    }
  }

  private getHomeIcon(): string {
    return 'home';
  }

  private getColorIcon(): string {
    return 'paint-brush';
  }

  private getSpacingIcon(): string {
    return 'arrows-pointing-out';
  }

  private getElevationIcon(): string {
    return 'folder';
  }

  private getAnimationIcon(): string {
    return 'bolt';
  }

  private getSizesIcon(): string {
    return 'squares-2x2';
  }

  private getButtonIcon(): string {
    return 'cursor-arrow-rays';
  }

  private getAccordionIcon(): string {
    return 'bars-3-bottom-left';
  }

  private getCardIcon(): string {
    return 'rectangle-stack';
  }

  private getFieldGroupIcon(): string {
    return 'queue-list';
  }

  private getHeroIcon(): string {
    return 'window';
  }

  private getInputIcon(): string {
    return 'pencil-square';
  }

  private getEmailInputIcon(): string {
    return 'envelope';
  }

  private getPasswordInputIcon(): string {
    return 'lock-closed';
  }

  private getVerificationCodeIcon(): string {
    return 'shield-check';
  }

  private getTypographyIcon(): string {
    return 'language';
  }

  private getCheckboxIcon(): string {
    return 'check-circle';
  }

  private getIconIcon(): string {
    return 'photo';
  }

  private getLogoIcon(): string {
    return 'identification';
  }

  private getRadioIcon(): string {
    return 'check-circle';
  }

  private getStackIcon(): string {
    return 'bars-3';
  }

  private getContainerIcon(): string {
    return 'cube';
  }

  private getSelectIcon(): string {
    return 'clipboard-document-check';
  }

  private getTextareaIcon(): string {
    return 'document-text';
  }

  private getSwitchIcon(): string {
    return 'arrow-path';
  }

  private getCalendarIcon(): string {
    return 'calendar';
  }

  private getAlertIcon(): string {
    return 'exclamation-triangle';
  }

  private getErrorDisplayIcon(): string {
    return 'exclamation-circle';
  }

  private getToastIcon(): string {
    return 'chat-bubble-left';
  }

  private getModalIcon(): string {
    return 'rectangle-group';
  }

  private getTooltipIcon(): string {
    return 'information-circle';
  }

  private getPopoverIcon(): string {
    return 'chat-bubble-oval-left-ellipsis';
  }

  private getBreadcrumbsIcon(): string {
    return 'home';
  }

  private getHeaderIcon(): string {
    return 'window';
  }

  private getPaginationIcon(): string {
    return 'document-duplicate';
  }

  private getSidenavIcon(): string {
    return 'bars-3-bottom-left';
  }

  private getTabsIcon(): string {
    return 'squares-plus';
  }

  private getBadgeIcon(): string {
    return 'tag';
  }

  private getAvatarIcon(): string {
    return 'user-circle';
  }

  private getListIcon(): string {
    return 'list-bullet';
  }

  private getChipIcon(): string {
    return 'hashtag';
  }

  private getTableIcon(): string {
    return 'table-cells';
  }

  private getGridIcon(): string {
    return 'squares-2x2';
  }

  private getMenuIcon(): string {
    return 'ellipsis-vertical';
  }

  private getSpinnerIcon(): string {
    return 'arrow-path-rounded-square';
  }

  private getEmptyStateIcon(): string {
    return 'inbox-stack';
  }

  private getFilterBarIcon(): string {
    return 'funnel';
  }

  private getStepperIcon(): string {
    return 'numbered-list';
  }
}
