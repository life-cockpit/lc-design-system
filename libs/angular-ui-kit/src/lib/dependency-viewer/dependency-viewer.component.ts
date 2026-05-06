import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  signal,
  HostListener,
} from '@angular/core';

// ── Public types ─────────────────────────────────────────────────────────────

export type DependencyNodeStatus = 'default' | 'active' | 'success' | 'warning' | 'error' | 'muted';
export type DependencyDirection = 'horizontal' | 'vertical';
export type DependencyRelation = 'depends' | 'blocks' | 'references' | 'requires' | 'extends' | 'implements' | 'uses';

export interface DependencyEdgeDef {
  /** Target node id */
  id: string;
  /** Relationship type */
  relation?: DependencyRelation;
}

export interface DependencyNode {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon name */
  icon?: string;
  /** Visual status / color */
  status?: DependencyNodeStatus;
  /** Child nodes: items this node is required for (right / bottom side) */
  children?: DependencyNode[];
  /** Dependencies: items this node depends on (shown as cross-reference edges) */
  dependsOn?: DependencyEdgeDef[];
}

// ── Layout types ─────────────────────────────────────────────────────────────

interface LayoutNode {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  status: DependencyNodeStatus;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  parentId: string | null;
  incomingCount: number;
  outgoingCount: number;
}

