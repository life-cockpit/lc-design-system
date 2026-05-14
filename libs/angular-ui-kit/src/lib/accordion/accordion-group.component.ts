import {
  Component,
  ChangeDetectionStrategy,
  input,
  contentChildren,
  effect,
  untracked,
} from '@angular/core';
import { AccordionComponent } from './accordion.component';

@Component({
  selector: 'lc-accordion-group',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrl: './accordion-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionGroupComponent {
  /** When false (default), only one accordion can be expanded at a time. */
  readonly multi = input<boolean>(false);

  readonly accordions = contentChildren(AccordionComponent);

  private previousExpanded = new Set<AccordionComponent>();

  constructor() {
    effect(() => {
      const accordions = this.accordions();
      const multi = this.multi();

      // Read expanded state of every child so the effect re-runs on change
      const currentlyExpanded = accordions.filter((a) => a.expanded());

      if (multi) {
        this.previousExpanded = new Set(currentlyExpanded);
        return;
      }

      // Find newly expanded accordion
      const newlyExpanded = currentlyExpanded.find(
        (a) => !this.previousExpanded.has(a)
      );

      if (newlyExpanded && currentlyExpanded.length > 1) {
        untracked(() => {
          accordions.forEach((a) => {
            if (a !== newlyExpanded && a.expanded()) {
              a.expanded.set(false);
            }
          });
        });
      }

      this.previousExpanded = new Set(
        accordions.filter((a) => a.expanded())
      );
    });
  }

  /** Collapse all accordions. */
  collapseAll(): void {
    this.accordions().forEach((a) => a.expanded.set(false));
  }

  /** Expand all accordions (only meaningful when multi=true). */
  expandAll(): void {
    this.accordions().forEach((a) => {
      if (!a.disabled()) {
        a.expanded.set(true);
      }
    });
  }
}
