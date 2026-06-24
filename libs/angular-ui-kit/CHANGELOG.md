# Changelog

All notable changes to this project will be documented in this file.

## [2.0.2] - 2026-06-24

### Fixed

- **Fluid chart width** — All chart components now fill their container width
  automatically via `ResizeObserver`. Previously, charts rendered at a fixed
  pixel width (default 400 px) regardless of the card or layout slot they were
  placed in, because the SVG coordinate system was driven by a static `width`
  input. Charts now observe their host element and recompute all internal
  coordinates (plot area, grid lines, bars, dots, axes) whenever the container
  resizes. The `width` input is retained as an initial fallback value used
  before the first observation fires.

  Affected components: `lc-area-chart`, `lc-bar-chart`, `lc-line-chart`,
  `lc-stacked-bar-chart`, `lc-waterfall-chart`, `lc-funnel-chart`,
  `lc-sparkline`.

- **Chart host display** — All chart host elements (`lc-*-chart`, `lc-sparkline`)
  now declare `display: block` so they participate in normal block layout and
  can receive an explicit width from their parent. Previously the `inline-flex`
  / `inline-block` default caused the host to shrink-wrap its SVG content
  instead of stretching to fill the available space.

  Affected components: all of the above plus `lc-pie-chart`, `lc-donut-chart`,
  `lc-radar-chart`, `lc-gantt-chart`.

## [2.0.1] - 2026-06-24

### Added

- **StageList component (`lc-stage-list`)** — New data-display component for
  pipeline/status distributions with one row per stage (dot, label, optional
  value, optional proportional bar). Supports `stages`, shared normalization
  via optional `max`, `showValue`, `showBar`, compact `size` (`sm`/`md`),
  `clickable` rows with `stageClick`, and `emptyText` for empty datasets.
- **Exported public types** — `StageItem` and `StageListSize` are part of the
  package API and exported via the main barrel.
- **Storybook coverage** — Added dedicated stories for Default, AllZero,
  SingleStage, Clickable, NoBar, Small, LongLabels and SharedMax.

### Changed

- **Accessibility and interaction defaults** — Stage rows render with list
  semantics (`role="list"` / `role="listitem"`); clickable mode uses keyboard
  accessible buttons and emits the full `StageItem` payload.

### Fixed

- **Width normalization edge cases** — Fill width calculation now guards against
  invalid/zero max values, clamps percentages to `0..100`, and guarantees a
  minimum visible fill (`2px`) for non-zero values.
- **Color fallback behavior** — Missing stage color now consistently falls back
  to `--lc-color-primary-500` (with `--color-primary-500` fallback).

### Tests

- Added unit tests for width math (`max` resolution + guard), zero/empty data,
  click emission, and color fallback.

## [2.0.0] - 2026-06-24

**Design System 2.0 — a dark-first visual redesign of the entire component library.**

The look is rebuilt around a distinctive, teal-tinted dark aesthetic (gradient
surfaces, a teal accent line on cards, layered glow shadows, semantic status
colors, pill controls). All ~90 components were migrated onto a single semantic
token layer so a component recipe renders correctly in both themes. The brand
color palette is unchanged.

### Added

- **Dark-first token & theme foundation** — teal-tinted dark surfaces
  (`--color-surface`, `--color-surface-2`, `--color-surface-sunken`), gradient
  surface (`--gradient-surface`), translucent borders (`--color-border`,
  `--color-border-strong`), brighter dark text (`--color-text-primary/secondary/
  tertiary`), and visual primitives: `--accent-line`, `--gradient-text`,
  `--gradient-brand-tile`, `--shadow-brand-glow`, `--shadow-glow`,
  `--app-background-image` (radial teal/violet glows for the app shell).
- **Solid brand-fill tokens** — `--color-primary-fill`, `--color-secondary-fill`,
  `--color-error-fill` (+ `-hover`/`-active`) and `--color-on-primary`/
  `-on-secondary`/`-on-error` ink, so primary/secondary/danger buttons stay
  high-contrast in both themes.
- **Semantic color scale aliases** — `--color-{success,error,warning,info}-{50,
  100,500,600,700}` now resolve onto the canonical semantic shades.
