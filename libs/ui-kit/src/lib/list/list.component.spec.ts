import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const MOCK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let listElement: HTMLElement;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    listElement = fixture.nativeElement;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    const pendingRequests = httpMock.match(() => true);
    pendingRequests.forEach((req) => {
      if (!req.cancelled) {
        req.flush(MOCK_SVG);
      }
    });
    httpMock.verify();
  });

  describe('Component Structure', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render with lc-list class', () => {
      const list = listElement.querySelector('.lc-list');
      expect(list).toBeTruthy();
    });
  });

  describe('Items Rendering', () => {
    it('should render list items', () => {
      const items = [{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const listItems = listElement.querySelectorAll('.lc-list__item');
      expect(listItems.length).toBe(3);
      expect(listItems[0].textContent?.trim()).toContain('Item 1');
      expect(listItems[1].textContent?.trim()).toContain('Item 2');
      expect(listItems[2].textContent?.trim()).toContain('Item 3');
    });

    it('should render empty list when no items provided', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const listItems = listElement.querySelectorAll('.lc-list__item');
      expect(listItems.length).toBe(0);
    });

    it('should handle undefined items', () => {
      fixture.componentRef.setInput('items', undefined);
      fixture.detectChanges();

      const listItems = listElement.querySelectorAll('.lc-list__item');
      expect(listItems.length).toBe(0);
    });
  });

  describe('Orientation', () => {
    it('should have vertical orientation by default', () => {
      const list = listElement.querySelector('.lc-list');
      expect(list?.className).toContain('lc-list--vertical');
    });

    it('should apply vertical orientation class', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.className).toContain('lc-list--vertical');
    });

    it('should apply horizontal orientation class', () => {
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.className).toContain('lc-list--horizontal');
    });
  });

  describe('Dividers', () => {
    it('should not show dividers by default', () => {
      const items = [{ label: 'Item 1' }, { label: 'Item 2' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.className).not.toContain('lc-list--with-dividers');
    });

    it('should show dividers when enabled', () => {
      const items = [{ label: 'Item 1' }, { label: 'Item 2' }];
      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('showDividers', true);
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.className).toContain('lc-list--with-dividers');
    });
  });

  describe('Icons', () => {
    it('should render items without icons by default', () => {
      const items = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const icon = listElement.querySelector('.lc-list__icon');
      expect(icon).toBeFalsy();
    });

    it('should render icon when provided in item', () => {
      const items = [{ label: 'Item 1', icon: 'user' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const icon = listElement.querySelector('lc-icon.lc-list__icon');
      expect(icon).toBeTruthy();
    });

    it('should render multiple items with different icons', () => {
      const items = [
        { label: 'Profile', icon: 'user' },
        { label: 'Settings', icon: 'cog-6-tooth' },
        { label: 'Logout', icon: 'arrow-right-on-rectangle' },
      ];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const icons = listElement.querySelectorAll('lc-icon.lc-list__icon');
      expect(icons.length).toBe(3);
    });
  });

  describe('Actions', () => {
    it('should not render action buttons by default', () => {
      const items = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const action = listElement.querySelector('.lc-list__action');
      expect(action).toBeFalsy();
    });

    it('should render action when provided in item', () => {
      const items = [{ label: 'Item 1', action: 'Delete' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const action = listElement.querySelector('.lc-list__action');
      expect(action).toBeTruthy();
      expect(action?.textContent?.trim()).toBe('Delete');
    });

    it('should trigger item click event', () => {
      const items = [{ label: 'Item 1', id: '1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      let clickedItem: any;
      component.itemClick.subscribe((item) => (clickedItem = item));

      const listItem = listElement.querySelector('.lc-list__item') as HTMLElement;
      listItem.click();

      expect(clickedItem).toEqual({ label: 'Item 1', id: '1' });
    });

    it('should trigger action click event', () => {
      const items = [{ label: 'Item 1', action: 'Delete', id: '1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      let actionClickedItem: any;
      component.actionClick.subscribe((item) => (actionClickedItem = item));

      const actionButton = listElement.querySelector('lc-button.lc-list__action');
      expect(actionButton).toBeTruthy();

      // Trigger the button's clicked event
      const buttonElement = actionButton?.querySelector('button');
      buttonElement?.click();

      expect(actionClickedItem).toEqual({ label: 'Item 1', action: 'Delete', id: '1' });
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled class to disabled items', () => {
      const items = [{ label: 'Item 1', disabled: true }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const listItem = listElement.querySelector('.lc-list__item');
      expect(listItem?.className).toContain('lc-list__item--disabled');
    });

    it('should not trigger click on disabled items', () => {
      const items = [{ label: 'Item 1', disabled: true }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      let clicked = false;
      component.itemClick.subscribe(() => (clicked = true));

      const listItem = listElement.querySelector('.lc-list__item') as HTMLElement;
      listItem.click();

      expect(clicked).toBe(false);
    });
  });

  describe('CSS Classes Computed', () => {
    it('should combine orientation and dividers classes', () => {
      const items = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('items', items);
      fixture.componentRef.setInput('orientation', 'horizontal');
      fixture.componentRef.setInput('showDividers', true);
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.className).toContain('lc-list--horizontal');
      expect(list?.className).toContain('lc-list--with-dividers');
    });
  });

  describe('Accessibility', () => {
    it('should have list role', () => {
      const items = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const list = listElement.querySelector('.lc-list');
      expect(list?.getAttribute('role')).toBe('list');
    });

    it('should have listitem role for items', () => {
      const items = [{ label: 'Item 1' }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const listItem = listElement.querySelector('.lc-list__item');
      expect(listItem?.getAttribute('role')).toBe('listitem');
    });

    it('should have aria-disabled for disabled items', () => {
      const items = [{ label: 'Item 1', disabled: true }];
      fixture.componentRef.setInput('items', items);
      fixture.detectChanges();

      const listItem = listElement.querySelector('.lc-list__item');
      expect(listItem?.getAttribute('aria-disabled')).toBe('true');
    });
  });
});
