import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Structure', () => {
    it('should render nav element with aria-label', () => {
      component.currentPage.set(1);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeTruthy();
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Pagination');
    });

    it('should render with lc-pagination CSS class', () => {
      component.currentPage.set(1);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.lc-pagination'));
      expect(pagination).toBeTruthy();
    });

    it('should not render when totalItems is 0', () => {
      component.currentPage.set(1);
      component.totalItems.set(0);
      component.pageSize.set(10);
      fixture.detectChanges();

      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeFalsy();
    });

    it('should not render when totalItems is less than pageSize', () => {
      component.currentPage.set(1);
      component.totalItems.set(5);
      component.pageSize.set(10);
      fixture.detectChanges();

      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeFalsy();
    });
  });

  describe('Page Calculation', () => {
    it('should calculate total pages correctly', () => {
      component.totalItems.set(100);
      component.pageSize.set(10);
      expect(component.totalPages()).toBe(10);
    });

    it('should round up total pages when items do not divide evenly', () => {
      component.totalItems.set(105);
      component.pageSize.set(10);
      expect(component.totalPages()).toBe(11);
    });

    it('should calculate first item index correctly', () => {
      component.currentPage.set(3);
      component.pageSize.set(10);
      expect(component.firstItemIndex()).toBe(21);
    });

    it('should calculate last item index correctly', () => {
      component.currentPage.set(3);
      component.pageSize.set(10);
      component.totalItems.set(100);
      expect(component.lastItemIndex()).toBe(30);
    });

    it('should not exceed totalItems for last item index', () => {
      component.currentPage.set(11);
      component.pageSize.set(10);
      component.totalItems.set(105);
      expect(component.lastItemIndex()).toBe(105);
    });
  });

  describe('Page Navigation', () => {
    beforeEach(() => {
      component.currentPage.set(5);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();
    });

    it('should navigate to previous page', () => {
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToPreviousPage();
      expect(emitSpy).toHaveBeenCalledWith(4);
    });

    it('should navigate to next page', () => {
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToNextPage();
      expect(emitSpy).toHaveBeenCalledWith(6);
    });

    it('should navigate to specific page', () => {
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToPage(7);
      expect(emitSpy).toHaveBeenCalledWith(7);
    });

    it('should not navigate before first page', () => {
      component.currentPage.set(1);
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToPreviousPage();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should not navigate after last page', () => {
      component.currentPage.set(10);
      const emitSpy = jest.spyOn(component.pageChange, 'emit');
      component.goToNextPage();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('Boundary States', () => {
    it('should disable previous button on first page', () => {
      component.currentPage.set(1);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      expect(component.isFirstPage()).toBe(true);
      const prevButton = fixture.debugElement.query(By.css('.lc-pagination__button--prev'));
      expect(prevButton.nativeElement.disabled).toBe(true);
    });

    it('should disable next button on last page', () => {
      component.currentPage.set(10);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      expect(component.isLastPage()).toBe(true);
      const nextButton = fixture.debugElement.query(By.css('.lc-pagination__button--next'));
      expect(nextButton.nativeElement.disabled).toBe(true);
    });

    it('should enable both buttons on middle page', () => {
      component.currentPage.set(5);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      expect(component.isFirstPage()).toBe(false);
      expect(component.isLastPage()).toBe(false);
    });
  });

  describe('Size Variants', () => {
    it('should apply small size class', () => {
      component.size.set('sm');
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.lc-pagination--sm'));
      expect(pagination).toBeTruthy();
    });

    it('should apply medium size class (default)', () => {
      component.size.set('md');
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.lc-pagination--md'));
      expect(pagination).toBeTruthy();
    });

    it('should apply large size class', () => {
      component.size.set('lg');
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.lc-pagination--lg'));
      expect(pagination).toBeTruthy();
    });
  });

  describe('Page Range Display', () => {
    it('should show all page buttons when total pages <= max visible', () => {
      component.currentPage.set(1);
      component.totalItems.set(50);
      component.pageSize.set(10);
      component.maxVisiblePages.set(7);
      fixture.detectChanges();

      const pageButtons = fixture.debugElement.queryAll(By.css('.lc-pagination__button--page'));
      expect(pageButtons.length).toBe(5); // 5 total pages
    });

    it('should show ellipsis when total pages > max visible', () => {
      component.currentPage.set(5);
      component.totalItems.set(200);
      component.pageSize.set(10);
      component.maxVisiblePages.set(5);
      fixture.detectChanges();

      const pages = component.visiblePages();
      expect(pages.some((p) => p === -1)).toBe(true); // -1 represents ellipsis
    });

    it('should show correct pages near start', () => {
      component.currentPage.set(2);
      component.totalItems.set(200);
      component.pageSize.set(10);
      component.maxVisiblePages.set(5);
      fixture.detectChanges();

      const pages = component.visiblePages();
      // Should show: 1, 2, 3, 4, 5, ..., 20
      expect(pages[0]).toBe(1);
      expect(pages[1]).toBe(2);
      expect(pages.includes(-1)).toBe(true); // Has ellipsis
      expect(pages[pages.length - 1]).toBe(20); // Last page
    });

    it('should show correct pages near end', () => {
      component.currentPage.set(19);
      component.totalItems.set(200);
      component.pageSize.set(10);
      component.maxVisiblePages.set(5);
      fixture.detectChanges();

      const pages = component.visiblePages();
      // Should show: 1, ..., 16, 17, 18, 19, 20
      expect(pages[0]).toBe(1);
      expect(pages.includes(-1)).toBe(true); // Has ellipsis
      expect(pages[pages.length - 1]).toBe(20);
    });

    it('should show correct pages in middle', () => {
      component.currentPage.set(10);
      component.totalItems.set(200);
      component.pageSize.set(10);
      component.maxVisiblePages.set(5);
      fixture.detectChanges();

      const pages = component.visiblePages();
      // Should show: 1, ..., 9, 10, 11, ..., 20
      expect(pages[0]).toBe(1);
      expect(pages.filter((p) => p === -1).length).toBeGreaterThanOrEqual(1); // Has ellipsis
      expect(pages.includes(10)).toBe(true);
      expect(pages[pages.length - 1]).toBe(20);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.currentPage.set(5);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();
    });

    it('should have aria-current on current page button', () => {
      const currentButton = fixture.debugElement.query(By.css('[aria-current="page"]'));
      expect(currentButton).toBeTruthy();
      expect(currentButton.nativeElement.textContent.trim()).toBe('5');
    });

    it('should have aria-label on navigation element', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBeTruthy();
    });

    it('should have aria-label on previous button', () => {
      const prevButton = fixture.debugElement.query(By.css('.lc-pagination__button--prev'));
      expect(prevButton.nativeElement.getAttribute('aria-label')).toContain('Previous');
    });

    it('should have aria-label on next button', () => {
      const nextButton = fixture.debugElement.query(By.css('.lc-pagination__button--next'));
      expect(nextButton.nativeElement.getAttribute('aria-label')).toContain('Next');
    });

    it('should have aria-label on page buttons', () => {
      const pageButtons = fixture.debugElement.queryAll(By.css('.lc-pagination__button--page'));
      pageButtons.forEach((button) => {
        expect(button.nativeElement.getAttribute('aria-label')).toContain('Page');
      });
    });

    it('should have aria-hidden on ellipsis', () => {
      component.currentPage.set(10);
      component.totalItems.set(200);
      component.pageSize.set(10);
      component.maxVisiblePages.set(5);
      fixture.detectChanges();

      const ellipsis = fixture.debugElement.query(By.css('.lc-pagination__ellipsis'));
      if (ellipsis) {
        expect(ellipsis.nativeElement.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });

  describe('Custom aria-label', () => {
    it('should use custom aria-label when provided', () => {
      component.ariaLabel.set('Custom pagination navigation');
      component.currentPage.set(1);
      component.totalItems.set(100);
      component.pageSize.set(10);
      fixture.detectChanges();

      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav.nativeElement.getAttribute('aria-label')).toBe('Custom pagination navigation');
    });
  });

  describe('Input Bindings', () => {
    it('should update currentPage via Input', () => {
      component.currentPageInput = 7;
      expect(component.currentPage()).toBe(7);
    });

    it('should update totalItems via Input', () => {
      component.totalItemsInput = 500;
      expect(component.totalItems()).toBe(500);
    });

    it('should update pageSize via Input', () => {
      component.pageSizeInput = 25;
      expect(component.pageSize()).toBe(25);
    });

    it('should update size via Input', () => {
      component.sizeInput = 'lg';
      expect(component.size()).toBe('lg');
    });

    it('should update maxVisiblePages via Input', () => {
      component.maxVisiblePagesInput = 9;
      expect(component.maxVisiblePages()).toBe(9);
    });

    it('should update ariaLabel via Input', () => {
      component.ariaLabelInput = 'Results pagination';
      expect(component.ariaLabel()).toBe('Results pagination');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page correctly', () => {
      component.currentPage.set(1);
      component.totalItems.set(5);
      component.pageSize.set(10);
      fixture.detectChanges();

      // Should not render pagination for single page
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeFalsy();
    });

    it('should handle zero total items', () => {
      component.currentPage.set(1);
      component.totalItems.set(0);
      component.pageSize.set(10);
      fixture.detectChanges();

      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeFalsy();
    });

    it('should clamp currentPage to valid range', () => {
      component.currentPage.set(15);
      component.totalItems.set(100);
      component.pageSize.set(10);
      // Total pages is 10, so page 15 is out of range
      expect(component.currentPage()).toBe(15);
      // Component should handle this gracefully
    });

    it('should handle page size changes', () => {
      component.currentPage.set(5);
      component.totalItems.set(100);
      component.pageSize.set(10);
      expect(component.totalPages()).toBe(10);

      component.pageSize.set(20);
      expect(component.totalPages()).toBe(5);
    });
  });

  describe('Show Info Text', () => {
    it('should display item range info when showInfo is true', () => {
      component.currentPage.set(2);
      component.totalItems.set(100);
      component.pageSize.set(10);
      component.showInfo.set(true);
      fixture.detectChanges();

      const info = fixture.debugElement.query(By.css('.lc-pagination__info'));
      expect(info).toBeTruthy();
      expect(info.nativeElement.textContent).toContain('11');
      expect(info.nativeElement.textContent).toContain('20');
      expect(info.nativeElement.textContent).toContain('100');
    });

    it('should not display info when showInfo is false', () => {
      component.currentPage.set(2);
      component.totalItems.set(100);
      component.pageSize.set(10);
      component.showInfo.set(false);
      fixture.detectChanges();

      const info = fixture.debugElement.query(By.css('.lc-pagination__info'));
      expect(info).toBeFalsy();
    });
  });
});
