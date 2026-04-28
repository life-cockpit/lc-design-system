/**
 * Life-Cockpit Design System (UI Kit)
 *
 * Public API for the design system library.
 *
 * To use global styles, import in your Angular application's styles.scss:
 * @import '@life-cockpit/angular-ui-kit/styles/index.scss';
 */

// ============================================================================
// Design Tokens
// ============================================================================
// Import all generated token constants (colors, spacing, typography, etc.)
export * from './lib/tokens';

// ============================================================================
// Theme System
// ============================================================================
// Theme types for TypeScript type safety
export * from './lib/theme/theme.types';

// Theme service for light/dark mode switching
export * from './lib/theme/theme.service';

// ============================================================================
// Models & Interfaces
// ============================================================================
// Navigation Item interface
export * from './lib/models/navigation-item.interface';

// ============================================================================
// Components
// ============================================================================
// Accordion Component
export * from './lib/accordion/accordion.component';

// Button Component
export * from './lib/button/button.component';

// Card Component
export * from './lib/card/card.component';

// Checkbox Component
export * from './lib/checkbox/checkbox.component';

// Icon Component
export * from './lib/icon/icon.component';

// Logo Component
export * from './lib/logo/logo.component';

// Menu Component
export * from './lib/menu/menu.component';

// Input Component
export * from './lib/input/input.component';

// Radio Component
export * from './lib/radio/radio.component';

// Typography Component
export * from './lib/typography/typography.component';

// ============================================================================
// Form Components
// ============================================================================
// DatePicker Component
export * from './lib/datepicker/datepicker.component';

// Select Component
export * from './lib/select/select.component';

// Switch Component
export * from './lib/switch/switch.component';

// Textarea Component
export * from './lib/textarea/textarea.component';

// Password Input Component
export * from './lib/password-input/password-input.component';

// Verification Code Input Component
export * from './lib/verification-code-input/verification-code-input.component';

// Email Input Component
export * from './lib/email-input/email-input.component';

// ============================================================================
// Layout Components
// ============================================================================
// Container Component
export * from './lib/container/container.component';

// Section Component
export * from './lib/section/section.component';

// Spacer Component
export * from './lib/spacer/spacer.component';

// Stack Component
export * from './lib/stack/stack.component';

// ============================================================================
// Feedback Components
// ============================================================================
// Alert Component
export * from './lib/alert/alert.component';

// Error Display Component
export * from './lib/error-display/error-display.component';

// Toast Service and Component
export * from './lib/toast/toast.service';
export * from './lib/toast/toast.component';

// Modal Component
export * from './lib/modal/modal.component';

// Tooltip Directive
export * from './lib/tooltip/tooltip.directive';

// ============================================================================
// Navigation Components
// ============================================================================
// Breadcrumbs Component
export * from './lib/breadcrumbs/breadcrumbs.component';

// Header Component
export * from './lib/header/header.component';

// Pagination Component
export * from './lib/pagination/pagination.component';

// Sidenav Component
export * from './lib/sidenav/sidenav.component';

// Tabs Component
export * from './lib/tabs/tabs.component';

// ============================================================================
// Data Display Components
// ============================================================================
// Avatar Component
export * from './lib/avatar/avatar.component';

// Badge Component
export * from './lib/badge/badge.component';

// MetricCard Component
export * from './lib/metric-card/metric-card.component';

// ToggleGroup Component
export * from './lib/toggle-group/toggle-group.component';

// List Component
export * from './lib/list/list.component';
export * from './lib/list/list-item-template.directive';

// Chip Component
export * from './lib/chip/chip.component';

// Table Component
export * from './lib/table/table.component';
export * from './lib/table/table-cell.directive';

// Field Group Component
export * from './lib/field-group/field-group.component';

// Stepper Component
export * from './lib/stepper/stepper.component';

// FilterBar Component
export * from './lib/filter-bar/filter-bar.component';

// Spinner Component
export * from './lib/spinner/spinner.component';

// Skeleton Component
export * from './lib/skeleton/skeleton.component';

// Empty State Component
export * from './lib/empty-state/empty-state.component';

// Drawer Component
export * from './lib/drawer/drawer.component';

// ============================================================================
// Styles
// ============================================================================
// Styles are available at: libs/shared/src/styles/index.scss
// Import path: '@life-cockpit/angular-ui-kit/styles/index.scss'