interface LayoutEdge {
  id: string;
  path: string;
  sourceId: string;
  targetId: string;
  relation?: DependencyRelation;
  labelX: number;
  labelY: number;
  color: string;
  dashed: boolean;
  isCrossRef: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;
const H_GAP = 80;
const V_GAP = 24;

const RELATION_STYLES: Record<DependencyRelation, { color: string; dashed: boolean; label: string }> = {
  depends:    { color: 'var(--color-neutral-400)',  dashed: false, label: 'depends on' },
  blocks:     { color: 'var(--color-error-default)', dashed: false, label: 'blocks' },
  references: { color: 'var(--color-info-default, #3b82f6)', dashed: true,  label: 'references' },
  requires:   { color: 'var(--color-warning-default)', dashed: false, label: 'requires' },
  extends:    { color: 'var(--color-primary-400)',  dashed: true,  label: 'extends' },
  implements: { color: 'var(--color-success-default)', dashed: true,  label: 'implements' },
  uses:       { color: 'var(--color-neutral-300)',  dashed: true,  label: 'uses' },
};

// ── Layout algorithm ─────────────────────────────────────────────────────────

interface TreeMeasure {
  node: DependencyNode;
  primary: number;
  secondary: number;
  children: TreeMeasure[];
  depth: number;
}

function measureTree(node: DependencyNode, depth: number, dir: DependencyDirection): TreeMeasure {
  const children = (node.children || []).map(c => measureTree(c, depth + 1, dir));

  const nodePrimary = dir === 'horizontal' ? NODE_WIDTH : NODE_HEIGHT;
  const nodeSecondary = dir === 'horizontal' ? NODE_HEIGHT : NODE_WIDTH;

  if (children.length === 0) {
    return { node, primary: nodePrimary, secondary: nodeSecondary, children, depth };
  }

  const totalChildSecondary = children.reduce((sum, c) => sum + c.secondary, 0)
    + (children.length - 1) * V_GAP;
  const maxChildPrimary = Math.max(...children.map(c => c.primary));

  return {
    node,
    primary: nodePrimary + H_GAP + maxChildPrimary,
    secondary: Math.max(nodeSecondary, totalChildSecondary),
    children,
    depth,
  };
}

function layoutTreeH(
  measure: TreeMeasure, x: number, y: number, parentId: string | null,
  nodes: LayoutNode[], edges: LayoutEdge[], allNodes: Map<string, DependencyNode>,
): void {
  const nodeY = y + measure.secondary / 2 - NODE_HEIGHT / 2;
  const orig = allNodes.get(measure.node.id);

  nodes.push({
    id: measure.node.id, label: measure.node.label, description: measure.node.description,
    icon: measure.node.icon, status: measure.node.status || 'default',
    x, y: nodeY, width: NODE_WIDTH, height: NODE_HEIGHT, depth: measure.depth, parentId,
    incomingCount: orig?.dependsOn?.length ?? 0, outgoingCount: orig?.children?.length ?? 0,
  });

  if (parentId) {
    const parent = nodes.find(n => n.id === parentId)!;
    const sx = parent.x + parent.width;
    const sy = parent.y + parent.height / 2;
    const tx = x;
    const ty = nodeY + NODE_HEIGHT / 2;
    const mx = sx + H_GAP / 2;
    edges.push({
      id: `${parentId}→${measure.node.id}`, sourceId: parentId, targetId: measure.node.id,
      path: `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`,
      labelX: mx, labelY: (sy + ty) / 2,
      color: 'var(--color-neutral-300)', dashed: false, isCrossRef: false,
    });
  }

  let childY = y;
  for (const child of measure.children) {
    layoutTreeH(child, x + NODE_WIDTH + H_GAP, childY, measure.node.id, nodes, edges, allNodes);
    childY += child.secondary + V_GAP;
  }
}

function layoutTreeV(
  measure: TreeMeasure, x: number, y: number, parentId: string | null,
  nodes: LayoutNode[], edges: LayoutEdge[], allNodes: Map<string, DependencyNode>,
): void {
  const nodeX = x + measure.secondary / 2 - NODE_WIDTH / 2;
  const orig = allNodes.get(measure.node.id);

  nodes.push({
    id: measure.node.id, label: measure.node.label, description: measure.node.description,
    icon: measure.node.icon, status: measure.node.status || 'default',
    x: nodeX, y, width: NODE_WIDTH, height: NODE_HEIGHT, depth: measure.depth, parentId,
    incomingCount: orig?.dependsOn?.length ?? 0, outgoingCount: orig?.children?.length ?? 0,
  });

  if (parentId) {
    const parent = nodes.find(n => n.id === parentId)!;
    const sx = parent.x + parent.width / 2;
    const sy = parent.y + parent.height;
    const tx = nodeX + NODE_WIDTH / 2;
    const ty = y;
    const my = sy + H_GAP / 2;
    edges.push({
      id: `${parentId}→${measure.node.id}`, sourceId: parentId, targetId: measure.node.id,
      path: `M ${sx} ${sy} C ${sx} ${my}, ${tx} ${my}, ${tx} ${ty}`,
      labelX: (sx + tx) / 2, labelY: my,
      color: 'var(--color-neutral-300)', dashed: false, isCrossRef: false,
    });
  }

  let childX = x;
  for (const child of measure.children) {
    layoutTreeV(child, childX, y + NODE_HEIGHT + H_GAP, measure.node.id, nodes, edges, allNodes);
    childX += child.secondary + V_GAP;
  }
}

function collectAllNodes(node: DependencyNode, map: Map<string, DependencyNode>): void {
  map.set(node.id, node);
  for (const child of node.children || []) collectAllNodes(child, map);
}

function createCrossRefEdges(
  nodes: LayoutNode[], allOriginal: Map<string, DependencyNode>, dir: DependencyDirection,
): LayoutEdge[] {
  const edges: LayoutEdge[] = [];
  const nodeMap = new Map<string, LayoutNode>();
  for (const n of nodes) nodeMap.set(n.id, n);

  for (const [, orig] of allOriginal) {
    if (!orig.dependsOn?.length) continue;
    const target = nodeMap.get(orig.id);
    if (!target) continue;

    for (const dep of orig.dependsOn) {
      const source = nodeMap.get(dep.id);
      if (!source) continue;

      const relation = dep.relation || 'depends';
      const style = RELATION_STYLES[relation];
      let path: string, labelX: number, labelY: number;

      if (dir === 'horizontal') {
        const sx = source.x + source.width;
        const sy = source.y + source.height / 2;
        const tx = target.x;
        const ty = target.y + target.height / 2;
        const mx = (sx + tx) / 2;
        path = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;
        labelX = mx; labelY = (sy + ty) / 2 - 8;
      } else {
        const sx = source.x + source.width / 2;
        const sy = source.y + source.height;
        const tx = target.x + target.width / 2;
        const ty = target.y;
        const my = (sy + ty) / 2;
        path = `M ${sx} ${sy} C ${sx} ${my}, ${tx} ${my}, ${tx} ${ty}`;
        labelX = (sx + tx) / 2; labelY = my - 8;
      }

      edges.push({
        id: `${dep.id}⇢${orig.id}`, sourceId: dep.id, targetId: orig.id,
        path, relation, labelX, labelY,
        color: style.color, dashed: style.dashed, isCrossRef: true,
      });
    }
  }
  return edges;
}

// ── Status colors ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<DependencyNodeStatus, { bg: string; border: string; text: string }> = {
  default: { bg: 'var(--color-neutral-50)', border: 'var(--color-neutral-300)', text: 'var(--color-neutral-900)' },
  active:  { bg: 'var(--color-primary-50)', border: 'var(--color-primary-400)', text: 'var(--color-primary-700)' },
  success: { bg: 'var(--color-success-50, #f0fdf4)', border: 'var(--color-success-default)', text: 'var(--color-success-700, #15803d)' },
  warning: { bg: 'var(--color-warning-50, #fffbeb)', border: 'var(--color-warning-default)', text: 'var(--color-warning-700, #a16207)' },
  error:   { bg: 'var(--color-error-50, #fef2f2)', border: 'var(--color-error-default)', text: 'var(--color-error-700, #b91c1c)' },
  muted:   { bg: 'var(--color-neutral-100)', border: 'var(--color-neutral-200)', text: 'var(--color-neutral-400)' },
};

