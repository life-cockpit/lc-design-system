import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('should accept logo input', () => {
      component.logo = '/assets/logo.svg';
      expect(component.logo).toBe('/assets/logo.svg');
    });

    it('should accept userEmail input', () => {
      component.userEmail = 'test@example.com';
      expect(component.userEmail).toBe('test@example.com');
    });

    it('should accept showHamburger input', () => {
      component.showHamburger = true;
      expect(component.showHamburger).toBe(true);
    });
  });

  describe('Outputs', () => {
    it('should emit hamburgerClick event', (done) => {
      component.hamburgerClick.subscribe(() => {
        expect(true).toBe(true);
        done();
      });
      component.onHamburgerClick();
    });

    it('should emit logoutClick event', (done) => {
      component.logoutClick.subscribe(() => {
        expect(true).toBe(true);
        done();
      });
      component.onLogoutClick();
    });
  });

  describe('Dropdown interactions', () => {
    it('should toggle dropdown open state', () => {
      expect(component.isDropdownOpen()).toBe(false);
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(true);
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(false);
    });

    it('should close dropdown', () => {
      component.toggleDropdown();
      expect(component.isDropdownOpen()).toBe(true);
      component.closeDropdown();
      expect(component.isDropdownOpen()).toBe(false);
    });
  });

  describe('Rendering', () => {
    it('should render brand area with logo component', () => {
      fixture.componentRef.setInput('logo', '/assets/logo.svg');
      fixture.detectChanges();
      const brand = fixture.nativeElement.querySelector('.lc-header__logo');
      expect(brand).toBeTruthy();
    });

    it('should render hamburger icon when showHamburger is true', () => {
      fixture.componentRef.setInput('showHamburger', true);
      fixture.detectChanges();
      const hamburger = fixture.nativeElement.querySelector('.lc-header__hamburger');
      expect(hamburger).toBeTruthy();
    });

    it('should not render hamburger icon when showHamburger is false', () => {
      fixture.componentRef.setInput('showHamburger', false);
      fixture.detectChanges();
      const hamburger = fixture.nativeElement.querySelector('.lc-header__hamburger');
      expect(hamburger).toBeFalsy();
    });

    it('should render user email in menu header when dropdown is open', () => {
      component.userEmail = 'test@example.com';
      component.toggleDropdown();
      fixture.detectChanges();
      const email = fixture.nativeElement.querySelector('.lc-header__menu-user-email');
      expect(email?.textContent).toContain('test@example.com');
    });

    it('should render menu items when dropdown is open', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      const menuItems = component.menuItems();
      expect(menuItems.length).toBeGreaterThan(0);
      expect(menuItems.some(item => item.id === 'logout')).toBe(true);
    });

    it('should include Profile menu item by default', () => {
      const items = component.menuItems();
      expect(items.some(item => item.id === 'profile')).toBe(true);
    });
  });
});
