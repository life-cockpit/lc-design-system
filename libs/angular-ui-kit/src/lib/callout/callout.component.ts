import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

@Component({
  selector: 'lc-callout',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {
  /** Visual variant */
  variant = input<CalloutVariant>('info');

  /** Title text (optional) */
  title = input<string>();

  /** Whether the callout can be dismissed */
  dismissible = input<boolean>(false);

  /** Emits when dismiss button is clicked */
  dismissed = output<void>();

  protected visible = signal(true);

  protected calloutClasses = computed(() => {
    return ['callout', `callout--${this.variant()}`].join(' ');
  });

  protected iconName = computed(() => {
    const map: Record<CalloutVariant, string> = {
      info: 'information-circle',
      success: 'check-circle',
      warning: 'exclamation-triangle',
      error: 'x-circle',
      neutral: 'information-circle',
    };
    return map[this.variant()];
  });

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
