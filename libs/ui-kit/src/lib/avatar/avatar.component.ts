import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

/**
 * Avatar Component
 *
 * A circular user representation component displaying images or initials.
 * Supports status indicators and multiple sizes.
 *
 * @example
 * ```html
 * <!-- With image -->
 * <lc-avatar src="https://example.com/avatar.jpg" alt="John Doe" />
 *
 * <!-- With initials -->
 * <lc-avatar name="John Doe" />
 *
 * <!-- With status indicator -->
 * <lc-avatar name="Jane Smith" status="online" size="lg" />
 * ```
 */
@Component({
  selector: 'lc-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  /** Image source URL */
  src = input<string>();

  /** Alt text for the image */
  alt = input<string>();

  /** Full name for generating initials */
  name = input<string>();

  /** Size of the avatar */
  size = input<AvatarSize>('md');

  /** Status indicator */
  status = input<AvatarStatus>();

  /**
   * Computed initials from name
   */
  initials = computed(() => {
    const fullName = this.name();
    if (!fullName || fullName.trim() === '') {
      return '?';
    }

    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter((p) => p.length > 0);

    if (parts.length === 0) {
      return '?';
    }

    if (parts.length === 1) {
      return parts[0]?.[0]?.toUpperCase() ?? '?';
    }

    // First and last name initials
    const firstInitial = parts[0]?.[0];
    const lastInitial = parts[parts.length - 1]?.[0];

    if (firstInitial && lastInitial) {
      return (firstInitial + lastInitial).toUpperCase();
    }
    return '?';
  });

  /**
   * Computed CSS classes for the avatar
   */
  avatarClasses = computed(() => {
    const classes = ['lc-avatar'];

    classes.push(`lc-avatar--${this.size()}`);

    if (this.status()) {
      classes.push('lc-avatar--with-status');
    }

    return classes.join(' ');
  });

  /**
   * Get aria-label for accessibility
   */
  ariaLabel = computed(() => {
    return this.alt() || this.name() || 'Avatar';
  });

  /**
   * Check if image should be displayed
   */
  showImage = computed(() => {
    return this.src() && !this.imageError();
  });

  /** Track if image failed to load */
  protected imageError = signal(false);

  /**
   * Handle image load error
   */
  onImageError(): void {
    this.imageError.set(true);
  }
}
