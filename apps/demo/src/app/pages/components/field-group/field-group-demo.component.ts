import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  FieldGroupComponent,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-field-group-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, FieldGroupComponent],
  templateUrl: './field-group-demo.component.html',
  styleUrl: './field-group-demo.component.scss',
})
export class FieldGroupDemoComponent {
  // Playground state
  showIcon = signal(true);
  selectedIcon = signal<string>('user');
  isCompact = signal(false);
  
  labelText = signal('Full Name');
  valueText = signal('John Doe');

  // Available icons for selection
  iconOptions = [
    { value: 'user', label: 'User' },
    { value: 'globe-alt', label: 'Globe' },
    { value: 'clock', label: 'Clock' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'hashtag', label: 'Hashtag' },
    { value: 'check-circle', label: 'Check Circle' },
    { value: 'information-circle', label: 'Info Circle' },
  ];

  // Example data for showcase
  userProfile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Engineering',
    role: 'Senior Developer',
  };

  preferences = {
    language: 'English (US)',
    timezone: 'Pacific Time (PT)',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,234.56',
  };

  toggleIcon(): void {
    this.showIcon.update((val) => !val);
  }

  toggleCompact(): void {
    this.isCompact.update((val) => !val);
  }

  onIconChange(value: string | null): void {
    if (value) {
      this.selectedIcon.set(value);
    }
  }
}
