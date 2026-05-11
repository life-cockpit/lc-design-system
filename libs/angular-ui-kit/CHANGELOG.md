# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2026-05-11

### Added

- **Sidenav `action`** — Optional action button on navigation items and section headers (visible on hover), emits `itemAction` event; supports sections, collapsible parents, and simple items
- **Sidenav `badge`** — Optional badge on navigation items for displaying counts or labels with color variants; positioned as overlay in collapsed icon-rail mode
- **Sidenav nested section children** — Section children can now be collapsible parents with their own children and actions (3-level nesting)
- **Sidenav collapsed tooltips** — Fixed tooltips for all item types in collapsed icon-rail mode

## [1.4.0] - 2026-05-11

### Added

- **Header `contextName` / `contextLabel`** — New clickable context area in the header (right side, next to profile menu) for displaying tenant, organization, project, or other contextual info; emits `contextClick` event for opening modals or navigation; long names are truncated with tooltip; hidden on mobile

## [1.3.1] - 2026-05-08

### Added

- **Chat `#messageTemplate`** — Custom content projection for chat messages via `@ContentChild('messageTemplate')`, enabling rich content like `<lc-diff-viewer>` or `<lc-markdown>` inside agent bubbles; new `data` field on `ChatMessage` for arbitrary metadata

### Fixed

- Markdown list bullets missing due to global CSS reset — restored `list-style: disc` / `decimal` inside `.lc-markdown`
- Markdown and Log-viewer `[innerHTML]` content unstyled — added `ViewEncapsulation.None` so dynamic HTML receives component styles
- Combobox story category mismatch (`Forms` → `Form`)
- Markdown story category mismatch (`Content` → `Components`)

## [1.3.0] - 2026-05-08

### Added

- **`<lc-markdown>`** — GFM markdown renderer with built-in parser (no external dependencies), fenced code block delegation to `<lc-code-block>`, heading anchors, link target control, compact variant, and `src` input for remote loading
- **`<lc-log-viewer>`** — Streaming log / terminal viewer with virtualized rendering, ANSI color parsing, level filtering, search with highlighting, auto-scroll, pause/resume, ring buffer, and `stream$` Observable input; supports `log` and `terminal` (Catppuccin) variants
- **`<lc-confirm-dialog>` + `ConfirmService`** — Standardized confirmation dialogs wrapping `<lc-modal>` with `default`/`destructive`/`warning` variants, auto-icon per variant, optional `requireText` matching, and an imperative `ConfirmService` with `confirm()`/`destructive()`/`warning()` returning `Promise<boolean>`
- **`<lc-combobox>`** — Async autocomplete with `ControlValueAccessor`, sync options + async `loadOptions` via rxjs debounce/switchMap, single/multiple selection, `allowCreate`, grouped options, keyboard navigation, and size variants

## [1.2.2] - 2026-05-08

### Fixed

- Ghost button variant ignores parent theme tokens — `.btn-ghost` now reads from `--lc-button-ghost-fg`, `--lc-button-ghost-hover-bg`, `--lc-button-ghost-hover-fg`, `--lc-button-ghost-active-bg` CSS custom properties (with neutral fallbacks), allowing any parent to retheme it
- Dark header hamburger invisible — header dark variant now maps `--lc-header-*` tokens onto `--lc-button-ghost-*` tokens for all child `lc-button` elements (hamburger, theme toggle, profile trigger), fixing both idle color and hover background

## [1.2.1] - 2026-05-08

### Fixed

- Dark header dropdown text invisible — menu header/user-name/email used `--lc-header-fg` tokens which resolve to white in dark mode, but the dropdown panel has a white background; switched to global theme tokens (`--color-text`, `--color-text-secondary`, `--color-divider`)
- Sidenav nav-item icons appear very pale — light-mode tokens referenced `var(--color-neutral-700)` which gets remapped in global dark mode; hardcoded light fallback values to prevent cross-theme bleed

## [1.2.0] - 2026-05-08

### Added

- **Component Theming API** — Header, Sidenav, and Logo now support a `theme` input (`auto`/`light`/`dark`) with internal CSS custom property tokens for fully independent theming
- **Card (Extended)** — Badge pill with 5 color variants (`info`/`success`/`warning`/`error`/`neutral`), `[card-header-action]` projection slot, header divider, larger title
- **Header `menuSize`** — New `menuSize` input (`sm`/`md`/`lg`) passed through to internal profile dropdown menu
- **MCP Server `search_component` Tool** — Custom tool for single-call component lookup by fuzzy name match, eliminating the 3-call pattern for LLM consumers
- **Component Theming Documentation** — New Section 6 in Getting Started docs with usage examples and token reference tables

