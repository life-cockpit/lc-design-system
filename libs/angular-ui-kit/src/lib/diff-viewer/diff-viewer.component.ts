import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type DiffViewMode = 'side-by-side' | 'inline';

interface DiffLine {
  type: 'unchanged' | 'added' | 'removed';
  leftNum: number | null;
  rightNum: number | null;
  content: string;
}

@Component({
  selector: 'lc-diff-viewer',
  standalone: true,
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffViewerComponent {
  readonly oldText = input.required<string>();
  readonly newText = input.required<string>();
  readonly oldLabel = input('Original');
  readonly newLabel = input('Modified');
  readonly mode = input<DiffViewMode>('side-by-side');
  readonly showLineNumbers = input(true);
  readonly contextLines = input(Infinity);

  protected readonly diffLines = computed(() => {
    const oldLines = this.oldText().split('\n');
    const newLines = this.newText().split('\n');
    return this.computeDiff(oldLines, newLines);
  });

  protected readonly filteredLines = computed(() => {
    const ctx = this.contextLines();
    const lines = this.diffLines();
    if (ctx === Infinity) return lines;

    const changed = new Set<number>();
    lines.forEach((l, i) => { if (l.type !== 'unchanged') changed.add(i); });

    const visible = new Set<number>();
    for (const idx of changed) {
      for (let j = Math.max(0, idx - ctx); j <= Math.min(lines.length - 1, idx + ctx); j++) {
        visible.add(j);
      }
    }

    return lines.filter((_, i) => visible.has(i));
  });

  protected readonly sideBySide = computed(() => {
    if (this.mode() !== 'side-by-side') return { left: [], right: [] };

    const lines = this.filteredLines();
    const left: { num: number | null; content: string; type: string }[] = [];
    const right: { num: number | null; content: string; type: string }[] = [];

    for (const line of lines) {
      if (line.type === 'unchanged') {
        left.push({ num: line.leftNum, content: line.content, type: 'unchanged' });
        right.push({ num: line.rightNum, content: line.content, type: 'unchanged' });
      } else if (line.type === 'removed') {
        left.push({ num: line.leftNum, content: line.content, type: 'removed' });
        right.push({ num: null, content: '', type: 'empty' });
      } else {
        left.push({ num: null, content: '', type: 'empty' });
        right.push({ num: line.rightNum, content: line.content, type: 'added' });
      }
    }

    return { left, right };
  });

  protected readonly stats = computed(() => {
    const lines = this.diffLines();
    return {
      additions: lines.filter(l => l.type === 'added').length,
      deletions: lines.filter(l => l.type === 'removed').length,
    };
  });

  private computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
    const m = oldLines.length;
    const n = newLines.length;

    // LCS using dynamic programming
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = oldLines[i - 1] === newLines[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    // Backtrack
    const result: DiffLine[] = [];
    let i = m, j = n;
    const stack: DiffLine[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
        stack.push({ type: 'unchanged', leftNum: i, rightNum: j, content: oldLines[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        stack.push({ type: 'added', leftNum: null, rightNum: j, content: newLines[j - 1] });
        j--;
      } else {
        stack.push({ type: 'removed', leftNum: i, rightNum: null, content: oldLines[i - 1] });
        i--;
      }
    }

    while (stack.length) result.push(stack.pop()!);
    return result;
  }
}