/**
 * Dependency viewer component for visualizing hierarchical and cross-cutting relationships.
 *
 * Features:
 * - Horizontal (left-to-right) and vertical (top-to-bottom) layout directions
 * - Bidirectional dependencies: children (right/down) and dependsOn (cross-references)
 * - Relationship types: depends, blocks, references, requires, extends, implements, uses
 * - Edge labels showing relationship type
 * - Dashed vs solid edges per relationship category
 * - Color-coded edges per relationship type
 * - Node status colors (default, active, success, warning, error, muted)
 * - Pan and zoom controls with mouse wheel support
 * - Collapsible sub-trees
 * - Interactive node selection with detail panel
 * - Legend showing active relationship types
 * - SVG arrowhead markers on cross-reference edges
 * - Dark/light theme support
 *
 * @example
 * ```html
 * <lc-dependency-viewer [root]="specTree" direction="horizontal" />
 * ```
 */
@Component({
  selector: 'lc-dependency-viewer',
  standalone: true,
  templateUrl: './dependency-viewer.component.html',
  styleUrls: ['./dependency-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"dep-viewer"', '[style.height]': 'height()' },
})
export class DependencyViewerComponent {
  readonly root = input.required<DependencyNode>();
  readonly direction = input<DependencyDirection>('horizontal');
  readonly height = input('500px');
  readonly showToolbar = input(true);
  readonly showEdgeLabels = input(true);
  readonly edgeWidth = input(1.5);

  protected zoom = signal(100);
  protected panX = signal(40);
  protected panY = signal(40);
  protected selectedNodeId = signal<string | null>(null);
  protected collapsedIds = signal<Set<string>>(new Set());

  private isPanning = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  protected effectiveRoot = computed<DependencyNode>(() =>
    this.pruneCollapsed(this.root(), this.collapsedIds())
  );

  private allOriginalNodes = computed(() => {
    const map = new Map<string, DependencyNode>();
    collectAllNodes(this.root(), map);
    return map;
  });

