import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'tokens',
    children: [
      {
        path: 'colors',
        loadComponent: () =>
          import('./pages/tokens/colors/colors.component').then((m) => m.ColorsComponent),
      },
      {
        path: 'spacing',
        loadComponent: () =>
          import('./pages/tokens/spacing/spacing.component').then((m) => m.SpacingComponent),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./pages/tokens/typography/typography.component').then(
            (m) => m.TypographyComponent,
          ),
      },
      {
        path: 'elevation',
        loadComponent: () =>
          import('./pages/tokens/elevation/elevation.component').then((m) => m.ElevationComponent),
      },
      {
        path: 'animation',
        loadComponent: () =>
          import('./pages/tokens/animation/animation.component').then((m) => m.AnimationComponent),
      },
      {
        path: 'sizes',
        loadComponent: () =>
          import('./pages/tokens/sizes/sizes.component').then((m) => m.SizesComponent),
      },
      {
        path: '',
        redirectTo: 'colors',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'components',
    children: [
      {
        path: 'accordion',
        loadComponent: () =>
          import('./pages/components/accordion/accordion.component').then(
            (m) => m.AccordionPageComponent,
          ),
      },
      {
        path: 'button',
        loadComponent: () =>
          import('./pages/components/button/button.component').then((m) => m.ButtonPageComponent),
      },
      {
        path: 'card',
        loadComponent: () =>
          import('./pages/components/card/card.component').then((m) => m.CardPageComponent),
      },
      {
        path: 'input',
        loadComponent: () =>
          import('./pages/components/input/input.component').then((m) => m.InputDemoComponent),
      },
      {
        path: 'checkbox',
        loadComponent: () =>
          import('./pages/components/checkbox/checkbox.component').then(
            (m) => m.CheckboxDemoComponent,
          ),
      },
      {
        path: 'icon',
        loadComponent: () =>
          import('./pages/components/icon/icon.component').then((m) => m.IconDemoComponent),
      },
      {
        path: 'logo',
        loadComponent: () =>
          import('./pages/components/logo/logo.component').then((m) => m.LogoDemoComponent),
      },
      {
        path: 'radio',
        loadComponent: () =>
          import('./pages/components/radio/radio.component').then((m) => m.RadioDemoComponent),
      },
      {
        path: 'typography',
        loadComponent: () =>
          import('./pages/components/typography/typography.component').then(
            (m) => m.TypographyPageComponent,
          ),
      },
      {
        path: 'stack',
        loadComponent: () =>
          import('./pages/components/stack/stack.component').then((m) => m.StackDemoComponent),
      },
      {
        path: 'container',
        loadComponent: () =>
          import('./pages/components/container/container.component').then(
            (m) => m.ContainerDemoComponent,
          ),
      },
      {
        path: 'select',
        loadComponent: () =>
          import('./pages/components/select/select.component').then((m) => m.SelectDemoComponent),
      },
      {
        path: 'textarea',
        loadComponent: () =>
          import('./pages/components/textarea/textarea.component').then(
            (m) => m.TextareaDemoComponent,
          ),
      },
      {
        path: 'switch',
        loadComponent: () =>
          import('./pages/components/switch/switch.component').then((m) => m.SwitchDemoComponent),
      },
      {
        path: 'datepicker',
        loadComponent: () =>
          import('./pages/components/datepicker/datepicker.component').then(
            (m) => m.DatepickerDemoComponent,
          ),
      },
      {
        path: 'field-group',
        loadComponent: () =>
          import('./pages/components/field-group/field-group-demo.component').then(
            (m) => m.FieldGroupDemoComponent,
          ),
      },
      {
        path: 'alert',
        loadComponent: () =>
          import('./pages/feedback/alert-demo/alert-demo.component').then(
            (m) => m.AlertDemoComponent,
          ),
      },
      {
        path: 'error-display',
        loadComponent: () =>
          import('./pages/feedback/error-display-demo/error-display-demo.component').then(
            (m) => m.ErrorDisplayDemoComponent,
          ),
      },
      {
        path: 'toast',
        loadComponent: () =>
          import('./pages/feedback/toast-demo/toast-demo.component').then(
            (m) => m.ToastDemoComponent,
          ),
      },
      {
        path: 'modal',
        loadComponent: () =>
          import('./pages/feedback/modal-demo/modal-demo.component').then(
            (m) => m.ModalDemoComponent,
          ),
      },
      {
        path: 'tooltip',
        loadComponent: () =>
          import('./pages/feedback/tooltip-demo/tooltip-demo.component').then(
            (m) => m.TooltipDemoComponent,
          ),
      },
      {
        path: 'tabs',
        loadComponent: () =>
          import('./pages/components/tabs/tabs-demo.component').then((m) => m.TabsDemoComponent),
      },
      {
        path: 'header',
        loadComponent: () =>
          import('./pages/components/header/header-demo.component').then(
            (m) => m.HeaderDemoComponent,
          ),
      },
      {
        path: 'breadcrumbs',
        loadComponent: () =>
          import('./pages/components/breadcrumbs/breadcrumbs-demo.component').then(
            (m) => m.BreadcrumbsDemoComponent,
          ),
      },
      {
        path: 'pagination',
        loadComponent: () =>
          import('./pages/components/pagination/pagination-demo.component').then(
            (m) => m.PaginationDemoComponent,
          ),
      },
      {
        path: 'sidenav',
        loadComponent: () =>
          import('./pages/components/sidenav/sidenav-demo.component').then(
            (m) => m.SidenavDemoComponent,
          ),
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./pages/components/badge/badge.component').then((m) => m.BadgeDemoComponent),
      },
      {
        path: 'avatar',
        loadComponent: () =>
          import('./pages/components/avatar/avatar.component').then((m) => m.AvatarDemoComponent),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/components/list/list.component').then((m) => m.ListDemoComponent),
      },
      {
        path: 'chip',
        loadComponent: () =>
          import('./pages/components/chip/chip.component').then((m) => m.ChipDemoComponent),
      },
      {
        path: 'table',
        loadComponent: () =>
          import('./pages/components/table/table-demo.component').then((m) => m.TableDemoComponent),
      },
      {
        path: 'password-input',
        loadComponent: () =>
          import('./pages/components/password-input/password-input-demo.component').then(
            (m) => m.PasswordInputDemoComponent,
          ),
      },
      {
        path: 'email-input',
        loadComponent: () =>
          import('./pages/components/email-input/email-input-demo.component').then(
            (m) => m.EmailInputDemoComponent,
          ),
      },
      {
        path: 'verification-code-input',
        loadComponent: () =>
          import('./pages/components/verification-code-input/verification-code-input-demo.component').then(
            (m) => m.VerificationCodeInputDemoComponent,
          ),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./pages/components/menu/menu-demo.component').then((m) => m.MenuDemoComponent),
      },
      {
        path: 'stepper',
        loadComponent: () =>
          import('./pages/components/stepper/stepper-demo.component').then(
            (m) => m.StepperDemoComponent,
          ),
      },
      {
        path: 'filter-bar',
        loadComponent: () =>
          import('./pages/components/filter-bar/filter-bar-demo.component').then(
            (m) => m.FilterBarDemoComponent,
          ),
      },
      {
        path: 'spinner',
        loadComponent: () =>
          import('./pages/components/spinner/spinner-demo.component').then(
            (m) => m.SpinnerDemoComponent,
          ),
      },
      {
        path: 'empty-state',
        loadComponent: () =>
          import('./pages/components/empty-state/empty-state-demo.component').then(
            (m) => m.EmptyStateDemoComponent,
          ),
      },
      {
        path: 'skeleton',
        loadComponent: () =>
          import('./pages/feedback/skeleton-demo/skeleton-demo.component').then(
            (m) => m.SkeletonDemoComponent,
          ),
      },
      {
        path: 'hero',
        loadComponent: () =>
          import('./pages/components/hero/hero-demo.component').then(
            (m) => m.HeroDemoComponent,
          ),
      },
      {
        path: 'progress-bar',
        loadComponent: () =>
          import('./pages/components/progress-bar/progress-bar-demo.component').then(
            (m) => m.ProgressBarDemoComponent,
          ),
      },
      {
        path: 'divider',
        loadComponent: () =>
          import('./pages/components/divider/divider-demo.component').then(
            (m) => m.DividerDemoComponent,
          ),
      },
      {
        path: 'search-input',
        loadComponent: () =>
          import('./pages/components/search-input/search-input-demo.component').then(
            (m) => m.SearchInputDemoComponent,
          ),
      },
      {
        path: 'file-upload',
        loadComponent: () =>
          import('./pages/components/file-upload/file-upload-demo.component').then(
            (m) => m.FileUploadDemoComponent,
          ),
      },
      {
        path: 'popover',
        loadComponent: () =>
          import('./pages/components/popover/popover-demo.component').then(
            (m) => m.PopoverDemoComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'button',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'patterns',
    children: [
      {
        path: 'grid',
        loadComponent: () => import('./pages/patterns/grid.component').then((m) => m.GridComponent),
      },
      {
        path: '',
        redirectTo: 'grid',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