- **Shared SCSS mixins** (`src/styles/_mixins.scss`) — `focus-ring`, `elevation`,
  `card-surface`, `gradient-text`, `glow`, `pill`, `kicker`, `brand-tile`.
- **Reproducible token build** — pinned `style-dictionary@4.4.0` + the
  `build:tokens` nx target (the lib `build` depends on it).
- **Working theme service** — dark default with a real `setTheme`/`toggleTheme`/
  `useSystemPreference` toggling the `.dark`/`.light` class on `:root`.

### Changed

- **Dark is the default theme.** `:root.dark, :root:not(.light)` makes dark the
  default look; `.light` is the explicit opt-in.
- **Theme switching standardized on the `.dark` class.** ~52 components gated
  dark styling on `[data-theme='dark']` (and `:host-context([data-theme])`),
  which the service never set — that dark CSS was dead code. All reconciled to
  the real `.dark` class; redundant/inverted dark blocks removed.
- **Border-radius scale enlarged** (`sm` 10px, `md` 12px, `lg` 18px, `xl` 24px,
  `2xl` 32px) and **elevation deepened** to layered, pitch-grade shadows.
- **Components migrated to semantic tokens** across all buckets — surfaces,
  pills/badges/chips/status, buttons & interactive controls, form inputs,
  feedback, overlays, charts, typography/brand. `sidenav` and `header` are now
  dark-first with `--light` opt-in modifiers; `chat` adopts a Claude-style
  layout (assistant messages render full-width without a bubble).
- **Icons resolve from the Tabler icon set.** Components reference Heroicon
  names; the served set is Tabler. The `iconAliasMap` now translates Heroicon →
  Tabler names so icons load over HTTP (previously many resolved to the `X`
  fallback).

### Fixed

- Many **non-existent token references** that silently rendered nothing or wrong
  values: `--color-text` → `--color-text-primary`, `--elevation-xl/lg/md/sm` →
  `--elevation-4/3/2/1`, `--radius-*` → `--border-radius-*`, `--color-white` →
  `--color-neutral-white`/surface, `--color-danger-*` → `--color-error*`,
  `--color-neutral-950/0`, `--color-warning-400`, `--shadow-lg`.
- **Frozen light surfaces** that stayed white in dark mode (compile-time
  `colors.$color-neutral-*` and hardcoded `#fff`/pastels) in code-block,
  document-viewer, file-upload, search-input, toolbar, log-viewer, timeline,
  table, kanban, gantt.
- **Input consistency** — search-input and other fields now match the canonical
  input field (raised surface, hairline border, teal focus).
- date-range-picker uses a real `lc-icon` instead of a hardcoded emoji.

### Migration

This is a major release. Consumer apps (Cockpit, …) should:

- **Choose a theme explicitly.** Apps that set no theme now render dark. To keep
  the old light look, add the `light` class to `<html>` or call
  `themeService.setTheme('light')` (now functional).
- **Replace any manual `data-theme="dark"` toggling with the `.dark` class** (or
  use the theme service). This is the most likely silent breakage.
- **Set `--app-background-image`** on the app shell (`<body>`/root) for the
  radial-glow background.
- Expect **enlarged radii / deeper shadows / changed semantic surface, text and
  border values**; a few components changed their default variant look.
- Ensure global styles `@use` the kit's `src/styles/index.scss`.

## [1.11.11] - 2026-06-23

### Added

- **Table row actions column (`lc-table`)** — New `actions` input renders a trailing actions column with per-row buttons (e.g. Freigeben / Ablehnen). Each `TableAction` supports `key`, `label`, `icon`, `variant`, `tooltip`, and per-row `hidden`/`disabled` predicates. Omit `label` for compact icon-only buttons. Configure the column via `actionsLabel`, `actionsWidth`, and `actionsAlign` (`start` | `center` | `end`) — the header label follows the same alignment as the buttons. Clicks emit `actionClick` (`{ action, row, rowIndex }`) with the paginate-safe absolute row index, and stop propagation so they never trigger the row's `rowClick`.

## [1.11.10] - 2026-06-23

### Added

