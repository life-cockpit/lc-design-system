import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ErrorDisplayComponent } from './error-display.component';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Error Message Mapping', () => {
    it('should map Cognito UsernameExistsException', () => {
      fixture.componentRef.setInput('error', { code: 'UsernameExistsException' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('An account with this email already exists.');
    });

    it('should map Cognito UserNotFoundException', () => {
      fixture.componentRef.setInput('error', { code: 'UserNotFoundException' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('No account found with this email address.');
    });

    it('should map Cognito NotAuthorizedException', () => {
      fixture.componentRef.setInput('error', { code: 'NotAuthorizedException' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('Incorrect email or password.');
    });

    it('should map Cognito CodeMismatchException', () => {
      fixture.componentRef.setInput('error', { code: 'CodeMismatchException' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('Invalid verification code. Please try again.');
    });

    it('should use error message if no code mapping found', () => {
      fixture.componentRef.setInput('error', { message: 'Custom error message' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('Custom error message');
    });

    it('should use custom message over error object', () => {
      fixture.componentRef.setInput('error', { code: 'UserNotFoundException' });
      fixture.componentRef.setInput('message', 'Custom override');
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('Custom override');
    });

    it('should show unknown error for unmapped codes', () => {
      fixture.componentRef.setInput('error', { code: 'UnknownErrorCode123' });
      fixture.detectChanges();
      expect(component['errorMessage']()).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('Visibility', () => {
    it('should be hidden when no error', () => {
      expect(component['visible']()).toBe(false);
    });

    it('should be visible when error is set', () => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.detectChanges();
      expect(component['visible']()).toBe(true);
    });

    it('should be visible when custom message is set', () => {
      fixture.componentRef.setInput('message', 'Test error');
      fixture.detectChanges();
      expect(component['visible']()).toBe(true);
    });

    it('should hide when dismissed', () => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.detectChanges();
      expect(component['visible']()).toBe(true);

      component['onDismissed']();
      expect(component['visible']()).toBe(false);
    });
  });

  describe('Severity Mapping', () => {
    it('should map error severity to error variant', () => {
      fixture.componentRef.setInput('severity', 'error');
      fixture.detectChanges();
      expect(component['alertVariant']()).toBe('error');
    });

    it('should map warning severity to warning variant', () => {
      fixture.componentRef.setInput('severity', 'warning');
      fixture.detectChanges();
      expect(component['alertVariant']()).toBe('warning');
    });

    it('should map info severity to info variant', () => {
      fixture.componentRef.setInput('severity', 'info');
      fixture.detectChanges();
      expect(component['alertVariant']()).toBe('info');
    });
  });

  describe('Title', () => {
    it('should use custom title when provided', () => {
      fixture.componentRef.setInput('title', 'Custom Title');
      fixture.detectChanges();
      expect(component['errorTitle']()).toBe('Custom Title');
    });

    it('should default to "Error" for error severity', () => {
      fixture.componentRef.setInput('severity', 'error');
      fixture.detectChanges();
      expect(component['errorTitle']()).toBe('Error');
    });

    it('should default to "Warning" for warning severity', () => {
      fixture.componentRef.setInput('severity', 'warning');
      fixture.detectChanges();
      expect(component['errorTitle']()).toBe('Warning');
    });

    it('should default to "Information" for info severity', () => {
      fixture.componentRef.setInput('severity', 'info');
      fixture.detectChanges();
      expect(component['errorTitle']()).toBe('Information');
    });
  });

  describe('Auto Dismiss', () => {
    it('should auto-dismiss after delay when enabled', fakeAsync(() => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.componentRef.setInput('autoDismiss', true);
      fixture.componentRef.setInput('autoDismissDelay', 1000);
      fixture.detectChanges();

      expect(component['visible']()).toBe(true);

      tick(1000);
      expect(component['visible']()).toBe(false);
    }));

    it('should not auto-dismiss when disabled', fakeAsync(() => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.componentRef.setInput('autoDismiss', false);
      fixture.detectChanges();

      expect(component['visible']()).toBe(true);

      tick(10000);
      expect(component['visible']()).toBe(true);
    }));
  });

  describe('Public Methods', () => {
    it('should show error when show() is called', () => {
      component.show();
      expect(component['visible']()).toBe(true);
    });

    it('should hide error when hide() is called', () => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.detectChanges();
      expect(component['visible']()).toBe(true);

      component.hide();
      expect(component['visible']()).toBe(false);
    });

    it('should clear auto-dismiss timer when hide() is called', fakeAsync(() => {
      fixture.componentRef.setInput('error', { message: 'Test error' });
      fixture.componentRef.setInput('autoDismiss', true);
      fixture.componentRef.setInput('autoDismissDelay', 1000);
      fixture.detectChanges();

      component.hide();
      tick(1000);

      // Should stay hidden and not auto-show again
      expect(component['visible']()).toBe(false);
    }));
  });
});
