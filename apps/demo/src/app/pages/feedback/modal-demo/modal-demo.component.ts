import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent, ButtonComponent, CardComponent, InputComponent, TextareaComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-modal-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent, CardComponent, InputComponent, TextareaComponent],
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.scss'],
})
export class ModalDemoComponent {
  showSmallModal = signal(false);
  showMediumModal = signal(false);
  showLargeModal = signal(false);
  showXLModal = signal(false);
  showFullModal = signal(false);
  showNoBackdropModal = signal(false);
  showNoEscapeModal = signal(false);
  showNoCloseButtonModal = signal(false);
  showFormModal = signal(false);
  showNestedModal = signal(false);
  showNestedInnerModal = signal(false);

  formData = {
    name: '',
    email: '',
    message: '',
  };

  submitForm(): void {
    console.log('Form submitted:', this.formData);
    this.showFormModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: '',
    };
  }
}
