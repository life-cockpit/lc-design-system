import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect, userEvent, within } from 'storybook/test';
import { HeaderComponent } from './header.component';

/**
 * The application header provides top-level navigation, branding, user info,
 * and quick actions. Typically placed at the very top of the page layout.
 * Supports hamburger menu, theme toggle, and user profile dropdown.
 */
const meta: Meta<HeaderComponent> = {
  title: 'Navigation/Header',
  component: HeaderComponent,
  args: {
    hamburgerClick: fn(),
    themeToggleClick: fn(),
    logoutClick: fn(),
    profileClick: fn(),
  },
  argTypes: {
    hamburgerClick: { action: 'hamburgerClick', description: 'Emitted when the hamburger menu is clicked' },
    themeToggleClick: { action: 'themeToggleClick', description: 'Emitted when the theme toggle is clicked' },
    logoutClick: { action: 'logoutClick', description: 'Emitted when logout is clicked' },
    profileClick: { action: 'profileClick', description: 'Emitted when the profile item is clicked' },
    title: { description: 'Application or page title' },
    subtitle: { description: 'Secondary text below the title' },
    logo: { description: 'URL to a logo image' },
    userName: { description: 'Displayed user name (for the profile area)' },
    userEmail: { description: 'User email shown in the profile dropdown' },
    showHamburger: { description: 'Shows a hamburger menu button (for mobile/sidebar toggle)' },
    showThemeButton: { description: 'Shows a dark/light theme toggle button' },
    showProfileMenuItem: { description: 'Whether to show a "Profile" item in the user menu' },
  },
};

export default meta;
type Story = StoryObj<HeaderComponent>;

export const Default: Story = {
  args: { title: 'Life-Cockpit', subtitle: 'Design System', userName: 'Sarah Connor', userEmail: 'sarah@example.com' },
};

export const WithHamburger: Story = {
  name: 'With Hamburger Menu',
  args: { title: 'Life-Cockpit', subtitle: 'Dashboard', userName: 'Sarah Connor', userEmail: 'sarah@example.com', showHamburger: true },
};

export const WithThemeToggle: Story = {
  name: 'With Theme Toggle',
  args: { title: 'Life-Cockpit', userName: 'Sarah Connor', userEmail: 'sarah@example.com', showThemeButton: true },
};

export const FullFeatured: Story = {
  name: 'All Options Enabled',
  args: { title: 'Life-Cockpit', subtitle: 'Project Dashboard', userName: 'Sarah Connor', userEmail: 'sarah@example.com', showHamburger: true, showThemeButton: true, showProfileMenuItem: true },
};

export const Minimal: Story = {
  name: 'Minimal (Title Only)',
  args: { title: 'My App' },
};

export const WithLongTitle: Story = {
  name: 'Long Title & Subtitle',
  args: { title: 'Enterprise Resource Management Platform', subtitle: 'Human Resources Department', userName: 'Administrator', userEmail: 'admin@company.com' },
};
