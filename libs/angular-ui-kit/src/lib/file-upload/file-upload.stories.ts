import type { Meta, StoryObj } from '@storybook/angular';
import { FileUploadComponent } from './file-upload.component';

const meta: Meta<FileUploadComponent> = {
  title: 'Components/File Upload',
  component: FileUploadComponent,
  parameters: {
    docs: {
      description: {
        component: `
Drag & drop file upload component.

**Key Features:**
- Drag & drop zone with visual feedback
- Click to browse fallback
- File type restrictions via \`accept\`
- Max file size validation
- Multiple file support
- File list with remove buttons
- Keyboard accessible
        `,
      },
    },
  },
  argTypes: {
    accept: { control: 'text', description: 'Accepted MIME types / extensions' },
    multiple: { control: 'boolean' },
    maxSizeBytes: { control: 'number', description: 'Max file size (bytes), 0 = unlimited' },
    disabled: { control: 'boolean' },
    hint: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FileUploadComponent>;

export const Default: Story = {
  args: {
    hint: 'Drag & drop files here, or click to browse',
    multiple: false,
  },
};

export const WithRestrictions: Story = {
  args: {
    accept: '.pdf,.png,.jpg,.jpeg',
    maxSizeBytes: 5 * 1024 * 1024,
    multiple: true,
    hint: 'Upload your documents (PDF, PNG, JPG)',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: 'Upload disabled',
  },
};

export const SingleFile: Story = {
  args: {
    multiple: false,
    accept: 'image/*',
    hint: 'Upload a profile picture',
  },
};
