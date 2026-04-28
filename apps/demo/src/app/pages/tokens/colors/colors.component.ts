import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@life-cockpit/angular-ui-kit';

interface ColorScale {
  name: string;
  description: string;
  shades: ColorShade[];
}

interface ColorShade {
  name: string;
  value: string;
  textColor: string;
}

@Component({
  selector: 'app-colors',
  imports: [CommonModule, CardComponent],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
})
export class ColorsComponent {
  protected copiedColor: string | null = null;
  private copyTimeout?: number;

  protected colorScales: ColorScale[] = [
    {
      name: 'Primary Scale',
      description:
        'Main brand color scale from #208497 (Primary-500) to light tints and dark shades.',
      shades: [
        { name: 'primary-50', value: '#F5F9FA', textColor: 'text-gray-900' },
        { name: 'primary-100', value: '#E5F2F4', textColor: 'text-gray-900' },
        { name: 'primary-200', value: '#D5E5E9', textColor: 'text-gray-900' },
        { name: 'primary-300', value: '#9CCBD5', textColor: 'text-gray-900' },
        { name: 'primary-400', value: '#5EA8BA', textColor: 'text-white' },
        { name: 'primary-500', value: '#208497', textColor: 'text-white' },
        { name: 'primary-600', value: '#1A6A7C', textColor: 'text-white' },
        { name: 'primary-700', value: '#145060', textColor: 'text-white' },
        { name: 'primary-800', value: '#0E3645', textColor: 'text-white' },
        { name: 'primary-900', value: '#081C29', textColor: 'text-white' },
      ],
    },
    {
      name: 'Secondary Scale',
      description: 'Supporting color scale from #7097AF (Secondary-500) with harmonious tints.',
      shades: [
        { name: 'secondary-50', value: '#F8FAFB', textColor: 'text-gray-900' },
        { name: 'secondary-100', value: '#F5F8F9', textColor: 'text-gray-900' },
        { name: 'secondary-200', value: '#E8EFF2', textColor: 'text-gray-900' },
        { name: 'secondary-300', value: '#C4D8E3', textColor: 'text-gray-900' },
        { name: 'secondary-400', value: '#9AB8C9', textColor: 'text-gray-900' },
        { name: 'secondary-500', value: '#7097AF', textColor: 'text-white' },
        { name: 'secondary-600', value: '#5A7C8C', textColor: 'text-white' },
        { name: 'secondary-700', value: '#445F6A', textColor: 'text-white' },
        { name: 'secondary-800', value: '#2E4248', textColor: 'text-white' },
        { name: 'secondary-900', value: '#172526', textColor: 'text-white' },
      ],
    },
    {
      name: 'Gray Scale',
      description: 'Neutral colors for text, backgrounds, and borders.',
      shades: [
        { name: 'gray-50', value: '#F9FAFB', textColor: 'text-gray-900' },
        { name: 'gray-100', value: '#F3F4F6', textColor: 'text-gray-900' },
        { name: 'gray-200', value: '#E5E7EB', textColor: 'text-gray-900' },
        { name: 'gray-300', value: '#D1D5DB', textColor: 'text-gray-900' },
        { name: 'gray-400', value: '#9CA3AF', textColor: 'text-gray-900' },
        { name: 'gray-500', value: '#6B7280', textColor: 'text-white' },
        { name: 'gray-600', value: '#4B5563', textColor: 'text-white' },
        { name: 'gray-700', value: '#374151', textColor: 'text-white' },
        { name: 'gray-800', value: '#1F2937', textColor: 'text-white' },
        { name: 'gray-900', value: '#111827', textColor: 'text-white' },
      ],
    },
  ];

  protected semanticColors = [
    { name: 'success', value: '#10B981', description: 'Success states' },
    { name: 'error', value: '#EF4444', description: 'Error states' },
    { name: 'warning', value: '#F59E0B', description: 'Warning states' },
    { name: 'info', value: '#3B82F6', description: 'Informational states' },
  ];

  protected copyToClipboard(value: string, name: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(value).then(() => {
        this.copiedColor = name;
        if (this.copyTimeout) {
          clearTimeout(this.copyTimeout);
        }
        this.copyTimeout = window.setTimeout(() => {
          this.copiedColor = null;
        }, 2000);
      });
    }
  }
}
