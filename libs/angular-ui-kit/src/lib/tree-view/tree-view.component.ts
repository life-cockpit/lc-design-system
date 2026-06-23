import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import {
  FILE_FALLBACK_ICON,
  FOLDER_ICON,
  FOLDER_OPEN_ICON,
  resolveFileIcon,
} from './file-icons';

// ── Public types ─────────────────────────────────────────────────────────────

export type TreeNodeType = 'file' | 'folder';

/**
 * A node in the file tree. Folders carry `children`; files do not.
 */
export interface TreeNode {
  /** Display name, e.g. `app.component.ts` or `src`. */
  name: string;
  /**
   * Node type. Optional — inferred as `folder` when `children` is present,
   * otherwise `file`.
   */
  type?: TreeNodeType;
  /**
   * Stable identifier. Optional — when omitted, the full path is used,
   * which is stable as long as names are unique among siblings.
   */
  id?: string;
  /** Child nodes (folders only). */
  children?: TreeNode[];
  /**
   * Explicit Tabler icon name. Overrides automatic file-type / folder
   * icon resolution.
   */
  icon?: string;
  /** Optional badge text shown to the right of the node (e.g. git status, count). */
  badge?: string;
  /** Tone of the badge / node accent. */
  status?: 'default' | 'added' | 'modified' | 'removed' | 'muted';
  /** Whether this folder starts expanded. Ignored for files. */
  expanded?: boolean;
  /** Disable selection / interaction for this node. */
  disabled?: boolean;
}

// ── Internal flattened representation ─────────────────────────────────────────

interface FlatNode {
  id: string;
  name: string;
  type: TreeNodeType;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  icon: string;
  badge?: string;
  status: NonNullable<TreeNode['status']>;
  disabled: boolean;
  /** Whether each ancestor level still has following siblings (for guide lines). */
  ancestorHasSibling: boolean[];
  /** Whether this node is the last among its siblings. */
  isLast: boolean;
}

const BADGE_STATUS_COLOR: Record<NonNullable<TreeNode['status']>, string> = {
  default: 'var(--color-neutral-400)',
  added: 'var(--color-success-default, #16a34a)',
  modified: 'var(--color-warning-default, #d97706)',
  removed: 'var(--color-error-default, #dc2626)',
  muted: 'var(--color-neutral-300)',
};

function nodeType(node: TreeNode): TreeNodeType {
  return node.type ?? (node.children ? 'folder' : 'file');
}

/**
 * Tree view component for visualizing file / folder hierarchies such as a
 * complete GitHub project.
 *
 * Features:
 * - Recursive folder / file rendering from a single `nodes` input
 * - Automatic file-type icons by extension and well-known file name,
 *   with open / closed folder icons
 * - Expand / collapse folders, with expand-all / collapse-all helpers
 * - Two-way bound selection and a `nodeClick` event
 * - Indentation guide lines for readability
 * - Optional per-node status badges (added / modified / removed)
 * - Keyboard accessible (Enter / Space to toggle or select)
 * - Dark / light theme support via design tokens
 *
 * @example
 * ```html
 * <lc-tree-view [nodes]="projectTree" [(selectedId)]="selected" />
 * ```
 */
@Component({
  selector: 'lc-tree-view',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'lc-tree-view' },
})
export class TreeViewComponent {
  /** The root-level nodes of the tree. */
  readonly nodes = input.required<TreeNode[]>();

  /** Id (or path) of the currently selected node (two-way bindable). */
  readonly selectedId = model<string | null>(null);

  /** Show indentation guide lines. */
  readonly showGuides = input(true);

  /** Show the expand-all / collapse-all toolbar. */
  readonly showToolbar = input(true);

  /** Icon size for node icons. */
  readonly iconSize = input<'xs' | 'sm' | 'md'>('sm');

  /** Emitted when a node is clicked / activated. */
  readonly nodeClick = output<TreeNode>();

  /** Set of node ids the user has explicitly expanded / collapsed. */
  private readonly expandOverrides = signal<Map<string, boolean>>(new Map());

  /** Flattened, render-ready list of visible nodes. */
  protected readonly visibleNodes = computed<FlatNode[]>(() => {
    const out: FlatNode[] = [];
    const overrides = this.expandOverrides();
    this.flatten(this.nodes(), 0, '', [], overrides, out);
    return out;
  });