- **TreeView component (`lc-tree-view`)** — New component for visualizing file/folder hierarchies, designed to render a complete GitHub project. Renders a recursive `TreeNode[]` structure with expand/collapse folders, expand-all/collapse-all, two-way bound `selectedId`, a `nodeClick` output, indentation guide lines, and optional git-style status badges (added/modified/removed).
- **Automatic file-type icons** — Files resolve a Tabler icon by well-known file name (`package.json`, `Dockerfile`, `README.md`, …) and by extension (`.ts`, `.json`, `.scss`, `.py`, `.md`, `.png`, `.svg`, `.zip`, …), with open/closed folder icons. Per-node `icon` overrides are supported. Resolution is exposed via the standalone `resolveFileIcon` helper.

## [1.11.9] - 2026-06-19

### Changed

- **FilterBar uses LC Select component** — Replaced native `<select>` usage in `lc-filter-bar` with `<lc-select>` so filter controls consistently use design-system components and styling.
- **FilterBar search uses LC SearchInput** — Replaced the native search `<input>` in `lc-filter-bar` with `<lc-search-input>` for consistent behavior and styling.
- **NotificationCenter search uses LC SearchInput** — Replaced the native search `<input>` in `lc-notification-center` with `<lc-search-input>`.
- **Table page size uses LC Select** — Replaced native pagination page-size `<select>` in `lc-table` with `<lc-select>`.
- **Table column filters use LC Input** — Replaced native text filter `<input>` fields in `lc-table` with `<lc-input>`.

### Fixed

- **Search icon fallback regression** — Added a compatibility icon alias mapping `magnifying-glass` to Tabler `search` so existing usages render the correct search icon instead of the fallback `X` icon.

## [1.11.8] - 2026-06-18

### Added

- **Table cell styling API** — `TableColumn` now supports `cellClass` and `cellStyle` (static or callback-based) for per-cell conditional styling.

### Docs

- **Table stories restored and expanded** — Revalidated `WithCellFormatting`, `WithBadgesAndAvatars`, `EnterpriseUsers` and added `WithCellFormattingAndStyling` to document formatter + styling usage in Storybook.
- **README update** — Table feature summary now explicitly includes cell styling hooks.

## [1.11.7] - 2026-06-18

### Fixed

- **npm publish build failure** — Moved `mermaid` back from `dependencies` to optional `peerDependencies` to satisfy ng-packagr packaging rules (`allowedNonPeerDependencies`) and unblock release publishing.

## [1.11.6] - 2026-06-18

### Fixed

- **Release consistency** — Cut a fresh patch release so npm/docs publishing can run on a new immutable version after `v1.11.5` retagging.

### Notes

- **Table formatter API remains available** — `TableColumn.formatter(value, row, column, rowIndex)` is part of the published package types.
- **Stories are docs artifacts, not npm artifacts** — Story files are published to Storybook docs, not shipped inside the npm library tarball.

## [1.11.5] - 2026-06-18

### Added

- **Table cell formatter API** — `TableColumn` now supports a `formatter(value, row, column, rowIndex)` callback for per-column display formatting when no custom template is provided.
- **Table Storybook examples** — Added `WithCellFormatting`, `WithBadgesAndAvatars`, and `EnterpriseUsers` stories to demonstrate formatter callbacks and composed cell templates (avatar, badges, chips, action buttons).

### Docs

- **Table component docs expanded** — Updated `TableComponent` API docs and Storybook feature descriptions to document formatter callbacks and composed cell patterns.
- **Library README update** — Table component description now explicitly mentions sorting, filtering, pagination, formatter callbacks and custom cell templates.

## [1.11.4] - 2026-06-08

### Changed

- **Icon source migration** — `lc-icon` now resolves SVGs from Tabler Icons (`/tabler-icons/{outline|filled}`) instead of Heroicons, with existing `variant="solid"` mapped to Tabler `filled` assets.
- **Asset wiring updated** — Demo build and Storybook static asset mounts now serve Tabler icon files from `@tabler/icons/icons`.
- **Docs aligned** — Component/story/demo descriptions were updated from Heroicons wording to Tabler Icons terminology.

### Fixed

- **Storybook icon browser coverage** — `All Icons` in Icon stories now reads the installed Tabler catalog dynamically (instead of a hardcoded 324-item preset), so the displayed icon count stays accurate after package updates.

## [1.11.3] - 2026-05-27

### Fixed

