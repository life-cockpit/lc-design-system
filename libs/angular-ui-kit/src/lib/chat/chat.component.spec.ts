import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent, ChatMessage } from './chat.component';

describe('ChatComponent', () => {
  let fixture: ComponentFixture<ChatComponent>;

  const messages: ChatMessage[] = [
    { id: '1', role: 'user', content: 'Hello!', name: 'Eric', timestamp: new Date() },
    { id: '2', role: 'agent', content: 'Hi! How can I help?', name: 'AI Assistant', timestamp: new Date() },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChatComponent] }).compileComponents();
    fixture = TestBed.createComponent(ChatComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render messages', () => {
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-chat__message').length).toBe(2);
  });

  it('should render user messages on the right', () => {
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__message--user')).toBeTruthy();
  });

  it('should render agent messages on the left', () => {
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__message--agent')).toBeTruthy();
  });

  it('should show header with title', () => {
    fixture.componentRef.setInput('title', 'Test Chat');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__title').textContent).toContain('Test Chat');
  });

  it('should show streaming badge when streaming', () => {
    fixture.componentRef.setInput('isStreaming', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__streaming-badge')).toBeTruthy();
  });

  it('should show typing indicator when streaming and no streaming message', () => {
    fixture.componentRef.setInput('isStreaming', true);
    fixture.componentRef.setInput('messages', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__typing')).toBeTruthy();
  });

  it('should show cursor on streaming message', () => {
    fixture.componentRef.setInput('messages', [
      { id: '1', role: 'agent', content: 'Processing...', streaming: true },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__cursor--visible')).toBeTruthy();
  });

  it('should render input area', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__input')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lc-chat__send-btn')).toBeTruthy();
  });

  it('should disable send button when input is empty', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.lc-chat__send-btn');
    expect(btn.disabled).toBe(true);
  });

  it('should show avatars by default', () => {
    fixture.componentRef.setInput('messages', messages);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-chat__avatar').length).toBe(2);
  });

  it('should hide avatars when showAvatars is false', () => {
    fixture.componentRef.setInput('messages', messages);
    fixture.componentRef.setInput('showAvatars', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-chat__avatar').length).toBe(0);
  });

  it('should show system messages centered', () => {
    fixture.componentRef.setInput('messages', [
      { id: '1', role: 'system', content: 'Chat started' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-chat__message--system')).toBeTruthy();
  });
});
