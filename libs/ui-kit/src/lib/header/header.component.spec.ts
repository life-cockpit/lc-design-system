import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
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

    it('should accept profileUrl input with default value', () => {
      expect(component.profileUrl).toBe('https://profile.life-cockpit.de');
    });

    it('should accept custom profileUrl input', () => {
      component.profileUrl = 'https://custom.com';
      expect(component.profileUrl).toBe('https://custom.com');
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
    it('should render logo when provided', () => {
      fixture.componentRef.setInput('logo', '/assets/logo.svg');
      fixture.detectChanges();
      const logo = fixture.nativeElement.querySelector('.lc-header__logo img');
      expect(logo).toBeTruthy();
      expect(logo.getAttribute('src')).toBe('/assets/logo.svg');
    });

    it('should render hamburger icon when showHamburger is true', () => {
      fixture.componentRef.setInput('showHamburger', true);
      fixture.detectChanges();
      const hamburger = fixture.nativeElement.querySelector('.lc-header__hamburger');
      expect(hamburger).toBeTruthy();
    });

    it('should not render hamburger icon when showHamburger is false', () => {
      component.showHamburger = false;
      fixture.detectChanges();
      const hamburger = fixture.nativeElement.querySelector('.lc-header__hamburger');
      expect(hamburger).toBeFalsy();
    });

    it('should render user email in profile dropdown', () => {
      component.userEmail = 'test@example.com';
      component.toggleDropdown();
      fixture.detectChanges();
      const email = fixture.nativeElement.querySelector('.lc-header__profile-email');
      expect(email?.textContent).toContain('test@example.com');
    });

    it('should render Profile link in dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      const profileLink = fixture.nativeElement.querySelector('.lc-header__profile-link');
      expect(profileLink).toBeTruthy();
      expect(profileLink.textContent).toContain('Profile');
    });

    it('should render Logout button in dropdown', () => {
      component.toggleDropdown();
      fixture.detectChanges();
      const logoutBtn = fixture.nativeElement.querySelector('.lc-header__logout-btn');
      expect(logoutBtn).toBeTruthy();
      expect(logoutBtn.textContent).toContain('Logout');
    });
  });
});