- **Mermaid peer dependency** — Declared `mermaid` (`^11.0.0`) as an optional peer dependency so consumers get a proper install hint when using Mermaid blocks in `lc-markdown`. The dynamic `import('mermaid')` already falls back gracefully when the runtime is missing.

## [1.11.2] - 2026-05-27

### Added

- **Markdown Mermaid support** — Fenced code blocks with language `mermaid` are now rendered as diagrams in `lc-markdown`.
- **Storybook example** — Added a small `MermaidSupport` story to validate Mermaid rendering with a minimal flowchart.

### Fixed

- **Code block readability** — Prevented inline markdown `code` styles from overriding `lc-code-block` text color in dark code panels.
- **Mermaid SVG rendering** — Preserved Mermaid-generated SVG styling so shapes/edges render correctly (not labels-only).
- **Typing regression** — Corrected markdown parse fallback typing for code/mermaid blocks (`kind` field), fixing TypeScript build errors.

## [1.11.1] - 2026-05-26

### Changed

- **Sidenav brand row polish** — The new collapse chevron in the logo area is now visually quieter and better balanced (smaller ghost-style control, refined spacing).
- **Brand logo hit area refinement** — In expanded mode the logo click area now wraps the logo content instead of stretching across most of the row, which removes the awkward "large empty clickable area" effect.
- **Collapsed rail logo sizing/alignment** — In collapsed mode the brand emblem now uses compact `sm` size and the logo row removes horizontal padding, so the emblem is centered correctly inside the 56px rail.

### Docs

- **Stories + component docs synchronized** — Updated Sidenav Storybook descriptions and `SidenavComponent` JSDoc example to reflect current behavior (dedicated chevron collapse control in brand row, current signal-based input names).

## [1.11.0] - 2026-05-26

### Added

- **Chat file upload** — `<lc-chat>` gains optional file attachments via paperclip button: new inputs `allowFileUpload`, `accept`, `multiple`, `maxFileSize`, new output `fileAttach`, new types `ChatAttachment` / `ChatFileAttachEvent`. Pending attachments render as chips above the input row; image attachments show thumbnail previews inside the message bubble. New story *With File Upload* + updated JSDoc with two `@example` blocks.
- **Custom brand support in `<lc-logo>`** — New inputs `src`, `emblemSrc`, `darkSrc`, `darkEmblemSrc` so consuming apps can drop in their own brand assets without forking. Theme-aware dark variants are wired up via `<picture>`. Auto-invert CSS filter is now applied **only** to the built-in Life-Cockpit assets so custom logos never get color-shifted.
- **`LC_LOGO_BASE_PATH` injection token** — Overrides the default `/assets` prefix used to resolve the built-in Life-Cockpit logo files (e.g. for apps serving static files from `/static` or `/ui-kit`).
- **Logo sizes `xs` and `xl`** — `<lc-logo size>` now accepts the full `xs | sm | md | lg | xl` scale (was `sm | md | lg`).
- **Header `logoSize` input** — Forwarded to inner `<lc-logo>` (`xs | sm | md | lg | xl`). New story *Logo Sizes* renders all five variants.
- **Header `size` input** — Explicit header height (`sm` 56px · `md` 64px default · `lg` 80px · `xl` 112px). Useful to align the header with a sidenav brand block in sidebar-first layouts. Class-based (`lc-header--size-*`), independent of any inner logo.
- **Sidenav `logoSize` input** — Controls the brand-block height in sidebar-first layouts (`xs | sm | md | lg | xl`, **default `md` = 64px** so the brand block lines up with `<lc-header size="md">` out of the box). New story *Sidebar-First Layout (Prominent Brand)* showcases the `lg` (80px) variant.

### Changed

- **Header height now honored exactly** — Removed vertical padding on `.lc-header`; content (profile trigger, context info, hamburger) is centered via flexbox so `min-height` actually drives the height instead of being inflated by the avatar/button. Net effect: default header is now exactly 64px tall.
- **Sidenav brand-block alignment** — `.lc-sidenav__logo` height scale realigned with `<lc-header size="*">` (sm 56 / md 64 / lg 80 / xl 112). Switched from view-encapsulation-fragile `:has(.lc-logo.size-*)` selectors to explicit `lc-sidenav__logo--size-*` host classes so the heights work reliably regardless of where the `.lc-logo` element lives.
- **Sidenav collapsed logo padding** — In collapsed (icon-rail) mode the logo container now uses horizontal-only padding so its `min-height` reflects the configured size instead of being pushed taller by extra vertical padding.
- **Sample app layout** — Restructured to sidebar-first: full-height `lc-sidenav` with brand block on top (dark theme), `lc-header` to the right with `[showLogo]="false"`.
- **Removed obsolete asset** — `life-cockpit-logo_old.svg` deleted from `libs/angular-ui-kit/src/assets/`.