  protected badgeColor(status: NonNullable<TreeNode['status']>): string {
    return BADGE_STATUS_COLOR[status];
  }

  protected onNodeClick(flat: FlatNode): void {
    if (flat.disabled) return;
    if (flat.hasChildren) {
      this.toggle(flat);
    }
    this.selectedId.set(flat.id);
    const original = this.findNode(this.nodes(), '', flat.id);
    if (original) this.nodeClick.emit(original);
  }

  protected onToggleClick(flat: FlatNode, event: Event): void {
    event.stopPropagation();
    if (!flat.disabled) this.toggle(flat);
  }

  protected onKeydown(flat: FlatNode, event: KeyboardEvent): void {
    if (flat.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onNodeClick(flat);
    } else if (event.key === 'ArrowRight' && flat.hasChildren && !flat.expanded) {
      event.preventDefault();
      this.setExpanded(flat.id, true);
    } else if (event.key === 'ArrowLeft' && flat.hasChildren && flat.expanded) {
      event.preventDefault();
      this.setExpanded(flat.id, false);
    }
  }

  /** Expand every folder in the tree. */
  expandAll(): void {
    this.setAll(true);
  }

  /** Collapse every folder in the tree. */
  collapseAll(): void {
    this.setAll(false);
  }

  protected trackById = (_: number, n: FlatNode): string => n.id;

  // ── internals ──────────────────────────────────────────────────────────────

  private toggle(flat: FlatNode): void {
    this.setExpanded(flat.id, !flat.expanded);
  }

  private setExpanded(id: string, value: boolean): void {
    this.expandOverrides.update((map) => {
      const next = new Map(map);
      next.set(id, value);
      return next;
    });
  }

  private setAll(value: boolean): void {
    const next = new Map<string, boolean>();
    const walk = (nodes: TreeNode[], parentPath: string): void => {
      for (const node of nodes) {
        const id = node.id ?? `${parentPath}/${node.name}`;
        if (nodeType(node) === 'folder') {
          next.set(id, value);
          if (node.children) walk(node.children, id);
        }
      }
    };
    walk(this.nodes(), '');
    this.expandOverrides.set(next);
  }

  private isExpanded(
    id: string,
    node: TreeNode,
    overrides: Map<string, boolean>,
  ): boolean {
    const override = overrides.get(id);
    if (override !== undefined) return override;
    return node.expanded ?? false;
  }

  private flatten(
    nodes: TreeNode[],
    depth: number,
    parentPath: string,
    ancestorHasSibling: boolean[],
    overrides: Map<string, boolean>,
    out: FlatNode[],
  ): void {
    nodes.forEach((node, index) => {
      const id = node.id ?? `${parentPath}/${node.name}`;
      const type = nodeType(node);
      const hasChildren = type === 'folder' && !!node.children?.length;
      const expanded = hasChildren && this.isExpanded(id, node, overrides);
      const isLast = index === nodes.length - 1;

      out.push({
        id,
        name: node.name,
        type,
        depth,
        hasChildren,
        expanded,
        icon: this.resolveIcon(node, type, expanded),
        badge: node.badge,
        status: node.status ?? 'default',
        disabled: node.disabled ?? false,
        ancestorHasSibling,
        isLast,
      });

      if (expanded && node.children) {
        this.flatten(
          node.children,
          depth + 1,
          id,
          [...ancestorHasSibling, !isLast],
          overrides,
          out,
        );
      }
    });
  }

  private resolveIcon(
    node: TreeNode,
    type: TreeNodeType,
    expanded: boolean,
  ): string {
    if (node.icon) return node.icon;
    if (type === 'folder') return expanded ? FOLDER_OPEN_ICON : FOLDER_ICON;
    return node.name ? resolveFileIcon(node.name) : FILE_FALLBACK_ICON;
  }

  private findNode(
    nodes: TreeNode[],
    parentPath: string,
    targetId: string,
  ): TreeNode | null {
    for (const node of nodes) {
      const id = node.id ?? `${parentPath}/${node.name}`;
      if (id === targetId) return node;
      if (node.children) {
        const found = this.findNode(node.children, id, targetId);
        if (found) return found;
      }
    }
    return null;
  }
}
