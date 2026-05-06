import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';
import { AvatarComponent, AvatarSize } from '../avatar/avatar.component';

export interface AvatarGroupItem {
  /** Image source URL */
  src?: string;
  /** Alt text */
  alt?: string;
  /** Full name for initials fallback */
  name?: string;
}

@Component({
  selector: 'lc-avatar-group',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './avatar-group.component.html',
  styleUrls: ['./avatar-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Avatar group component for displaying multiple user avatars.
 *
 * Features:
 * - Overlapping avatar display with configurable max visible count
 * - Overflow indicator showing remaining count
 * - Shared size variant across all avatars (xs, sm, md, lg)
 * - Automatic truncation based on max property
 *
 * @example
 * ```html
 * <lc-avatar-group [avatars]="users" [max]="5" size="md" />
 * ```
 */
export class AvatarGroupComponent {
  /** List of avatars to show */
  avatars = input.required<AvatarGroupItem[]>();

  /** Avatar size */
  size = input<AvatarSize>('md');

  /** Maximum visible avatars before showing overflow count */
  max = input<number>(5);

  protected visibleAvatars = computed(() => {
    const all = this.avatars();
    const limit = this.max();
    return all.slice(0, limit);
  });

  protected overflowCount = computed(() => {
    const all = this.avatars();
    const limit = this.max();
    return Math.max(0, all.length - limit);
  });

  protected groupClasses = computed(() => {
    return ['avatar-group', `avatar-group--${this.size()}`].join(' ');
  });
}