  protected layout = computed(() => {
    const root = this.effectiveRoot();
    const dir = this.direction();
    const measured = measureTree(root, 0, dir);
    const nodes: LayoutNode[] = [];
    const treeEdges: LayoutEdge[] = [];
    const allNodes = this.allOriginalNodes();

    if (dir === 'horizontal') {
      layoutTreeH(measured, 0, 0, null, nodes, treeEdges, allNodes);
    } else {
      layoutTreeV(measured, 0, 0, null, nodes, treeEdges, allNodes);
    }

    const crossEdges = createCrossRefEdges(nodes, allNodes, dir);
    return {
      nodes,
      edges: [...treeEdges, ...crossEdges],
      width: dir === 'horizontal' ? measured.primary : measured.secondary,
      height: dir === 'horizontal' ? measured.secondary : measured.primary,
    };
  });

  protected svgWidth = computed(() => this.layout().width + 80);
  protected svgHeight = computed(() => this.layout().height + 80);
  protected viewBox = computed(() => `0 0 ${this.svgWidth()} ${this.svgHeight()}`);
  protected transform = computed(() => {
    const z = this.zoom() / 100;
    return `translate(${this.panX()}px, ${this.panY()}px) scale(${z})`;
  });

  protected selectedNode = computed<LayoutNode | null>(() => {
    const id = this.selectedNodeId();
    if (!id) return null;
    return this.layout().nodes.find(n => n.id === id) ?? null;
  });

  protected selectedDependsOn = computed<DependencyEdgeDef[]>(() => {
    const id = this.selectedNodeId();
    if (!id) return [];
    return this.allOriginalNodes().get(id)?.dependsOn ?? [];
  });

  protected legendItems = computed(() => {
    const used = new Set<DependencyRelation>();
    for (const edge of this.layout().edges) {
      if (edge.relation) used.add(edge.relation);
    }
    return Array.from(used).map(r => ({
      relation: r, label: RELATION_STYLES[r].label,
      color: RELATION_STYLES[r].color, dashed: RELATION_STYLES[r].dashed,
    }));
  });

  protected hasChildren(nodeId: string): boolean {
    return !!(this.findOriginalNode(this.root(), nodeId)?.children?.length);
  }

  protected isCollapsed(nodeId: string): boolean {
    return this.collapsedIds().has(nodeId);
  }

  protected getRelationLabel(relation: DependencyRelation): string {
    return RELATION_STYLES[relation]?.label ?? relation;
  }

  private pruneCollapsed(node: DependencyNode, collapsed: Set<string>): DependencyNode {
    if (collapsed.has(node.id) || !node.children?.length) return { ...node, children: [] };
    return { ...node, children: node.children.map(c => this.pruneCollapsed(c, collapsed)) };
  }

  private findOriginalNode(node: DependencyNode, id: string): DependencyNode | null {
    if (node.id === id) return node;
    for (const child of node.children || []) {
      const found = this.findOriginalNode(child, id);
      if (found) return found;
    }
    return null;
  }

  protected selectNode(id: string, event: Event): void {
    event.stopPropagation();
    this.selectedNodeId.set(this.selectedNodeId() === id ? null : id);
  }

  protected toggleCollapse(id: string, event: Event): void {
    event.stopPropagation();
    this.collapsedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected deselectNode(): void { this.selectedNodeId.set(null); }
  protected zoomIn(): void { this.zoom.update(z => Math.min(z + 25, 300)); }
  protected zoomOut(): void { this.zoom.update(z => Math.max(z - 25, 25)); }
  protected resetZoom(): void { this.zoom.set(100); this.panX.set(40); this.panY.set(40); }

  protected onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    this.isPanning = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panX.update(x => x + event.clientX - this.lastMouseX);
    this.panY.update(y => y + event.clientY - this.lastMouseY);
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  @HostListener('document:mouseup')
  protected onMouseUp(): void { this.isPanning = false; }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.zoom.update(z => event.deltaY < 0 ? Math.min(z + 10, 300) : Math.max(z - 10, 25));
  }

  protected getNodeBg(status: DependencyNodeStatus): string { return STATUS_COLORS[status].bg; }
  protected getNodeBorder(status: DependencyNodeStatus): string { return STATUS_COLORS[status].border; }
  protected getNodeText(status: DependencyNodeStatus): string { return STATUS_COLORS[status].text; }
}
