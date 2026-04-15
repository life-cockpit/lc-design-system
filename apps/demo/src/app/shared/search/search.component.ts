import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  // Moved template to search.component.html
  query = input<string>('');
  placeholder = input<string>('Search...');
  showResults = input<boolean>(false);
  results = input<SearchResult[]>([]);

  queryChange = output<string>();
  resultClick = output<SearchResult>();
  clear = output<void>();

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.queryChange.emit(value);
  }

  protected onClear(): void {
    this.clear.emit();
  }

  protected onResultClick(result: SearchResult): void {
    this.resultClick.emit(result);
  }
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  path?: string;
  data?: unknown;
}