### Fixed

- **Sidenav / Header height mismatch in sidebar-first layouts** — The brand block on the sidenav and the header next to it are now pixel-aligned at the same height for every matching pair (`logoSize="md"` ↔ `size="md"`, `logoSize="lg"` ↔ `size="lg"`, …).

## [1.10.1] - 2026-05-20

### Changed

- **`@life-cockpit/angular-ui-kit` npm README** — Replaced minimal placeholder with the full library overview (links to public docs, MCP server snippet, density token usage, theming and density notes).

## [1.10.0] - 2026-05-20

### Added

- **Density token system** — New CSS custom property scale (`--lc-density-gap-{xs,sm,md,lg,xl}`, `--lc-density-padding-{xs,sm,md,lg,xl}`, `--lc-density-section-gap`) wired to a single `data-density="compact|cosy|comfortable"` attribute. Setting it on any ancestor rescales every density-aware component beneath it without template changes. Cosy is the default and matches the previous visual rhythm exactly (zero pixel shift on upgrade).
- **PageHeaderComponent** — Page-level title block with slots for trailing actions and a short header-internal description. Distinct from `lc-header` (app chrome) and `lc-toolbar` (control bar).
- **ToolbarComponent** — Reusable horizontal control bar with `start` / default / `end` slots; auto-collapses empty slots; `density`, `background`, `border`, `align`, `wrap` and `sticky` inputs.
- **Density showcase stories** — Four new entries under **Design Tokens / Density**: side-by-side cascade, full-width stacked comparison, live token-value inspector, and local-override demonstration.
- **Density Tokens section in spacing docs** — Three tables (gap, padding, section-gap) × three density modes with semantic mapping and four rules of thumb.

### Changed

- **24 components made density-aware** — Layout rhythm (gap, padding) of `card`, `container`, `section`, `stack`, `page-header`, `toolbar`, `spacer`, `list`, `menu`, `breadcrumbs`, `tabs`, `alert`, `toast`, `pagination`, `input`, `textarea`, `datepicker`, `select`, `modal`, `header`, `table`, `rich-text-editor`, `sidenav`, and `footer` now reads from `--lc-density-*` with safe fallbacks to the original `--spacing-*` tokens. Cosy defaults preserve current visuals.
- **`libs/angular-ui-kit/src/styles/index.scss`** — Now imports `@angular/cdk/overlay-prebuilt.css` so the `.cdk-overlay-transparent-backdrop { opacity: 0 }` reset is present in every consuming app/Storybook.

### Fixed

- **Select / Datepicker backdrop flash** — `ModalComponent` is rendered with `ViewEncapsulation.None`; its SCSS rule that targeted `.cdk-overlay-backdrop` was leaking globally to every CDK overlay and showing a brief grey flash on Select, Datepicker, Menu and Tooltip dismissal. Removed the leak and scoped the modal backdrop to its own `.lc-modal-backdrop` class, while ensuring the official CDK overlay reset is loaded globally.
- **`lc-select` dead style removed** — `.lc-select__option--focused` rule was unused (template emits `--highlighted`).
- **`lc-page-header` JSDoc + story imports** — Description corrected to match supported slot content; unused `BadgeComponent` import removed from stories.

## [1.9.0] - 2026-05-15

### Added

- **AccordionGroupComponent** — Wrapper component that coordinates multiple `<lc-accordion>` children; supports single-expand (default) and multi-expand modes via `[multi]` input; includes `collapseAll()` / `expandAll()` programmatic API

### Changed

- **Accordion styling refresh** — Smoother 300ms cubic-bezier transitions for expand/collapse; CSS grid-based height animation (content always in DOM); chevron rotates instead of swapping icons; staggered opacity/translateY fade-in for body content; subtle box-shadow on outlined variant with elevated hover state; refined spacing and border-radius

