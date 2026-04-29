# @life-cockpit/angular-ui-kit

Angular UI component library for the Life Cockpit Design System.

## Installation

```bash
npm install @life-cockpit/angular-ui-kit
```

### Peer Dependencies

Make sure these are installed in your project:

```bash
npm install @angular/cdk @angular/common @angular/core @angular/forms @angular/platform-browser @angular/router rxjs
```

## Setup

Import the global styles in your `styles.scss`:

```scss
@import '@life-cockpit/angular-ui-kit/styles/index.scss';
```

## Usage

Import components directly in your Angular standalone components or modules:

```typescript
import { ButtonComponent, CardComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  template: `
    <lc-card>
      <lc-button variant="primary">Click me</lc-button>
    </lc-card>
  `,
})
export class MyComponent {}
```

## Components

### General

| Component | Selector | Description |
|-----------|----------|-------------|
| Accordion | `lc-accordion` | Expandable/collapsible content panels |
| Button | `lc-button` | Primary, secondary, and text buttons |
| Card | `lc-card` | Content container with elevation |
| Icon | `lc-icon` | SVG icon display |
| Logo | `lc-logo` | Life Cockpit logo |
| Menu | `lc-menu` | Dropdown menu |
| Typography | `lc-typography` | Text with preset styles |

### Form

| Component | Selector | Description |
|-----------|----------|-------------|
| Checkbox | `lc-checkbox` | Checkbox input |
| Datepicker | `lc-datepicker` | Date selection |
| Email Input | `lc-email-input` | Email-specific input |
| Input | `lc-input` | Text input field |
| Password Input | `lc-password-input` | Password input with toggle |
| Radio | `lc-radio` | Radio button group |
| Select | `lc-select` | Dropdown select |
| Switch | `lc-switch` | Toggle switch |
| Textarea | `lc-textarea` | Multi-line text input |
| Verification Code | `lc-verification-code-input` | OTP/code input |

### Layout

| Component | Selector | Description |
|-----------|----------|-------------|
| Container | `lc-container` | Page container with max-width |
| Drawer | `lc-drawer` | Slide-in side panel |
| Section | `lc-section` | Content section |
| Spacer | `lc-spacer` | Spacing utility |
| Stack | `lc-stack` | Flex layout utility |

### Navigation

| Component | Selector | Description |
|-----------|----------|-------------|
| Breadcrumbs | `lc-breadcrumbs` | Breadcrumb navigation |
| Header | `lc-header` | Page header |
| Pagination | `lc-pagination` | Page navigation |
| Sidenav | `lc-sidenav` | Side navigation |
| Tabs | `lc-tabs` | Tab navigation |

### Data Display

| Component | Selector | Description |
|-----------|----------|-------------|
| Avatar | `lc-avatar` | User avatar |
| Badge | `lc-badge` | Status badge |
| Chip | `lc-chip` | Tag/label chip |
| Empty State | `lc-empty-state` | Placeholder for empty content |
| Field Group | `lc-field-group` | Grouped form fields |
| Filter Bar | `lc-filter-bar` | Filter controls |
| List | `lc-list` | List display |
| Metric Card | `lc-metric-card` | KPI/metric display |
| Skeleton | `lc-skeleton` | Loading placeholder |
| Spinner | `lc-spinner` | Loading indicator |
| Stepper | `lc-stepper` | Step-by-step progress |
| Table | `lc-table` | Data table |
| Toggle Group | `lc-toggle-group` | Segmented toggle |

### Feedback

| Component | Selector | Description |
|-----------|----------|-------------|
| Alert | `lc-alert` | Inline alert message |
| Error Display | `lc-error-display` | Error state display |
| Modal | `lc-modal` | Dialog/modal window |
| Toast | `lc-toast` | Notification toast |
| Tooltip | `lcTooltip` | Tooltip directive |

## Theming

The library supports light and dark themes. Use the `ThemeService` to switch themes:

```typescript
import { ThemeService } from '@life-cockpit/angular-ui-kit';

@Component({ ... })
export class AppComponent {
  private themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

## Design Tokens

Design tokens for colors, spacing, typography, elevation, and more are available as TypeScript constants:

```typescript
import { ColorTokens, SpacingTokens } from '@life-cockpit/angular-ui-kit';
```

## Development

```bash
# Run unit tests
nx test angular-ui-kit

# Build the library
nx build angular-ui-kit

# Run Storybook
nx storybook angular-ui-kit
```

## License

MIT
