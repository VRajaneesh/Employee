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

class MockEmployeeService {
  getEmployees() { return of(mockEmployees); }
  deleteEmployee(id: number) { return of({ message: 'Employee deleted' }); }
}

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

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent, MatDialogModule],
      providers: [
        { provide: EmployeeService, useClass: MockEmployeeService },
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display employees', () => {
    expect(component.employees.length).toBe(2);
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should filter employees by search input', () => {
    component.filterValue = 'alice';
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toBe('Alice');
  });

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

  it('should open and handle delete confirmation dialog', () => {
    spyOn(component.snackBar, 'open');
    component.deleteEmployee(mockEmployees[0]);
    // Wait for all async operations to complete
    fixture.whenStable().then(() => {
      expect(component.snackBar.open).toHaveBeenCalledWith('Employee deleted successfully!', 'Close', { duration: 3000 });
    });
  });
});
