import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent, BreadcrumbItem } from './breadcrumbs.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  const mockItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Electronics', url: '/products/electronics' },
    { label: 'Laptops' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Structure', () => {
    it('should render nav element with aria-label', () => {
      component.items.set(mockItems);
      fixture.detectChanges();
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeTruthy();
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Breadcrumbs');
    });

    it('should render ol element with lc-breadcrumbs CSS class', () => {
      component.items.set(mockItems);
      fixture.detectChanges();
      const ol = fixture.debugElement.query(By.css('ol'));
      expect(ol).toBeTruthy();
      expect(ol.nativeElement.classList.contains('lc-breadcrumbs')).toBe(true);
    });

    it('should not render when items are empty', () => {
      component.items.set([]);
      fixture.detectChanges();
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeFalsy();
    });
  });

  describe('Breadcrumb Items', () => {
    beforeEach(() => {
      component.items.set(mockItems);
      fixture.detectChanges();
    });

    it('should render all breadcrumb items', () => {
      const listItems = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__item'));
      expect(listItems.length).toBe(4);
    });

    it('should render links for items with url', () => {
      const links = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__link'));
      expect(links.length).toBe(3); // First 3 items have URLs
    });

    it('should render current page without link', () => {
      const currentPage = fixture.debugElement.query(By.css('.lc-breadcrumbs__current'));
      expect(currentPage).toBeTruthy();
      expect(currentPage.nativeElement.textContent.trim()).toBe('Laptops');
    });

    it('should apply aria-current to last item', () => {
      const listItems = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__item'));
      const lastItem = listItems[listItems.length - 1];
      const currentPage = lastItem?.query(By.css('.lc-breadcrumbs__current'));
      expect(currentPage?.nativeElement.getAttribute('aria-current')).toBe('page');
    });

    it('should display correct labels', () => {
      const links = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__link'));
      expect(links[0]?.nativeElement.textContent.trim()).toBe('Home');
      expect(links[1]?.nativeElement.textContent.trim()).toBe('Products');
      expect(links[2]?.nativeElement.textContent.trim()).toBe('Electronics');
    });

    it('should have correct href attributes', () => {
      const links = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__link'));
      expect(links[0]?.nativeElement.getAttribute('href')).toBe('/');
      expect(links[1]?.nativeElement.getAttribute('href')).toBe('/products');
      expect(links[2]?.nativeElement.getAttribute('href')).toBe('/products/electronics');
    });
  });

  describe('Separators', () => {
    beforeEach(() => {
      component.items.set(mockItems);
      fixture.detectChanges();
    });

    it('should render separators between items', () => {
      const separators = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__separator'));
      // 4 items = 3 separators
      expect(separators.length).toBe(3);
    });

    it('should default to / separator', () => {
      const separators = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__separator'));
      expect(separators[0]?.nativeElement.textContent.trim()).toBe('/');
    });

    it('should use custom separator when provided', () => {
      component.separator.set('>');
      fixture.detectChanges();
      const separators = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__separator'));
      expect(separators[0]?.nativeElement.textContent.trim()).toBe('>');
    });

    it('should have aria-hidden on separators', () => {
      const separators = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__separator'));
      expect(separators[0]?.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Max Items', () => {
    it('should show all items when maxItems is 0', () => {
      component.items.set(mockItems);
      component.maxItems.set(0);
      fixture.detectChanges();
      const listItems = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__item'));
      expect(listItems.length).toBe(4);
    });

    it('should collapse middle items when exceeding maxItems', () => {
      component.items.set(mockItems);
      component.maxItems.set(3);
      fixture.detectChanges();
      const listItems = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__item'));
      // First + ellipsis + last = 3
      expect(listItems.length).toBe(3);
    });

    it('should show ellipsis when items are collapsed', () => {
      component.items.set(mockItems);
      component.maxItems.set(3);
      fixture.detectChanges();
      const ellipsis = fixture.debugElement.query(By.css('.lc-breadcrumbs__ellipsis'));
      expect(ellipsis).toBeTruthy();
      expect(ellipsis.nativeElement.textContent.trim()).toBe('...');
    });

    it('should keep first and last items visible when collapsed', () => {
      component.items.set(mockItems);
      component.maxItems.set(3);
      fixture.detectChanges();
      const links = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__link'));
      const currentPage = fixture.debugElement.query(By.css('.lc-breadcrumbs__current'));
      expect(links[0]?.nativeElement.textContent.trim()).toBe('Home');
      expect(currentPage.nativeElement.textContent.trim()).toBe('Laptops');
    });
  });

  describe('Size Variants', () => {
    beforeEach(() => {
      component.items.set(mockItems);
    });

    it('should default to md size', () => {
      expect(component.size()).toBe('md');
    });

    it('should apply sm size class', () => {
      component.size.set('sm');
      fixture.detectChanges();
      const ol = fixture.debugElement.query(By.css('ol'));
      expect(ol.nativeElement.classList.contains('lc-breadcrumbs--sm')).toBe(true);
    });

    it('should apply md size class', () => {
      component.size.set('md');
      fixture.detectChanges();
      const ol = fixture.debugElement.query(By.css('ol'));
      expect(ol.nativeElement.classList.contains('lc-breadcrumbs--md')).toBe(true);
    });

    it('should apply lg size class', () => {
      component.size.set('lg');
      fixture.detectChanges();
      const ol = fixture.debugElement.query(By.css('ol'));
      expect(ol.nativeElement.classList.contains('lc-breadcrumbs--lg')).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should compute breadcrumbClasses with size', () => {
      component.size.set('sm');
      const classes = component.breadcrumbClasses();
      expect(classes).toContain('lc-breadcrumbs');
      expect(classes).toContain('lc-breadcrumbs--sm');
    });

    it('should compute visibleItems when maxItems is 0', () => {
      component.items.set(mockItems);
      component.maxItems.set(0);
      const visible = component.visibleItems();
      expect(visible.length).toBe(4);
      expect(visible).toEqual(mockItems);
    });

    it('should compute visibleItems with ellipsis when exceeding maxItems', () => {
      component.items.set(mockItems);
      component.maxItems.set(3);
      const visible = component.visibleItems();
      expect(visible.length).toBe(3);
      expect(visible[0]?.label).toBe('Home');
      expect(visible[1]?.label).toBe('...');
      expect(visible[2]?.label).toBe('Laptops');
    });
  });

  describe('Input Setters', () => {
    it('should accept itemsInput and update items signal', () => {
      const testItems: BreadcrumbItem[] = [{ label: 'A', url: '/a' }, { label: 'B' }];
      component.itemsInput = testItems;
      fixture.detectChanges();
      expect(component.items()).toEqual(testItems);
    });

    it('should accept separatorInput and update separator signal', () => {
      component.separatorInput = '>';
      expect(component.separator()).toBe('>');
    });

    it('should accept maxItemsInput and update maxItems signal', () => {
      component.maxItemsInput = 5;
      expect(component.maxItems()).toBe(5);
    });

    it('should accept sizeInput and update size signal', () => {
      component.sizeInput = 'lg';
      expect(component.size()).toBe('lg');
    });

    it('should accept ariaLabelInput and update ariaLabel signal', () => {
      component.ariaLabelInput = 'Custom Navigation';
      expect(component.ariaLabel()).toBe('Custom Navigation');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.items.set(mockItems);
      fixture.detectChanges();
    });

    it('should have role on links', () => {
      const links = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__link'));
      links.forEach((link) => {
        expect(link.nativeElement.hasAttribute('href')).toBe(true);
      });
    });

    it('should have proper list structure', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      const ol = nav.query(By.css('ol'));
      const lis = ol.queryAll(By.css('li'));
      expect(lis.length).toBe(4);
    });

    it('should allow custom aria-label', () => {
      component.ariaLabel.set('Site Navigation');
      fixture.detectChanges();
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Site Navigation');
    });
  });

  describe('Content Projection', () => {
    @Component({
      standalone: true,
      imports: [BreadcrumbsComponent],
      template: `
        <lc-breadcrumbs [itemsInput]="items">
          <div class="custom-content">Custom Content</div>
        </lc-breadcrumbs>
      `,
      changeDetection: ChangeDetectionStrategy.OnPush,
    })
    class TestHostComponent {
      items: BreadcrumbItem[] = [{ label: 'Home', url: '/' }, { label: 'About' }];
    }

    it('should support content projection', () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      const customContent = hostFixture.debugElement.query(By.css('.custom-content'));
      expect(customContent).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item', () => {
      component.items.set([{ label: 'Home' }]);
      fixture.detectChanges();
      const listItems = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__item'));
      expect(listItems.length).toBe(1);
      const separators = fixture.debugElement.queryAll(By.css('.lc-breadcrumbs__separator'));
      expect(separators.length).toBe(0);
    });

    it('should handle items with special characters', () => {
      component.items.set([
        { label: 'Home & Garden', url: '/home-garden' },
        { label: 'Tools <&> Equipment' },
      ]);
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('.lc-breadcrumbs__link'));
      const currentPage = fixture.debugElement.query(By.css('.lc-breadcrumbs__current'));
      expect(link.nativeElement.textContent).toContain('Home & Garden');
      expect(currentPage.nativeElement.textContent).toContain('Tools <&> Equipment');
    });

    it('should handle very long labels gracefully', () => {
      const longLabel = 'A'.repeat(100);
      component.items.set([{ label: longLabel, url: '/' }, { label: 'Short' }]);
      fixture.detectChanges();
      const link = fixture.debugElement.query(By.css('.lc-breadcrumbs__link'));
      expect(link.nativeElement.textContent.trim()).toBe(longLabel);
    });
  });
});
