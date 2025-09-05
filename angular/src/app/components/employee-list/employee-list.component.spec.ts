import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

// Mock services
const mockEmployees = [
  { id: 1, name: 'Alice', email: 'alice@example.com', department: 'HR', phone: '1234567890' },
  { id: 2, name: 'Bob', email: 'bob@example.com', department: 'IT', phone: '2345678901' }
];

let mockEmployeeService: any;

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockMatDialog {
  open() {
    return {
      componentInstance: {},
      afterClosed: () => of(true)
    };
  }
}

class MockMatSnackBar {
  open() { }
}

class MockDeleteConfirmDialog {}
import { fakeAsync, tick } from '@angular/core/testing';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee']);
    mockEmployeeService.getEmployees.and.callFake((page?: number, perPage?: number, sortField?: string, sortDirection?: string, search?: string) => {
      let employees = mockEmployees;
      if (search) {
        employees = employees.filter(e =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.email.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase()) ||
          e.phone.includes(search)
        );
      }
      return of({ employees });
    });
    mockEmployeeService.deleteEmployee.and.returnValue(of({ message: 'Employee deleted' }));

    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent, MatDialogModule],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display employees', fakeAsync(() => {
    tick(); // flush observable
    fixture.detectChanges();
    // Use dataSource.data if using MatTableDataSource, else dataSource
    expect(component.dataSource.length).toBe(2);
    expect(mockEmployeeService.getEmployees).toHaveBeenCalled();
  }));

  it('should filter employees by search input', fakeAsync(() => {
    component.filterValue = 'alice';
    component.applyFilter();
    tick();
    fixture.detectChanges();
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].name).toBe('Alice');
    // Check that getEmployees was called with 'alice' as search term in any call
    const calls = mockEmployeeService.getEmployees.calls.allArgs();
    const found = calls.some((args: any[]) => args[4] === 'alice');
    expect(found).toBeTrue();
  }));

  it('should navigate to add employee form', () => {
    const router = TestBed.inject(Router);
    component.addEmployee();
    expect(router.navigate).toHaveBeenCalledWith(['/add']);
  });

  it('should navigate to edit employee form', () => {
    const router = TestBed.inject(Router);
    component.editEmployee(mockEmployees[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/employee', 1]);
  });

  it('should open and handle delete confirmation dialog', fakeAsync(() => {
    const snackBar = TestBed.inject(MatSnackBar);
    const dialog = TestBed.inject(MatDialog);
  const openSpy = spyOn(snackBar, 'open').and.callThrough();
    const dialogOpenSpy = spyOn(dialog, 'open').and.callThrough();
    component.snackBar = snackBar;
    component['dialog'] = dialog;
    component.deleteEmployee(mockEmployees[0]);
    tick(); // flush dialog afterClosed
    tick(); // flush deleteEmployee observable
    fixture.detectChanges();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith('Employee deleted successfully!', 'Close', { duration: 3000 });
  }));

});
