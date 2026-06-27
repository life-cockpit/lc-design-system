import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableComponent, type TableColumn } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockColumns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
  ];

  const mockData = [
    { name: 'Alice', age: 30, email: 'alice@example.com' },
    { name: 'Bob', age: 25, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Structure', () => {
    it('should render table element', () => {
      const table = fixture.debugElement.query(By.css('table'));
      expect(table).toBeTruthy();
      expect(table.nativeElement.classList.contains('lc-table')).toBe(true);
    });

    it('should render thead element', () => {
      const thead = fixture.debugElement.query(By.css('thead'));
      expect(thead).toBeTruthy();
    });

    it('should render tbody element', () => {
      const tbody = fixture.debugElement.query(By.css('tbody'));
      expect(tbody).toBeTruthy();
    });
  });

  describe('Columns', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.detectChanges();
    });

    it('should render header cells for each column', () => {
      const headers = fixture.debugElement.queryAll(By.css('th'));
      expect(headers.length).toBe(mockColumns.length);
    });

    it('should display column labels in headers', () => {
      const headers = fixture.debugElement.queryAll(By.css('th'));
      headers.forEach((header, index) => {
        expect(header.nativeElement.textContent).toContain(mockColumns[index].label);
      });
    });

    it('should add sortable class to sortable columns', () => {
      const headers = fixture.debugElement.queryAll(By.css('th'));
      expect(headers[0].nativeElement.classList.contains('sortable')).toBe(true);
      expect(headers[1].nativeElement.classList.contains('sortable')).toBe(true);
      expect(headers[2].nativeElement.classList.contains('sortable')).toBe(false);
    });
  });

  describe('Data Rendering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();
    });

    it('should render rows for each data item', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(mockData.length);
    });

    it('should render cells for each column in each row', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows.forEach((row) => {
        const cells = row.queryAll(By.css('td'));
        expect(cells.length).toBe(mockColumns.length);
      });
    });

    it('should display correct data in cells', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows.forEach((row, rowIndex) => {
        const cells = row.queryAll(By.css('td'));
        cells.forEach((cell, colIndex) => {
          const key = mockColumns[colIndex].key;
          const expectedValue = mockData[rowIndex][key];
          expect(cell.nativeElement.textContent.trim()).toBe(String(expectedValue));
        });
      });
    });
  });

  describe('Cell Formatting', () => {
    it('should render formatted cell output when formatter is configured', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        {
          key: 'age',
          label: 'Age',
          formatter: (value) => `${String(value)} years`,
        },
      ];

      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr'))[0].queryAll(By.css('td'));
      expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('30 years');
    });

    it('should pass row context to formatter', () => {
      const columns: TableColumn[] = [
        {
          key: 'name',
          label: 'Name',
          formatter: (_value, row, _column, rowIndex) => `${String(row['email'])} (${rowIndex})`,
        },
      ];

      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const firstCell = fixture.debugElement.query(By.css('tbody tr td'));
      expect(firstCell.nativeElement.textContent.trim()).toBe('alice@example.com (0)');
    });

    it('should apply dynamic cell classes when cellClass callback is configured', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        {
          key: 'age',
          label: 'Age',
          cellClass: (value) => (Number(value) >= 30 ? 'is-senior' : 'is-junior'),
        },
      ];

      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr'))[0].queryAll(By.css('td'));
      expect(firstRowCells[1].nativeElement.classList.contains('is-senior')).toBe(true);
    });

    it('should apply dynamic cell styles when cellStyle callback is configured', () => {
      const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        {
          key: 'age',
          label: 'Age',
          cellStyle: () => ({ 'text-align': 'right' }),
        },
      ];

      fixture.componentRef.setInput('columns', columns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr'))[0].queryAll(By.css('td'));
      expect(firstRowCells[1].nativeElement.style.textAlign).toBe('right');
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no data', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(By.css('.lc-table__empty'));
      expect(emptyMessage).toBeTruthy();
      expect(emptyMessage.nativeElement.textContent).toContain('No data available');
    });

    it('should not show empty message when data exists', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(By.css('.lc-table__empty'));
      expect(emptyMessage).toBeFalsy();
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();
    });

    it('should emit sort event when sortable header is clicked', () => {
      const sortSpy = jest.fn();
      component.sort.subscribe(sortSpy);

      const firstHeader = fixture.debugElement.query(By.css('th.sortable'));
      firstHeader.nativeElement.click();

      expect(sortSpy).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });
    });

    it('should toggle sort direction on repeated clicks', () => {
      const sortSpy = jest.fn();
      component.sort.subscribe(sortSpy);

      const firstHeader = fixture.debugElement.query(By.css('th.sortable'));

      firstHeader.nativeElement.click();
      expect(sortSpy).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });

      firstHeader.nativeElement.click();
      expect(sortSpy).toHaveBeenCalledWith({ column: 'name', direction: 'desc' });

      firstHeader.nativeElement.click();
      expect(sortSpy).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });
    });

    it('should not emit sort event for non-sortable columns', () => {
      const sortSpy = jest.fn();
      component.sort.subscribe(sortSpy);

      const emailHeader = fixture.debugElement.queryAll(By.css('th'))[2];
      emailHeader.nativeElement.click();

      expect(sortSpy).not.toHaveBeenCalled();
    });

    it('should show sort indicator for active sort column', () => {
      component.handleSort('name');
      fixture.detectChanges();

      const firstHeader = fixture.debugElement.query(By.css('th.sortable'));
      expect(firstHeader.nativeElement.classList.contains('sorted-asc')).toBe(true);
    });
  });

  describe('Variants', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
    });

    it('should apply default variant class', () => {
      fixture.componentRef.setInput('variant', 'default');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--default')).toBe(true);
    });

    it('should apply striped variant class', () => {
      fixture.componentRef.setInput('variant', 'striped');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--striped')).toBe(true);
    });

    it('should apply bordered variant class', () => {
      fixture.componentRef.setInput('variant', 'bordered');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--bordered')).toBe(true);
    });

    it('should apply hover class when hoverable is true', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--hoverable')).toBe(true);
    });
  });

  describe('Responsive', () => {
    it('should apply responsive class', () => {
      fixture.componentRef.setInput('responsive', true);
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('.lc-table-wrapper'));
      expect(wrapper.nativeElement.classList.contains('lc-table-wrapper--responsive')).toBe(true);
    });

    it('should not apply responsive class when responsive is false', () => {
      fixture.componentRef.setInput('responsive', false);
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('.lc-table-wrapper'));
      expect(wrapper.nativeElement.classList.contains('lc-table-wrapper--responsive')).toBe(false);
    });
  });

  describe('Sizes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
    });

    it('should apply sm size class', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--sm')).toBe(true);
    });

    it('should apply md size class', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--md')).toBe(true);
    });

    it('should apply lg size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('lc-table--lg')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();
    });

    it('should have role="table"', () => {
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.getAttribute('role')).toBe('table');
    });

    it('should have proper scope attributes on headers', () => {
      const headers = fixture.debugElement.queryAll(By.css('th'));
      headers.forEach((header) => {
        expect(header.nativeElement.getAttribute('scope')).toBe('col');
      });
    });

    it('should have aria-sort attribute on sorted column', () => {
      component.handleSort('name');
      fixture.detectChanges();

      const firstHeader = fixture.debugElement.query(By.css('th.sortable'));
      expect(firstHeader.nativeElement.getAttribute('aria-sort')).toBe('ascending');

      component.handleSort('name');
      fixture.detectChanges();

      expect(firstHeader.nativeElement.getAttribute('aria-sort')).toBe('descending');
    });
  });

  describe('Input Bindings', () => {
    it('should accept columns input', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      expect(component.columns()).toEqual(mockColumns);
    });

    it('should accept data input', () => {
      fixture.componentRef.setInput('data', mockData);
      expect(component.data()).toEqual(mockData);
    });

    it('should accept variant input', () => {
      fixture.componentRef.setInput('variant', 'striped');
      expect(component.variant()).toBe('striped');
    });

    it('should accept size input', () => {
      fixture.componentRef.setInput('size', 'lg');
      expect(component.size()).toBe('lg');
    });

    it('should accept hoverable input', () => {
      fixture.componentRef.setInput('hoverable', true);
      expect(component.hoverable()).toBe(true);
    });

    it('should accept responsive input', () => {
      fixture.componentRef.setInput('responsive', true);
      expect(component.responsive()).toBe(true);
    });
  });

  describe('Computed Classes', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
    });

    it('should compute correct table classes', () => {
      fixture.componentRef.setInput('variant', 'striped');
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const classes = component.tableClasses().split(' ');
      expect(classes).toContain('lc-table');
      expect(classes).toContain('lc-table--striped');
      expect(classes).toContain('lc-table--lg');
      expect(classes).toContain('lc-table--hoverable');
    });

    it('should compute correct wrapper classes', () => {
      fixture.componentRef.setInput('responsive', true);
      fixture.detectChanges();

      const classes = component.wrapperClasses().split(' ');
      expect(classes).toContain('lc-table-wrapper');
      expect(classes).toContain('lc-table-wrapper--responsive');
    });
  });

  describe('Pagination', () => {
    const bigData = Array.from({ length: 25 }, (_, i) => ({
      name: `User ${i}`,
      age: 20 + i,
      email: `user${i}@test.com`,
    }));

    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', bigData);
      fixture.componentRef.setInput('paginate', true);
      fixture.componentRef.setInput('pageSize', 10);
      fixture.detectChanges();
    });

    it('should show only first page of data', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(10);
    });

    it('should render pagination footer', () => {
      const pagination = fixture.debugElement.query(By.css('.lc-table-pagination'));
      expect(pagination).toBeTruthy();
    });

    it('should show correct page info', () => {
      const info = fixture.debugElement.query(By.css('.lc-table-pagination__info'));
      expect(info.nativeElement.textContent).toContain('1–10 of 25');
    });

    it('should navigate to next page', () => {
      const nextBtn = fixture.debugElement.queryAll(By.css('.lc-table-pagination__btn'))[1];
      nextBtn.nativeElement.click();
      fixture.detectChanges();

      const info = fixture.debugElement.query(By.css('.lc-table-pagination__info'));
      expect(info.nativeElement.textContent).toContain('11–20 of 25');
    });

    it('should disable prev button on first page', () => {
      const prevBtn = fixture.debugElement.queryAll(By.css('.lc-table-pagination__btn'))[0];
      expect(prevBtn.nativeElement.disabled).toBe(true);
    });

    it('should not show pagination when paginate is false', () => {
      fixture.componentRef.setInput('paginate', false);
      fixture.detectChanges();

      const pagination = fixture.debugElement.query(By.css('.lc-table-pagination'));
      expect(pagination).toBeFalsy();
    });
  });

  describe('Selection', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();
    });

    it('should render checkboxes when selectable', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('.lc-table__checkbox'));
      // 1 header + 3 rows
      expect(checkboxes.length).toBe(4);
    });

    it('should select a row when checkbox is clicked', () => {
      const rowCheckbox = fixture.debugElement.queryAll(By.css('tbody .lc-table__checkbox'))[0];
      rowCheckbox.nativeElement.click();
      fixture.detectChanges();

      const selectedRow = fixture.debugElement.query(By.css('.lc-table__row--selected'));
      expect(selectedRow).toBeTruthy();
    });

    it('should emit selectionChange when row is selected', () => {
      jest.spyOn(component.selectionChange, 'emit');
      const rowCheckbox = fixture.debugElement.queryAll(By.css('tbody .lc-table__checkbox'))[0];
      rowCheckbox.nativeElement.click();
      fixture.detectChanges();

      expect(component.selectionChange.emit).toHaveBeenCalled();
    });

    it('should select all rows via header checkbox', () => {
      const headerCheckbox = fixture.debugElement.query(By.css('thead .lc-table__checkbox'));
      headerCheckbox.nativeElement.click();
      fixture.detectChanges();

      const selectedRows = fixture.debugElement.queryAll(By.css('.lc-table__row--selected'));
      expect(selectedRows.length).toBe(3);
    });

    it('should not render checkboxes when selectable is false', () => {
      fixture.componentRef.setInput('selectable', false);
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('.lc-table__checkbox'));
      expect(checkboxes.length).toBe(0);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('filterable', true);
      fixture.detectChanges();
    });

    it('should render filter inputs when filterable', () => {
      const filters = fixture.debugElement.queryAll(By.css('.lc-table__filter-input .input-field'));
      expect(filters.length).toBe(3);
    });

    it('should filter rows based on input', () => {
      const filterInput = fixture.debugElement.queryAll(By.css('.lc-table__filter-input .input-field'))[0];
      filterInput.nativeElement.value = 'Alice';
      filterInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(1);
    });

    it('should show empty state when filter matches nothing', () => {
      const filterInput = fixture.debugElement.queryAll(By.css('.lc-table__filter-input .input-field'))[0];
      filterInput.nativeElement.value = 'ZZZ_NO_MATCH';
      filterInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const empty = fixture.debugElement.query(By.css('.lc-table__empty'));
      expect(empty).toBeTruthy();
    });

    it('should not render filter row when filterable is false', () => {
      fixture.componentRef.setInput('filterable', false);
      fixture.detectChanges();

      const filterRow = fixture.debugElement.query(By.css('.lc-table__filter-row'));
      expect(filterRow).toBeFalsy();
    });
  });

  describe('Inline Editing', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('editable', true);
      fixture.detectChanges();
    });

    it('should show edit input on double-click', () => {
      const cell = fixture.debugElement.queryAll(By.css('tbody td'))[0];
      cell.triggerEventHandler('dblclick', {});
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.lc-table__edit-input'));
      expect(editInput).toBeTruthy();
    });

    it('should populate edit input with current value', () => {
      const cell = fixture.debugElement.queryAll(By.css('tbody td'))[0];
      cell.triggerEventHandler('dblclick', {});
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.lc-table__edit-input'));
      expect(editInput.nativeElement.value).toBe('Alice');
    });

    it('should emit cellEdit on blur with changed value', () => {
      jest.spyOn(component.cellEdit, 'emit');
      const cell = fixture.debugElement.queryAll(By.css('tbody td'))[0];
      cell.triggerEventHandler('dblclick', {});
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.lc-table__edit-input'));
      editInput.nativeElement.value = 'Alice Updated';
      editInput.nativeElement.dispatchEvent(new Event('input'));
      editInput.triggerEventHandler('blur', {});
      fixture.detectChanges();

      expect(component.cellEdit.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          column: 'name',
          oldValue: 'Alice',
          newValue: 'Alice Updated',
        })
      );
    });

    it('should cancel edit on Escape', () => {
      const cell = fixture.debugElement.queryAll(By.css('tbody td'))[0];
      cell.triggerEventHandler('dblclick', {});
      fixture.detectChanges();

      const editInput = fixture.debugElement.query(By.css('.lc-table__edit-input'));
      editInput.triggerEventHandler('keydown', { key: 'Escape' });
      fixture.detectChanges();

      const editInputAfter = fixture.debugElement.query(By.css('.lc-table__edit-input'));
      expect(editInputAfter).toBeFalsy();
    });
  });

  describe('Row Actions', () => {
    const actions = [
      { key: 'approve', label: 'Freigeben', variant: 'primary' as const },
      { key: 'reject', label: 'Ablehnen', variant: 'danger' as const },
    ];

    beforeEach(() => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
    });

    it('should not render an actions column when no actions are provided', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.lc-table__actions-cell'))).toBeFalsy();
    });

    it('should render an actions cell with a button per action for each row', () => {
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      const actionsCell = firstRow.query(By.css('.lc-table__actions-cell'));
      expect(actionsCell).toBeTruthy();
      const buttons = actionsCell.queryAll(By.css('lc-button'));
      expect(buttons.length).toBe(2);
    });

    it('should render the actions header label', () => {
      fixture.componentRef.setInput('actions', actions);
      fixture.componentRef.setInput('actionsLabel', 'Aktionen');
      fixture.detectChanges();

      const headerCell = fixture.debugElement.query(By.css('thead .lc-table__actions-cell'));
      expect(headerCell.nativeElement.textContent).toContain('Aktionen');
    });

    it('should emit actionClick with the absolute row index', () => {
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      let emitted: { action: string; row: Record<string, unknown>; rowIndex: number } | undefined;
      component.actionClick.subscribe((e) => (emitted = e));

      const firstRowButtons = fixture.debugElement
        .queryAll(By.css('tbody tr'))[1]
        .queryAll(By.css('lc-button'));
      firstRowButtons[0].triggerEventHandler('clicked');

      expect(emitted).toEqual({ action: 'approve', row: mockData[1], rowIndex: 1 });
    });

    it('should NOT trigger rowClick when an action button is clicked', () => {
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const rowClickSpy = jest.fn();
      component.rowClick.subscribe(rowClickSpy);

      const actionsCell = fixture.debugElement.query(By.css('tbody tr .lc-table__actions-cell'));
      // The cell stops propagation so the row (click) handler never fires.
      actionsCell.triggerEventHandler('click', { stopPropagation: () => undefined });

      expect(rowClickSpy).not.toHaveBeenCalled();
    });

    it('should still emit rowClick when a data cell is clicked', () => {
      fixture.componentRef.setInput('actions', actions);
      fixture.detectChanges();

      const rowClickSpy = jest.fn();
      component.rowClick.subscribe(rowClickSpy);

      fixture.debugElement.queryAll(By.css('tbody tr'))[0].triggerEventHandler('click', {});
      expect(rowClickSpy).toHaveBeenCalledWith(mockData[0]);
    });

    it('should hide actions for rows matching the hidden predicate', () => {
      fixture.componentRef.setInput('actions', [
        { key: 'approve', label: 'Freigeben', hidden: (row: Record<string, unknown>) => row['name'] === 'Bob' },
      ]);
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].queryAll(By.css('lc-button')).length).toBe(1); // Alice
      expect(rows[1].queryAll(By.css('lc-button')).length).toBe(0); // Bob hidden
    });
  });

  describe('Tree / grouped rows', () => {
    const treeColumns: TableColumn[] = [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'status', label: 'Status' },
    ];

    // Two roots: one Epic with two children, plus a standalone feature.
    const treeData = [
      { id: 'e1', parentId: '', title: 'Epic Alpha', status: 'Entwurf' },
      { id: 's1', parentId: 'e1', title: 'Child One', status: 'Entwurf' },
      { id: 's2', parentId: 'e1', title: 'Child Two', status: 'Blockiert' },
      { id: 'f1', parentId: '', title: 'Standalone Feature', status: 'Planung' },
    ];

    const setUpTree = (overrides: Record<string, unknown> = {}) => {
      fixture.componentRef.setInput('columns', treeColumns);
      fixture.componentRef.setInput('data', treeData);
      fixture.componentRef.setInput('idKey', 'id');
      fixture.componentRef.setInput('parentKey', 'parentId');
      fixture.componentRef.setInput('treeColumn', 'title');
      for (const [key, value] of Object.entries(overrides)) {
        fixture.componentRef.setInput(key, value);
      }
      fixture.detectChanges();
    };

    const rowText = () =>
      fixture.debugElement
        .queryAll(By.css('tbody tr'))
        .map((r) => r.query(By.css('td')).nativeElement.textContent.trim());

    it('should set role="treegrid" only when tree mode is enabled', () => {
      fixture.componentRef.setInput('columns', treeColumns);
      fixture.componentRef.setInput('data', treeData);
      fixture.detectChanges();
      // Flat: no idKey/parentKey → plain table.
      expect(fixture.debugElement.query(By.css('table')).nativeElement.getAttribute('role')).toBe('table');

      setUpTree();
      expect(fixture.debugElement.query(By.css('table')).nativeElement.getAttribute('role')).toBe('treegrid');
    });

    it('should render children indented beneath their parent (expanded by default)', () => {
      setUpTree();
      // All four rows visible, children right after their epic.
      expect(rowText()).toEqual(['Epic Alpha', 'Child One', 'Child Two', 'Standalone Feature']);

      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].nativeElement.getAttribute('aria-level')).toBe('1');
      expect(rows[1].nativeElement.getAttribute('aria-level')).toBe('2');
      // Indent guides only on the depth-1 children.
      expect(rows[0].queryAll(By.css('.lc-table__tree-indent')).length).toBe(0);
      expect(rows[1].queryAll(By.css('.lc-table__tree-indent')).length).toBe(1);
    });

    it('should render a chevron only on parent rows and expose aria-expanded', () => {
      setUpTree();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows[0].query(By.css('.lc-table__chevron-btn'))).toBeTruthy(); // Epic
      expect(rows[1].query(By.css('.lc-table__chevron-btn'))).toBeFalsy(); // Child
      expect(rows[0].nativeElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('should collapse descendants when a parent chevron is clicked', () => {
      setUpTree();
      const chevron = fixture.debugElement.query(By.css('tbody tr .lc-table__chevron-btn'));
      chevron.nativeElement.click();
      fixture.detectChanges();

      expect(rowText()).toEqual(['Epic Alpha', 'Standalone Feature']);
      const epicRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];
      expect(epicRow.nativeElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should start collapsed when defaultExpanded is false', () => {
      setUpTree({ defaultExpanded: false });
      expect(rowText()).toEqual(['Epic Alpha', 'Standalone Feature']);
    });

    it('should respect a controlled expandedIds list', () => {
      setUpTree({ expandedIds: [] });
      expect(rowText()).toEqual(['Epic Alpha', 'Standalone Feature']);

      fixture.componentRef.setInput('expandedIds', ['e1']);
      fixture.detectChanges();
      expect(rowText()).toEqual(['Epic Alpha', 'Child One', 'Child Two', 'Standalone Feature']);
    });

    it('should emit rowToggle and expandedIdsChange on chevron click without rowClick', () => {
      setUpTree();
      const toggleSpy = jest.fn();
      const expandedSpy = jest.fn();
      const rowClickSpy = jest.fn();
      component.rowToggle.subscribe(toggleSpy);
      component.expandedIdsChange.subscribe(expandedSpy);
      component.rowClick.subscribe(rowClickSpy);

      const chevron = fixture.debugElement.query(By.css('tbody tr .lc-table__chevron-btn'));
      chevron.nativeElement.click();
      fixture.detectChanges();

      expect(toggleSpy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'e1', expanded: false })
      );
      expect(expandedSpy).toHaveBeenCalledWith([]); // no parents expanded anymore
      expect(rowClickSpy).not.toHaveBeenCalled();
    });

    it('should keep the tree intact when sorting (sorts siblings, not a flat list)', () => {
      setUpTree();
      component.handleSort('title');
      component.handleSort('title'); // desc
      fixture.detectChanges();

      // Roots sorted desc (Standalone before Epic); children sorted desc within the epic.
      expect(rowText()).toEqual(['Standalone Feature', 'Epic Alpha', 'Child Two', 'Child One']);
    });

    it('should keep the ancestor chain visible when filtering', () => {
      setUpTree({ filterable: true });
      component['onFilterChange']('title', 'Child Two');
      fixture.detectChanges();

      // The match plus its epic ancestor; the unrelated standalone root is hidden.
      expect(rowText()).toEqual(['Epic Alpha', 'Child Two']);
    });

    it('should paginate roots without splitting a group across pages', () => {
      setUpTree({ paginate: true, pageSize: 1 });
      // Page 1 = first root + its children.
      expect(rowText()).toEqual(['Epic Alpha', 'Child One', 'Child Two']);
      expect(component['totalPages']()).toBe(2); // two roots → two pages

      component['goToPage'](1);
      fixture.detectChanges();
      expect(rowText()).toEqual(['Standalone Feature']);
    });

    it('should treat rows with an unknown parent id as roots (orphans)', () => {
      fixture.componentRef.setInput('columns', treeColumns);
      fixture.componentRef.setInput('data', [
        { id: 'a', parentId: 'does-not-exist', title: 'Orphan', status: 'x' },
      ]);
      fixture.componentRef.setInput('idKey', 'id');
      fixture.componentRef.setInput('parentKey', 'parentId');
      fixture.detectChanges();

      expect(rowText()).toEqual(['Orphan']);
      const row = fixture.debugElement.query(By.css('tbody tr'));
      expect(row.nativeElement.getAttribute('aria-level')).toBe('1');
    });
  });

});
