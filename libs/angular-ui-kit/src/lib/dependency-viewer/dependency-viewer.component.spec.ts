import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DependencyViewerComponent, DependencyNode, DependencyDirection } from './dependency-viewer.component';

@Component({
  standalone: true,
  imports: [DependencyViewerComponent],
  template: `<lc-dependency-viewer
    [root]="root()"
    [direction]="direction()"
    [showToolbar]="showToolbar()"
    [showEdgeLabels]="showEdgeLabels()"
  />`,
})
class TestHost {
  root = signal<DependencyNode>({
    id: 'root',
    label: 'Root',
    children: [
      { id: 'a', label: 'A', status: 'success' },
      {
        id: 'b',
        label: 'B',
        status: 'warning',
        children: [{ id: 'b1', label: 'B1' }],
      },
    ],
  });
  direction = signal<DependencyDirection>('horizontal');
  showToolbar = signal(true);
  showEdgeLabels = signal(true);
}

describe('DependencyViewerComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  // ── Basic rendering ────────────────────────────────────────────

  it('should create the component', () => {
    expect(el.querySelector('lc-dependency-viewer')).toBeTruthy();
  });

  it('should render nodes for all items', () => {
    const nodes = el.querySelectorAll('.dep-viewer__node');
    expect(nodes.length).toBe(4); // root, a, b, b1
  });

  it('should render tree edges', () => {
    const edges = el.querySelectorAll('.dep-viewer__edge');
    expect(edges.length).toBe(3); // root→a, root→b, b→b1
  });

  it('should show node labels', () => {
    const labels = el.querySelectorAll('.dep-viewer__node-label');
    const texts = Array.from(labels).map(l => l.textContent?.trim());
    expect(texts).toContain('Root');
    expect(texts).toContain('A');
    expect(texts).toContain('B');
    expect(texts).toContain('B1');
  });

  // ── Toolbar ──────────────────────────────────────────────────

  it('should show toolbar by default', () => {
    expect(el.querySelector('.dep-viewer__toolbar')).toBeTruthy();
  });

  it('should hide toolbar when showToolbar is false', () => {
    host.showToolbar.set(false);
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__toolbar')).toBeFalsy();
  });

  it('should show direction indicator', () => {
    const label = el.querySelector('.dep-viewer__direction-label');
    expect(label?.textContent?.trim()).toBe('→');
  });

  // ── Zoom ───────────────────────────────────────────────────

  it('should show initial zoom at 100%', () => {
    const z = el.querySelector('.dep-viewer__zoom');
    expect(z?.textContent?.trim()).toBe('100%');
  });

  it('should zoom in when + clicked', () => {
    const btns = el.querySelectorAll('.dep-viewer__btn');
    (btns[0] as HTMLElement).click();
    fixture.detectChanges();
    const z = el.querySelector('.dep-viewer__zoom');
    expect(z?.textContent?.trim()).toBe('125%');
  });

  it('should zoom out when − clicked', () => {
    const btns = el.querySelectorAll('.dep-viewer__btn');
    (btns[1] as HTMLElement).click();
    fixture.detectChanges();
    const z = el.querySelector('.dep-viewer__zoom');
    expect(z?.textContent?.trim()).toBe('75%');
  });

  // ── Node selection ─────────────────────────────────────────

  it('should show detail panel on node click', () => {
    expect(el.querySelector('.dep-viewer__detail')).toBeFalsy();
    const node = el.querySelector('.dep-viewer__node') as SVGElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__detail')).toBeTruthy();
  });

  it('should deselect on canvas click', () => {
    const node = el.querySelector('.dep-viewer__node') as SVGElement;
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__detail')).toBeTruthy();
    const canvas = el.querySelector('.dep-viewer__canvas') as HTMLElement;
    canvas.click();
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__detail')).toBeFalsy();
  });

  // ── Collapse/expand ────────────────────────────────────────

  it('should show collapse toggle for nodes with children', () => {
    const toggles = el.querySelectorAll('.dep-viewer__toggle');
    // root (has children) and b (has children)
    expect(toggles.length).toBe(2);
  });

  it('should collapse subtree on toggle click', () => {
    expect(el.querySelectorAll('.dep-viewer__node').length).toBe(4);
    const toggle = el.querySelectorAll('.dep-viewer__toggle')[1] as SVGElement;
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    // B1 should be gone
    expect(el.querySelectorAll('.dep-viewer__node').length).toBe(3);
  });

  it('should re-expand subtree on second toggle click', () => {
    const toggle = el.querySelectorAll('.dep-viewer__toggle')[1] as SVGElement;
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelectorAll('.dep-viewer__node').length).toBe(3);
    toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelectorAll('.dep-viewer__node').length).toBe(4);
  });

  // ── Vertical direction ─────────────────────────────────────

  it('should render in vertical mode', () => {
    host.direction.set('vertical');
    fixture.detectChanges();
    const label = el.querySelector('.dep-viewer__direction-label');
    expect(label?.textContent?.trim()).toBe('↓');
    expect(el.querySelectorAll('.dep-viewer__node').length).toBe(4);
  });

  it('should place toggle below node in vertical mode', () => {
    host.direction.set('vertical');
    fixture.detectChanges();
    const toggleCircle = el.querySelector('.dep-viewer__toggle circle') as SVGCircleElement;
    const nodeRect = el.querySelector('.dep-viewer__node rect') as SVGRectElement;
    const cy = parseFloat(toggleCircle.getAttribute('cy')!);
    const nodeY = parseFloat(nodeRect.getAttribute('y')!);
    const nodeH = parseFloat(nodeRect.getAttribute('height')!);
    expect(cy).toBeGreaterThan(nodeY + nodeH - 1);
  });

  // ── Cross-reference edges (dependsOn) ──────────────────────

  it('should render cross-reference edges', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'blocks' }] },
      ],
    });
    fixture.detectChanges();
    const crossEdges = el.querySelectorAll('.dep-viewer__edge--cross-ref');
    expect(crossEdges.length).toBe(1);
  });

  it('should show edge labels for cross-reference edges', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'references' }] },
      ],
    });
    fixture.detectChanges();
    const labels = el.querySelectorAll('.dep-viewer__edge-label');
    expect(labels.length).toBe(1);
    expect(labels[0].textContent?.trim()).toBe('references');
  });

  it('should hide edge labels when showEdgeLabels is false', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'blocks' }] },
      ],
    });
    host.showEdgeLabels.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.dep-viewer__edge-label').length).toBe(0);
  });

  it('should show dashed edges for referencing relations', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'references' }] },
      ],
    });
    fixture.detectChanges();
    const crossEdge = el.querySelector('.dep-viewer__edge--cross-ref') as SVGPathElement;
    expect(crossEdge.getAttribute('stroke-dasharray')).toBe('6 3');
  });

  // ── Legend ─────────────────────────────────────────────────

  it('should show legend when cross-reference edges exist', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'blocks' }] },
      ],
    });
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__legend')).toBeTruthy();
    const items = el.querySelectorAll('.dep-viewer__legend-text');
    expect(items.length).toBe(1);
    expect(items[0].textContent?.trim()).toBe('blocks');
  });

  it('should not show legend when no cross-reference edges', () => {
    fixture.detectChanges();
    expect(el.querySelector('.dep-viewer__legend')).toBeFalsy();
  });

  // ── Detail panel with dependencies ────────────────────────

  it('should show dependency info in detail panel', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      description: 'The root node',
      children: [
        { id: 'a', label: 'A' },
        {
          id: 'b',
          label: 'B',
          dependsOn: [{ id: 'a', relation: 'requires' }],
        },
      ],
    });
    fixture.detectChanges();

    // Click on node B
    const nodes = el.querySelectorAll('.dep-viewer__node');
    const nodeB = Array.from(nodes).find(n => n.querySelector('.dep-viewer__node-label')?.textContent?.trim() === 'B');
    nodeB!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const detail = el.querySelector('.dep-viewer__detail');
    expect(detail).toBeTruthy();
    expect(detail!.querySelector('.dep-viewer__detail-deps')).toBeTruthy();
    expect(detail!.querySelector('.dep-viewer__dep-relation')?.textContent?.trim()).toBe('requires');
  });

  // ── Status colors ─────────────────────────────────────────

  it('should apply status-specific fill to nodes', () => {
    const rects = el.querySelectorAll('.dep-viewer__node rect');
    const firstFill = rects[0].getAttribute('fill');
    expect(firstFill).toBeTruthy();
    // Second node (A) has status 'success'
    const secondFill = rects[1].getAttribute('fill');
    expect(secondFill).toBeTruthy();
    expect(firstFill).not.toBe(secondFill);
  });

  // ── Cross-refs in vertical mode ────────────────────────────

  it('should render cross-refs in vertical direction', () => {
    host.direction.set('vertical');
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'uses' }] },
      ],
    });
    fixture.detectChanges();
    expect(el.querySelectorAll('.dep-viewer__edge--cross-ref').length).toBe(1);
  });

  // ── Arrow markers ─────────────────────────────────────────

  it('should have arrowhead marker on cross-reference edges', () => {
    host.root.set({
      id: 'root',
      label: 'Root',
      children: [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B', dependsOn: [{ id: 'a', relation: 'blocks' }] },
      ],
    });
    fixture.detectChanges();
    const crossEdge = el.querySelector('.dep-viewer__edge--cross-ref') as SVGPathElement;
    expect(crossEdge.getAttribute('marker-end')).toContain('arrow-blocks');
  });

  it('should not have arrowhead on tree edges', () => {
    const treeEdges = el.querySelectorAll('.dep-viewer__edge:not(.dep-viewer__edge--cross-ref)');
    for (const edge of Array.from(treeEdges)) {
      const marker = edge.getAttribute('marker-end');
      expect(!marker || marker === '').toBeTruthy();
    }
  });
});
