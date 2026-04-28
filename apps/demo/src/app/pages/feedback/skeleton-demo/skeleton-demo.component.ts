import { Component } from '@angular/core';
import {
  SkeletonComponent,
  CardComponent,
  TableComponent,
  type TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-skeleton-demo',
  imports: [SkeletonComponent, CardComponent, TableComponent],
  templateUrl: './skeleton-demo.component.html',
  styleUrl: './skeleton-demo.component.scss',
})
export class SkeletonDemoComponent {
  protected readonly apiTable: TableColumn[] = [
    { key: 'property', label: 'Property' },
    { key: 'type', label: 'Type' },
    { key: 'default', label: 'Default' },
    { key: 'description', label: 'Description' },
  ];

  protected readonly apiData = [
    {
      property: 'variant',
      type: "'line' | 'circle' | 'rect'",
      default: "'line'",
      description: 'Shape variant — line for text, circle for avatars, rect for blocks',
    },
    {
      property: 'width',
      type: 'string',
      default: "'100%' (line/rect), '40px' (circle)",
      description: 'CSS width value',
    },
    {
      property: 'height',
      type: 'string',
      default: "'0.875rem' (line), '40px' (circle), '100px' (rect)",
      description: 'CSS height value',
    },
    {
      property: 'borderRadius',
      type: 'string',
      default: "'0.25rem' (line), '50%' (circle), '0.5rem' (rect)",
      description: 'CSS border-radius override',
    },
  ];

  protected readonly basicExample = `<lc-skeleton />`;

  protected readonly variantsExample = `<!-- Text line (default) -->
<lc-skeleton />

<!-- Circle (avatar placeholder) -->
<lc-skeleton variant="circle" />

<!-- Rectangle (content block) -->
<lc-skeleton variant="rect" />`;

  protected readonly sizesExample = `<lc-skeleton width="60%" />
<lc-skeleton width="80%" height="1.25rem" />
<lc-skeleton width="40%" />`;

  protected readonly cardExample = `<!-- Card skeleton -->
<div style="display: flex; gap: 0.75rem; align-items: center;">
  <lc-skeleton variant="circle" width="48px" height="48px" />
  <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
    <lc-skeleton width="60%" height="1.25rem" />
    <lc-skeleton width="90%" />
    <lc-skeleton width="40%" />
  </div>
</div>`;

  protected readonly tableExample = `<!-- Table skeleton -->
<div style="display: flex; flex-direction: column; gap: 0.75rem;">
  @for (i of [1,2,3,4,5]; track i) {
    <div style="display: flex; gap: 1rem;">
      <lc-skeleton width="auto" height="1rem" style="flex: 2" />
      <lc-skeleton width="auto" height="1rem" style="flex: 1" />
      <lc-skeleton width="auto" height="1rem" style="flex: 1" />
    </div>
  }
</div>`;

  protected readonly chartExample = `<!-- Chart area skeleton -->
<lc-skeleton variant="rect" width="100%" height="300px" borderRadius="0.5rem" />`;
}
