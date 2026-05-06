import { Component } from '@angular/core';
import { FileUploadComponent, FileUploadFile } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-file-upload-demo',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <h2>File Upload</h2>
    <section style="max-width: 480px; display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3>Default</h3>
        <lc-file-upload (filesSelected)="onFiles($event)"></lc-file-upload>
      </div>
      <div>
        <h3>With Restrictions</h3>
        <lc-file-upload
          accept=".pdf,.png,.jpg"
          [multiple]="true"
          [maxSizeBytes]="5242880"
          hint="Upload documents (PDF, PNG, JPG) — max 5 MB"
          (filesSelected)="onFiles($event)"
        ></lc-file-upload>
      </div>
      <div>
        <h3>Disabled</h3>
        <lc-file-upload [disabled]="true" hint="Upload not available"></lc-file-upload>
      </div>
    </section>
  `,
})
export class FileUploadDemoComponent {
  onFiles(files: FileUploadFile[]): void {
    console.log('Files selected:', files);
  }
}
