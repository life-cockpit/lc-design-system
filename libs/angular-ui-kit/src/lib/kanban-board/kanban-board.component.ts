import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
  output,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: KanbanLabel[];
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface KanbanLabel {
  text: string;
  color?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  limit?: number;
}

export interface KanbanMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex: number;
}

@Component({
  selector: 'lc-kanban-board',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  readonly columns = input.required<KanbanColumn[]>();
  readonly showCardCount = input(true);
  readonly showWipLimit = input(true);
  readonly readonly = input(false);

  readonly cardMoved = output<KanbanMoveEvent>();
  readonly cardClick = output<{ card: KanbanCard; columnId: string }>();

  protected internalColumns = signal<KanbanColumn[]>([]);
  protected draggedCard = signal<{ card: KanbanCard; columnId: string } | null>(null);
  protected dropTargetColumn = signal<string | null>(null);
  protected dropTargetIndex = signal<number>(-1);

  protected readonly displayColumns = computed(() => {
    const internal = this.internalColumns();
    return internal.length ? internal : this.columns();
  });

  protected isOverLimit(col: KanbanColumn): boolean {
    return !!col.limit && col.cards.length > col.limit;
  }

  protected getPriorityIcon(priority?: string): string {
    switch (priority) {
      case 'critical': return 'exclamation-circle';
      case 'high': return 'arrow-up';
      case 'medium': return 'minus';
      case 'low': return 'arrow-down';
      default: return '';
    }
  }

  protected getPriorityColor(priority?: string): string {
    switch (priority) {
      case 'critical': return 'var(--color-error-default, #ef4444)';
      case 'high': return 'var(--color-warning-default, #f59e0b)';
      case 'medium': return 'var(--color-info-default, #3b82f6)';
      case 'low': return 'var(--color-success-default, #22c55e)';
      default: return '';
    }
  }

  protected onDragStart(event: DragEvent, card: KanbanCard, columnId: string): void {
    if (this.readonly()) { event.preventDefault(); return; }
    this.draggedCard.set({ card, columnId });
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);
    }
  }

  protected onDragOver(event: DragEvent, columnId: string, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dropTargetColumn.set(columnId);
    this.dropTargetIndex.set(index);
  }

  protected onDragOverColumn(event: DragEvent, columnId: string): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dropTargetColumn.set(columnId);
  }

  protected onDragLeave(): void {
    this.dropTargetColumn.set(null);
    this.dropTargetIndex.set(-1);
  }

  protected onDrop(event: DragEvent, toColumnId: string, toIndex?: number): void {
    event.preventDefault();
    const dragged = this.draggedCard();
    if (!dragged) return;

    const cols = this.displayColumns().map(c => ({ ...c, cards: [...c.cards] }));
    const fromCol = cols.find(c => c.id === dragged.columnId);
    const toCol = cols.find(c => c.id === toColumnId);
    if (!fromCol || !toCol) return;

    const cardIdx = fromCol.cards.findIndex(c => c.id === dragged.card.id);
    if (cardIdx < 0) return;

    const [card] = fromCol.cards.splice(cardIdx, 1);
    const insertIdx = toIndex ?? toCol.cards.length;
    toCol.cards.splice(insertIdx, 0, card);

    this.internalColumns.set(cols);
    this.draggedCard.set(null);
    this.dropTargetColumn.set(null);
    this.dropTargetIndex.set(-1);

    this.cardMoved.emit({
      cardId: card.id,
      fromColumnId: dragged.columnId,
      toColumnId,
      toIndex: insertIdx,
    });
  }

  protected onDragEnd(): void {
    this.draggedCard.set(null);
    this.dropTargetColumn.set(null);
    this.dropTargetIndex.set(-1);
  }

  protected onCardClick(card: KanbanCard, columnId: string): void {
    this.cardClick.emit({ card, columnId });
  }

}
