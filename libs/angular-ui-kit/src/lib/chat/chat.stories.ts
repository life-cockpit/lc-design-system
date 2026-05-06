import type { Meta, StoryObj } from '@storybook/angular';
import { ChatComponent, ChatMessage } from './chat.component';

const now = new Date();
const t = (min: number) => new Date(now.getTime() - min * 60000);

const conversationMessages: ChatMessage[] = [
  { id: '1', role: 'system', content: 'Chat begonnen', timestamp: t(10) },
  { id: '2', role: 'user', content: 'Hallo! Kannst du mir bei meinem Angular-Projekt helfen?', name: 'Eric', timestamp: t(9) },
  { id: '3', role: 'agent', content: 'Natürlich! Was genau brauchst du Hilfe bei?', name: 'AI Assistant', timestamp: t(8) },
  { id: '4', role: 'user', content: 'Ich brauche einen Calendar-Komponenten mit Day, Week und Month Views.', name: 'Eric', timestamp: t(7) },
  { id: '5', role: 'agent', content: 'Das kann ich erstellen! Ich werde einen CalendarComponent mit drei Views (Tag, Woche, Monat) bauen, inklusive Event-Handling und Navigation.\n\nSoll ich auch Drag & Drop für Events einbauen?', name: 'AI Assistant', timestamp: t(6) },
  { id: '6', role: 'user', content: 'Nein, erstmal ohne D&D. Danke!', name: 'Eric', timestamp: t(5) },
];

const streamingMessages: ChatMessage[] = [
  ...conversationMessages,
  { id: '7', role: 'agent', content: 'Ich erstelle jetzt den Calendar-Komponenten mit Signal-Inputs und OnPush Change Detection…', name: 'AI Assistant', timestamp: new Date(), streaming: true },
];

const multiUserMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Hey Team, das neue Design ist fertig!', name: 'Eric', timestamp: t(15) },
  { id: '2', role: 'agent', content: 'Sieht super aus! Ich habe die Components dafür generiert.', name: 'Copilot', timestamp: t(14) },
  { id: '3', role: 'system', content: 'Anna hat den Chat betreten', timestamp: t(13) },
  { id: '4', role: 'user', content: 'Perfekt, ich kümmere mich um die Tests.', name: 'Anna', timestamp: t(12) },
  { id: '5', role: 'agent', content: 'Die Test-Suite ist ready. 1472 Tests bestehen.', name: 'Copilot', timestamp: t(11) },
];

const meta: Meta<ChatComponent> = {
  title: 'Components/Chat',
  component: ChatComponent,
  tags: ['autodocs'],

  parameters: {
    docs: {
      description: {
        component: `
Chat component for conversational user interfaces.

**Key Features:**
- User, agent, and system message roles
- Streaming cursor indicator for AI responses
- Typing indicator with animated dots
- Auto-scroll to latest message
- Optional avatars and timestamps
- Configurable header with title
- Send on Enter with Shift+Enter for newline
`,
      },
    },
  },
};
export default meta;
type Story = StoryObj<ChatComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat title="AI Chat" [messages]="messages"></lc-chat>
      </div>
    `,
    props: { messages: conversationMessages },
    moduleMetadata: { imports: [ChatComponent] },
  }),
};

export const Streaming: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat title="AI Chat" [messages]="messages" [isStreaming]="true"></lc-chat>
      </div>
    `,
    props: { messages: streamingMessages },
    moduleMetadata: { imports: [ChatComponent] },
  }),
};

export const TypingIndicator: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat title="AI Chat" [messages]="messages" [isStreaming]="true"></lc-chat>
      </div>
    `,
    props: { messages: conversationMessages },
    moduleMetadata: { imports: [ChatComponent] },
  }),
};

export const Empty: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat title="Neuer Chat" [messages]="[]" placeholder="Stelle eine Frage…"></lc-chat>
      </div>
    `,
    moduleMetadata: { imports: [ChatComponent] },
  }),
};

export const MultiUser: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat title="Team Chat" [messages]="messages"></lc-chat>
      </div>
    `,
    props: { messages: multiUserMessages },
    moduleMetadata: { imports: [ChatComponent] },
  }),
};

export const NoHeader: Story = {
  render: () => ({
    template: `
      <div style="height: 500px;">
        <lc-chat [showHeader]="false" [messages]="messages"></lc-chat>
      </div>
    `,
    props: { messages: conversationMessages.slice(1) },
    moduleMetadata: { imports: [ChatComponent] },
  }),
};
