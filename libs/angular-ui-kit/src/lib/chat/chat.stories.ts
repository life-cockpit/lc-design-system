import type { Meta, StoryObj } from '@storybook/angular';
import { ChatComponent, ChatMessage } from './chat.component';
import { DiffViewerComponent } from '../diff-viewer/diff-viewer.component';
import { MarkdownComponent } from '../markdown/markdown.component';

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

// --- Rich content stories ---

const specOld = `## Ziel\n\n_TBD_\n\n## Zielgruppe\n\n_TBD_`;
const specNew = `## Ziel\n\nEine Plattform für automatisiertes Onboarding neuer Mitarbeiter.\n\n## Zielgruppe\n\nHR-Teams in mittelständischen B2B-SaaS-Unternehmen.`;

const diffMessages: ChatMessage[] = [
  { id: '1', role: 'system', content: 'Spec-Authoring gestartet', timestamp: t(5) },
  { id: '2', role: 'user', content: 'Wir bauen eine Plattform für automatisiertes Onboarding. Zielgruppe sind HR-Teams in mittelständischen B2B-SaaS-Firmen.', name: 'Eric', timestamp: t(4) },
  {
    id: '3', role: 'agent',
    content: 'Ich habe Ziel und Zielgruppe im Template ausgefüllt:',
    name: 'Spec Author',
    timestamp: t(3),
    data: {
      diff: true,
      oldText: specOld,
      newText: specNew,
    },
  },
  { id: '4', role: 'user', content: 'Passt! Kannst du noch die Akzeptanzkriterien ergänzen?', name: 'Eric', timestamp: t(2) },
  {
    id: '5', role: 'agent',
    content: 'Akzeptanzkriterien hinzugefügt:',
    name: 'Spec Author',
    timestamp: t(1),
    data: {
      diff: true,
      oldText: specNew,
      newText: specNew + `\n\n## Akzeptanzkriterien\n\n- [ ] Neuer Mitarbeiter kann Onboarding-Prozess starten\n- [ ] HR-Manager sieht Fortschritt in Echtzeit\n- [ ] E-Mail-Benachrichtigungen bei abgeschlossenen Schritten`,
    },
  },
];

const markdownMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'Zeig mir eine Zusammenfassung des API-Designs.', name: 'Eric', timestamp: t(3) },
  {
    id: '2', role: 'agent',
    content: '',
    name: 'AI Assistant',
    timestamp: t(2),
    data: {
      markdown: true,
      markdownContent: `### API Endpoints\n\n| Method | Path | Beschreibung |\n|--------|------|-------------|\n| \`GET\` | \`/api/users\` | Alle Benutzer |\n| \`POST\` | \`/api/users\` | Benutzer erstellen |\n| \`DELETE\` | \`/api/users/:id\` | Benutzer löschen |\n\n> **Hinweis:** Alle Endpoints erfordern einen gültigen JWT-Token.\n\n- Rate Limit: **100 req/min**\n- Response-Format: \`application/json\``,
    },
  },
  { id: '3', role: 'user', content: 'Danke, kannst du den DELETE-Endpoint auf soft-delete umstellen?', name: 'Eric', timestamp: t(1) },
];

export const WithDiffViewer: Story = {
  name: 'With Diff Viewer',
  render: () => ({
    template: `
      <div style="height: 600px;">
        <lc-chat title="Spec Author" [messages]="messages">
          <ng-template #messageTemplate let-msg>
            {{ msg.content }}
            @if (msg.data?.diff) {
              <div style="margin-top: 8px;">
                <lc-diff-viewer
                  [oldText]="msg.data.oldText"
                  [newText]="msg.data.newText"
                  mode="inline"
                  [showLineNumbers]="false"
                  [contextLines]="3"
                />
              </div>
            }
          </ng-template>
        </lc-chat>
      </div>
    `,
    props: { messages: diffMessages },
    moduleMetadata: { imports: [ChatComponent, DiffViewerComponent] },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Agent-Nachrichten können einen eingebetteten Diff-Viewer enthalten, um Änderungen am Dokument direkt im Chat sichtbar zu machen. Nutze `data.diff`, `data.oldText` und `data.newText` auf der ChatMessage zusammen mit einem custom `#messageTemplate`.',
      },
    },
  },
};

export const WithMarkdown: Story = {
  name: 'With Markdown',
  render: () => ({
    template: `
      <div style="height: 600px;">
        <lc-chat title="AI Assistant" [messages]="messages">
          <ng-template #messageTemplate let-msg>
            @if (msg.data?.markdown) {
              <lc-markdown [content]="msg.data.markdownContent" variant="compact" />
            } @else {
              {{ msg.content }}
            }
          </ng-template>
        </lc-chat>
      </div>
    `,
    props: { messages: markdownMessages },
    moduleMetadata: { imports: [ChatComponent, MarkdownComponent] },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Agent-Nachrichten können Markdown rendern — Tabellen, Listen, Codeblöcke und mehr. Nutze `data.markdown` und `data.markdownContent` zusammen mit `#messageTemplate`.',
      },
    },
  },
};
