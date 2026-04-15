import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent } from '@life-cockpit/ui-kit';
import { ToastService } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent],
  templateUrl: './toast-demo.component.html',
  styleUrls: ['./toast-demo.component.scss'],
})
export class ToastDemoComponent {
  private toastService = inject(ToastService);

  showSuccessToast(): void {
    this.toastService.show({
      message: 'Operation completed successfully!',
      variant: 'success',
      duration: 3000,
    });
  }

  showErrorToast(): void {
    this.toastService.show({
      message: 'Something went wrong. Please try again.',
      variant: 'error',
      duration: 5000,
    });
  }

  showWarningToast(): void {
    this.toastService.show({
      message: 'Your session will expire soon.',
      variant: 'warning',
      duration: 4000,
    });
  }

  showInfoToast(): void {
    this.toastService.show({
      message: 'New updates are available.',
      variant: 'info',
      duration: 3000,
    });
  }

  showToastWithAction(): void {
    this.toastService.show({
      message: 'File saved successfully',
      variant: 'success',
      duration: 5000,
      action: {
        label: 'Undo',
        onClick: () => {
          this.toastService.show({ message: 'Undo action triggered', variant: 'info' });
        },
      },
    });
  }

  showTopLeftToast(): void {
    this.toastService.show({
      message: 'Top Left Toast',
      variant: 'info',
      position: 'top-left',
      duration: 3000,
    });
  }

  showTopCenterToast(): void {
    this.toastService.show({
      message: 'Top Center Toast',
      variant: 'info',
      position: 'top-center',
      duration: 3000,
    });
  }

  showTopRightToast(): void {
    this.toastService.show({
      message: 'Top Right Toast',
      variant: 'info',
      position: 'top-right',
      duration: 3000,
    });
  }

  showBottomLeftToast(): void {
    this.toastService.show({
      message: 'Bottom Left Toast',
      variant: 'info',
      position: 'bottom-left',
      duration: 3000,
    });
  }

  showBottomCenterToast(): void {
    this.toastService.show({
      message: 'Bottom Center Toast',
      variant: 'info',
      position: 'bottom-center',
      duration: 3000,
    });
  }

  showBottomRightToast(): void {
    this.toastService.show({
      message: 'Bottom Right Toast',
      variant: 'info',
      position: 'bottom-right',
      duration: 3000,
    });
  }

  showPersistentToast(): void {
    this.toastService.show({
      message: 'This toast stays until you close it',
      variant: 'info',
      duration: 0,
    });
  }

  showMultipleToasts(): void {
    this.toastService.show({ message: 'First toast', variant: 'success' });
    setTimeout(() => this.toastService.show({ message: 'Second toast', variant: 'info' }), 500);
    setTimeout(() => this.toastService.show({ message: 'Third toast', variant: 'warning' }), 1000);
    setTimeout(() => this.toastService.show({ message: 'Fourth toast', variant: 'error' }), 1500);
  }

  clearAllToasts(): void {
    this.toastService.closeAll();
  }
}
