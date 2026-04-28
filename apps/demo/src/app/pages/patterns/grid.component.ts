import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectComponent, CheckboxComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent, CheckboxComponent],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  // Grid configuration
  columns = 3;
  gap = 4;
  responsive = true;

  // Column options for interactive demo
  columnOptions = [
    { value: 1, label: '1 column' },
    { value: 2, label: '2 columns' },
    { value: 3, label: '3 columns' },
    { value: 4, label: '4 columns' },
    { value: 5, label: '5 columns' },
    { value: 6, label: '6 columns' },
    { value: 12, label: '12 columns' },
  ];
  gapOptions = [
    { value: 0, label: 'None (0)' },
    { value: 1, label: 'Small (1)' },
    { value: 4, label: 'Medium (4)' },
    { value: 6, label: 'Large (6)' },
    { value: 8, label: 'XL (8)' },
  ];

  // Sample items for grids
  items = Array.from({ length: 12 }, (_, i) => i + 1);
}