### Fixed

- **Sidenav stories** — Replaced invalid `themeValue` arg with correct `theme` input name
- **Sample app bindings** — Updated breadcrumbs, pagination, and sidenav examples to use new signal input names (removed `*Input` suffix)

## [1.8.0] - 2026-05-14

### Changed

- **Signal API migration** — Header, Tabs, Menu, Logo, Breadcrumbs, Pagination, Sidenav, and Table-cell directive migrated from `@Input()`/`@Output()` to `input()`/`output()`/`model()`/`computed()`; Sidenav input names simplified (removed `*Input` suffix)
- **CommonModule removed** — 25 components no longer import `CommonModule`; 8 components replaced with standalone `NgClass`, `NgTemplateOutlet`, or `NgStyle` imports
- **Track expressions simplified** — Chat (`track msg.id`), Kanban Board (`track col.id`/`track card.id`); removed unused `trackBy` helper methods
- **Pagination duplicate key fix** — Changed `track page` to `track $index` to avoid NG0955 warning with ellipsis entries

## [1.7.0] - 2026-05-13

### Changed

- **Button migrated to signal APIs** — All `@Input()` decorators replaced with `input()`, `@Output() EventEmitter` replaced with `output()`, `isDisabled` getter replaced with `computed()`; removed duplicate `isLoading` input
- **Markdown `RenderPart.lang` typed** — Changed from `string` to `CodeBlockLanguage`, removing `$any()` cast in template

### Fixed

- **`track $index` → proper identity tracking** — Gallery (`track item.src`), Tag Input (`track tag`), Stepper (`track step.label`), Pagination (`track page`), Date Range Picker (`track day.date.getTime()`); improves re-render performance on list changes
- **`$any()` casts removed** — 6 templates (Table, Datepicker, Textarea, Filter Bar, Log Viewer, Markdown) now use typed `getInputValue()` helper instead of bypassing strict type checks

## [1.6.3] - 2026-05-13

### Fixed

- **Sidenav logo area height** — Fixed `height: 64px` to match the header; logo uses `sm` size (32px) so it fits without overflow; horizontal-only padding for clean alignment

## [1.6.2] - 2026-05-13

### Fixed

- **Sidenav parent active style** — Parent accordion items with an active child no longer receive the full active highlight (teal background); they now only show bold text, keeping the full active style exclusively on the directly active child item

## [1.6.1] - 2026-05-13

### Fixed

- **Sidenav dark theme contrast** — Lightened dark background (`#1e1e22`), hover (`#2a2a2f`), and added teal accent for active items (`--lc-sidenav-active-bg/fg/icon`) for better readability
- **Sidenav active item hover** — Active items no longer change color on hover (both light and dark themes)
- **Sidenav icon alignment** — Section action button (plus) and accordion action button (ellipsis) are now vertically aligned; section title line-height matches button height
- **Sidenav logo sizing** — Logo uses `md` size (48px) when expanded instead of `sm` (32px); logo area uses flexible min-height

### Changed

- **Sidenav documentation** — Comprehensive Storybook docs with full inputs/outputs table, `NavigationItem` interface shape, and theming token reference

## [1.6.0] - 2026-05-12

### Added

- **Sidenav responsive mobile mode** — Docked sidenav automatically switches to drawer mode below a configurable breakpoint (`mobileBreakpointInput`, default 768px); viewport changes detected via `matchMedia` listener; auto-closes drawer after item navigation on mobile
- **Sidenav `showLogo` with collapse toggle** — Optional logo area at the top of the sidenav (`showLogoInput`); displays full logo when expanded, emblem when collapsed; clicking the logo toggles collapsed state
- **Sidenav accordion expands collapsed sidebar** — Clicking a collapsible parent item in icon-rail mode automatically expands the sidebar and opens the group
- **Header `showLogo` input** — Allows hiding the logo in sidebar-first layouts where the logo lives in the sidenav
- **Header `showHamburger` + `hamburgerClick`** — Hamburger menu button for toggling the mobile drawer sidenav
- **Responsive story** — New "Responsive (Mobile View)" Storybook story demonstrating the mobile drawer behavior with hamburger toggle

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

- Duplicate `getPopoverIcon()` method in sample sidebar
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
