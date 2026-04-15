import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent, CardComponent, ButtonComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-alert-demo',
  standalone: true,
  imports: [CommonModule, AlertComponent, CardComponent, ButtonComponent],
  templateUrl: './alert-demo.component.html',
  styleUrls: ['./alert-demo.component.scss'],
})
export class AlertDemoComponent {
  showDismissableAlert = signal(true);
  showCustomAlert = signal(true);

  resetAlerts(): void {
    this.showDismissableAlert.set(true);
    this.showCustomAlert.set(true);
  }
}
