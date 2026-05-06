import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';

export type ChatMessageRole = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp?: Date | string;
  avatar?: string;
  name?: string;
  streaming?: boolean;
}

export interface ChatSendEvent {
  content: string;
}

@Component({
  selector: 'lc-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Chat component for conversational user interfaces.
 *
 * Features:
 * - User, agent, and system message roles
 * - Streaming cursor indicator for AI responses
 * - Typing indicator with animated dots
 * - Auto-scroll to latest message
 * - Optional avatars and timestamps
 * - Configurable header with title
 * - Send on Enter with Shift+Enter for newline
 *
 * @example
 * ```html
 * <lc-chat [messages]="messages" title="Support" (messageSend)="onSend($event)" />
 * ```
 */
export class ChatComponent implements AfterViewChecked {
  /** Messages to display. */
  messages = input<ChatMessage[]>([]);

  /** Placeholder text for the input. */
  placeholder = input<string>('Nachricht eingeben…');

  /** Title displayed in the header. */
  title = input<string>('Chat');

  /** Whether the agent is currently streaming / typing. */
  isStreaming = input<boolean>(false);

  /** Show the header bar. */
  showHeader = input<boolean>(true);

  /** Disable the input. */
  disabled = input<boolean>(false);

  /** Show avatars next to messages. */
  showAvatars = input<boolean>(true);

  /** Show timestamps. */
  showTimestamps = input<boolean>(true);

  /** Emits when user sends a message. */
  messageSend = output<ChatSendEvent>();

  protected readonly inputValue = signal('');
  private shouldScroll = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  protected readonly formattedMessages = computed(() =>
    this.messages().map(m => ({
      ...m,
      timestamp: m.timestamp instanceof Date ? m.timestamp : m.timestamp ? new Date(m.timestamp) : undefined,
    }))
  );

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  protected onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLTextAreaElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected send(): void {
    const content = this.inputValue().trim();
    if (!content || this.disabled()) return;
    this.messageSend.emit({ content });
    this.inputValue.set('');
    this.shouldScroll = true;
  }

  protected formatTime(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  protected trackById(_: number, msg: ChatMessage): string {
    return msg.id;
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
