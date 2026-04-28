import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Structure', () => {
    it('should render aside element when open', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside).toBeTruthy();
    });

    it('should not render when closed', () => {
      component.isOpen.set(false);
      fixture.detectChanges();

      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside).toBeFalsy();
    });

    it('should render overlay when open', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.lc-sidenav__overlay'));
      expect(overlay).toBeTruthy();
    });

    it('should have lc-sidenav CSS class', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const sidenav = fixture.debugElement.query(By.css('.lc-sidenav'));
      expect(sidenav).toBeTruthy();
    });
  });

  describe('Position Variants', () => {
    it('should apply left position class', () => {
      component.isOpen.set(true);
      component.position.set('left');
      fixture.detectChanges();

      const sidenav = fixture.debugElement.query(By.css('.lc-sidenav--left'));
      expect(sidenav).toBeTruthy();
    });

    it('should apply right position class', () => {
      component.isOpen.set(true);
      component.position.set('right');
      fixture.detectChanges();

      const sidenav = fixture.debugElement.query(By.css('.lc-sidenav--right'));
      expect(sidenav).toBeTruthy();
    });
  });

  describe('Open/Close State', () => {
    it('should emit close event when overlay is clicked', () => {
      const closeSpy = jest.spyOn(component.closed, 'emit');
      component.isOpen.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.lc-sidenav__overlay'));
      overlay.nativeElement.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should emit close event when close button is clicked', () => {
      const closeSpy = jest.spyOn(component.closed, 'emit');
      component.isOpen.set(true);
      fixture.detectChanges();

      const closeButton = fixture.debugElement.query(By.css('.lc-sidenav__close'));
      closeButton.nativeElement.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should call handleClose method when overlay clicked', () => {
      const handleCloseSpy = jest.spyOn(component, 'handleClose');
      component.isOpen.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.lc-sidenav__overlay'));
      overlay.nativeElement.click();

      expect(handleCloseSpy).toHaveBeenCalled();
    });
  });

  describe('Width Configuration', () => {
    it('should use default width when not specified', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      expect(component.width()).toBe('320px');
    });

    it('should use custom width when specified', () => {
      component.isOpen.set(true);
      component.width.set('400px');
      fixture.detectChanges();

      const _sidenav = fixture.debugElement.query(By.css('.lc-sidenav'));
      expect(component.width()).toBe('400px');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.isOpen.set(true);
      fixture.detectChanges();
    });

    it('should have navigation role', () => {
      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside.nativeElement.getAttribute('role')).toBe('navigation');
    });

    it('should have aria-label', () => {
      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside.nativeElement.getAttribute('aria-label')).toBe('Side navigation');
    });

    it('should use custom aria-label when provided', () => {
      component.ariaLabel.set('Custom navigation');
      fixture.detectChanges();

      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside.nativeElement.getAttribute('aria-label')).toBe('Custom navigation');
    });

    it('should have close button with aria-label', () => {
      const closeButton = fixture.debugElement.query(By.css('.lc-sidenav__close'));
      expect(closeButton.nativeElement.getAttribute('aria-label')).toContain('Close');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close on Escape key', () => {
      const closeSpy = jest.spyOn(component.closed, 'emit');
      component.isOpen.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleKeydown(event);

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close on other keys', () => {
      const closeSpy = jest.spyOn(component.closed, 'emit');
      component.isOpen.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(event);

      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Content Projection', () => {
    it('should project content into sidenav drawer', () => {
      component.isOpen.set(true);
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.lc-sidenav__content'));
      expect(content).toBeTruthy();
    });
  });

  describe('Input Bindings', () => {
    it('should update isOpen via Input', () => {
      component.isOpenInput = true;
      expect(component.isOpen()).toBe(true);
    });

    it('should update position via Input', () => {
      component.positionInput = 'right';
      expect(component.position()).toBe('right');
    });

    it('should update width via Input', () => {
      component.widthInput = '500px';
      expect(component.width()).toBe('500px');
    });

    it('should update ariaLabel via Input', () => {
      component.ariaLabelInput = 'Menu navigation';
      expect(component.ariaLabel()).toBe('Menu navigation');
    });

    it('should update hasOverlay via Input', () => {
      component.hasOverlayInput = false;
      expect(component.hasOverlay()).toBe(false);
    });
  });

  describe('Overlay Behavior', () => {
    it('should render overlay when hasOverlay is true', () => {
      component.isOpen.set(true);
      component.hasOverlay.set(true);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.lc-sidenav__overlay'));
      expect(overlay).toBeTruthy();
    });

    it('should not render overlay when hasOverlay is false', () => {
      component.isOpen.set(true);
      component.hasOverlay.set(false);
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.lc-sidenav__overlay'));
      expect(overlay).toBeFalsy();
    });
  });

  describe('Computed Classes', () => {
    it('should compute correct CSS classes for left position', () => {
      component.position.set('left');
      const classes = component.sidenavClasses();

      expect(classes).toContain('lc-sidenav');
      expect(classes).toContain('lc-sidenav--left');
    });

    it('should compute correct CSS classes for right position', () => {
      component.position.set('right');
      const classes = component.sidenavClasses();

      expect(classes).toContain('lc-sidenav');
      expect(classes).toContain('lc-sidenav--right');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close toggles', () => {
      component.isOpen.set(true);
      fixture.detectChanges();
      component.isOpen.set(false);
      fixture.detectChanges();
      component.isOpen.set(true);
      fixture.detectChanges();

      const aside = fixture.debugElement.query(By.css('aside'));
      expect(aside).toBeTruthy();
    });

    it('should handle close event when already closed', () => {
      const closeSpy = jest.spyOn(component.closed, 'emit');
      component.isOpen.set(false);
      component.handleClose();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('NavigationItem[] Extension', () => {
    const mockNavItems = [
      {
        id: 'home',
        icon: 'lc-icon-home',
        label: 'Home',
        route: '/',
        displayOrder: 1,
      },
      {
        id: 'trading',
        icon: 'lc-icon-chart',
        label: 'Trading',
        route: '/trading',
        requiredRole: 'LC.Trader',
        displayOrder: 2,
      },
    ];

    it('should accept NavigationItem[] input', () => {
      component.items.set(mockNavItems);
      expect(component.items()).toEqual(mockNavItems);
    });

    it('should render navigation items when provided', () => {
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      fixture.detectChanges();

      const navLinks = fixture.debugElement.queryAll(By.css('.lc-sidenav__nav-item'));
      expect(navLinks.length).toBe(2);
    });

    it('should display item labels', () => {
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('.lc-sidenav__nav-label');
      expect(labels[0].textContent.trim()).toBe('Home');
      expect(labels[1].textContent.trim()).toBe('Trading');
    });

    it('should render item icons', () => {
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll('.lc-sidenav__nav-icon');
      expect(icons.length).toBe(2);
    });

    it('should identify active route via isItemActive', () => {
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      component.activeRoute.set('/');
      fixture.detectChanges();

      expect(component.isItemActive(mockNavItems[0])).toBe(true);
      expect(component.isItemActive(mockNavItems[1])).toBe(false);
    });

    it('should update active state when activeRoute changes', () => {
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      component.activeRoute.set('/');
      fixture.detectChanges();

      expect(component.isItemActive(mockNavItems[0])).toBe(true);

      component.activeRoute.set('/trading');
      fixture.detectChanges();

      expect(component.isItemActive(mockNavItems[1])).toBe(true);
      expect(component.isItemActive(mockNavItems[0])).toBe(false);
    });

    it('should emit item click events', () => {
      const clickSpy = jest.spyOn(component.itemClicked, 'emit');
      component.isOpen.set(true);
      component.items.set(mockNavItems);
      fixture.detectChanges();

      const firstLink = fixture.nativeElement.querySelector('.lc-sidenav__nav-item');
      firstLink.click();

      expect(clickSpy).toHaveBeenCalledWith(mockNavItems[0]);
    });

    it('should sort items by displayOrder', () => {
      const unsortedItems = [
        { ...mockNavItems[1], displayOrder: 1 },
        { ...mockNavItems[0], displayOrder: 2 },
      ];
      component.isOpen.set(true);
      component.items.set(unsortedItems);
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('.lc-sidenav__nav-label');
      expect(labels[0].textContent.trim()).toBe('Trading');
      expect(labels[1].textContent.trim()).toBe('Home');
    });
  });
});
