import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { KanbanBoardComponent, KanbanColumn, KanbanMoveEvent, KanbanCard } from './kanban-board.component';

@Component({
  standalone: true,
  imports: [KanbanBoardComponent],
  template: `<lc-kanban-board
    [columns]="columns()"
    [showCardCount]="showCardCount()"
    [showWipLimit]="showWipLimit()"
    [readonly]="readonly()"
    (cardMoved)="lastMove = $event"
    (cardClick)="lastClick = $event"
  />`,
})
class TestHost {
  columns = signal<KanbanColumn[]>([
    {
      id: 'todo', title: 'To Do', color: '#3b82f6',
      cards: [
        { id: '1', title: 'Task 1', priority: 'high' },
        { id: '2', title: 'Task 2', description: 'Desc', labels: [{ text: 'Bug', color: '#ef4444' }] },
      ],
    },
    {
      id: 'progress', title: 'In Progress', color: '#f59e0b', limit: 3,
      cards: [
        { id: '3', title: 'Task 3', assignee: 'Alice' },
      ],
    },
    {
      id: 'done', title: 'Done', color: '#22c55e',
      cards: [],
    },
  ]);
  showCardCount = signal(true);
  showWipLimit = signal(true);
  readonly = signal(false);
  lastMove: KanbanMoveEvent | null = null;
  lastClick: { card: KanbanCard; columnId: string } | null = null;
}

describe('KanbanBoardComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost], providers: [provideHttpClient()] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(el.querySelector('lc-kanban-board')).toBeTruthy();
  });

  it('should render all columns', () => {
    const cols = el.querySelectorAll('.lc-kanban__column');
    expect(cols.length).toBe(3);
  });

  it('should show column titles', () => {
    const titles = el.querySelectorAll('.lc-kanban__column-title');
    expect(titles[0].textContent?.trim()).toBe('To Do');
    expect(titles[1].textContent?.trim()).toBe('In Progress');
    expect(titles[2].textContent?.trim()).toBe('Done');
  });

  it('should render cards', () => {
    const cards = el.querySelectorAll('.lc-kanban__card');
    expect(cards.length).toBe(3);
  });

  it('should show card title', () => {
    const titles = el.querySelectorAll('.lc-kanban__card-title');
    expect(titles[0].textContent?.trim()).toBe('Task 1');
  });

  it('should show card description', () => {
    const desc = el.querySelector('.lc-kanban__card-desc');
    expect(desc?.textContent?.trim()).toBe('Desc');
  });

  it('should show priority icon', () => {
    const priority = el.querySelector('.lc-kanban__card-priority');
    expect(priority).toBeTruthy();
    expect(priority?.tagName.toLowerCase()).toBe('lc-icon');
  });

  it('should show card labels', () => {
    const labels = el.querySelectorAll('.lc-kanban__card-label');
    expect(labels.length).toBe(1);
    expect(labels[0].textContent?.trim()).toBe('Bug');
  });

  it('should show assignee', () => {
    const assignee = el.querySelector('.lc-kanban__card-assignee');
    expect(assignee?.textContent?.trim()).toBe('Alice');
  });

  it('should show card count', () => {
    const counts = el.querySelectorAll('.lc-kanban__column-count');
    expect(counts[0].textContent?.trim()).toBe('2');
    expect(counts[1].textContent?.trim()).toBe('1');
    expect(counts[2].textContent?.trim()).toBe('0');
  });

  it('should show WIP limit', () => {
    const limit = el.querySelector('.lc-kanban__column-limit');
    expect(limit).toBeTruthy();
    expect(limit?.textContent?.trim()).toContain('3');
  });

  it('should show column color dot', () => {
    const dots = el.querySelectorAll('.lc-kanban__column-dot');
    expect(dots.length).toBe(3);
  });

  it('should show empty state for empty column', () => {
    const empty = el.querySelector('.lc-kanban__empty');
    expect(empty?.textContent?.trim()).toBe('Drop here');
  });

  it('should emit cardClick on card click', () => {
    const card = el.querySelector('.lc-kanban__card') as HTMLElement;
    card.click();
    expect(host.lastClick).toBeTruthy();
    expect(host.lastClick!.card.id).toBe('1');
    expect(host.lastClick!.columnId).toBe('todo');
  });

  it('should set cards as draggable', () => {
    const card = el.querySelector('.lc-kanban__card');
    expect(card?.getAttribute('draggable')).toBe('true');
  });

  it('should not be draggable in readonly mode', () => {
    host.readonly.set(true);
    fixture.detectChanges();
    const card = el.querySelector('.lc-kanban__card');
    expect(card?.getAttribute('draggable')).toBe('false');
  });

  it('should hide card count when disabled', () => {
    host.showCardCount.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-kanban__column-count').length).toBe(0);
  });

  it('should hide WIP limit when disabled', () => {
    host.showWipLimit.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-kanban__column-limit').length).toBe(0);
  });
});