### Fixed

- Dark header logo rendering (switched from `brightness(0) invert(1)` to `invert(1) hue-rotate(180deg)` to preserve detail)
- Dark header toggle icon visibility (explicit color inheritance for `lc-icon`/`svg` in dark scope)
- Dark header profile trigger border contrast
- Modal flickering in Storybook (template now uses internal `_open` signal; stories use trigger button pattern)
- Modal docs page rendering (stories use `inline: false` to prevent `position: fixed` clipping in docs canvas)
- Modal header/footer padding reduced for a more compact, polished appearance
- Modal header titles (`h1`–`h6`) now have scoped font-size/weight styling

## [1.1.1] - 2026-05-07

### Added

- **List (Extended)** — Rich item structure with avatar (image/initials), subtitle, description, trailing badges (5 color variants), metadata text, selected state, and three sizes (sm/md/lg)
- **Menu Size Variants** — New `size` input (sm/md/lg) for compact, default, and spacious menu layouts
- **Hero Variants** — Slim (compact) and light (pastel gradients) hero section variants
- **Sidenav Collapsed Mode** — Icon-rail collapsed state with tooltip labels

### Fixed

- Menu dropdown z-index raised to prevent rendering behind Storybook code blocks
- Menu story positions changed to `bottom-left` to prevent clipping
- Menu stories now include `min-height` to ensure dropdown visibility
- List card variant no longer forces vertical flex layout on items

## [1.1.0] - 2026-05-07

### Added

- **Rich Text Editor** — WYSIWYG/Markdown/Split mode editor with toolbar, ControlValueAccessor, word count
- **Table (Extended)** — Pagination, row selection, per-column filtering, inline cell editing
- **Scatter Plot** — Interactive scatter plot chart component
- **Funnel Chart** — Funnel visualization component
- **Tag Input** — Tag/chip input with autocomplete and validation
- **Date Range Picker** — Dual calendar range selection with presets
- **Diff Viewer** — Side-by-side and inline text diff comparison
- **Kanban Board** — Drag-and-drop board with columns, WIP limits, and card management
- **Notification Center** — Grouped notifications with mark-as-read, filtering, and actions

### Changed

- Reorganized Storybook sidebar: moved components to proper sections (Form, Data Display, Feedback, Navigation, Layout)
- Replaced emoji icons with `lc-icon` in Notification Center and Kanban Board
- Added comprehensive feature documentation (Key Features, argTypes, story descriptions) to all new component stories
- Added alphabetical sorting and section icons in Storybook sidebar
- Raised component style budget to 6kb/12kb (warning/error)

### Fixed

- Duplicate `getPopoverIcon()` method in demo sidebar
- Optional chaining in Kanban Board (`draggedCard()?.card?.id`)
- Chat component timestamp type (`null` → `undefined`)

## [1.0.1] - 2026-04-30

### Added

- Remote MCP server via AWS Lambda Function URL at `https://design.life-cockpit.de/mcp`

## [1.0.0] - 2026-04-29

### Initial Release

First stable release of the Life Cockpit Angular UI Kit.

#### Components (45+)

- **General**: Accordion, Button, Card, Icon, Logo, Menu, Typography
- **Form**: Checkbox, Datepicker, Email Input, Input, Password Input, Radio, Select, Switch, Textarea, Verification Code Input
- **Layout**: Container, Drawer, Section, Spacer, Stack
- **Navigation**: Breadcrumbs, Header, Pagination, Sidenav, Tabs
- **Data Display**: Avatar, Badge, Chip, Empty State, Field Group, Filter Bar, List, Metric Card, Skeleton, Spinner, Stepper, Table, Toggle Group
- **Feedback**: Alert, Error Display, Modal, Toast, Tooltip

#### Features

- Light and dark theme support with `ThemeService`
- Design tokens for colors, spacing, typography, elevation, sizes, and animations
- Global styles with CSS reset, typography, and utility classes
- Full standalone component support (Angular 21+)
- Storybook documentation for all components
