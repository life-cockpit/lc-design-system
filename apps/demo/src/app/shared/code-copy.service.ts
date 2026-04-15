import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class CodeCopyService {
  private toasts = signal<Toast[]>([]);

  /**
   * Copy code to clipboard and show success toast
   */
  async copyCode(code: string, label?: string): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(code);
        this.showToast(`${label || 'Code'} copied to clipboard`, 'success');
      } catch (error) {
        this.showToast('Failed to copy to clipboard', 'error');
        console.error('Copy failed:', error);
      }
    } else {
      // Fallback for older browsers
      this.fallbackCopy(code);
    }
  }

  /**
   * Fallback copy method for browsers without clipboard API
   */
  private fallbackCopy(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showToast('Code copied to clipboard', 'success');
      } else {
        this.showToast('Failed to copy to clipboard', 'error');
      }
    } catch (error) {
      this.showToast('Failed to copy to clipboard', 'error');
      console.error('Fallback copy failed:', error);
    }

    document.body.removeChild(textArea);
  }

  /**
   * Show a temporary toast notification
   */
  private showToast(message: string, type: Toast['type'], duration = 3000): void {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, message, type, duration };

    this.toasts.update((toasts) => [...toasts, toast]);

    setTimeout(() => {
      this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
    }, duration);
  }

  /**
   * Get current toasts
   */
  getToasts(): ReturnType<typeof this.toasts.asReadonly> {
    return this.toasts.asReadonly();
  }
}
