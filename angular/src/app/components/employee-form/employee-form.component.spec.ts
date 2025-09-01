// ...existing code...
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from '../../services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
class MockEmployeeService {
  getEmployeeById() { return of({ name: 'Test', email: 'test@test.com', department: 'IT', phone: '1234567890' }); }
  addEmployee() { return of({}); }
  updateEmployee() { return of({}); }
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  paramMap = of({ get: () => '1' });
}
class MockMatSnackBar {
  open() {}
}
describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent],
      providers: [
        provideHttpClient(),
        { provide: EmployeeService, useClass: MockEmployeeService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load employee data for edit mode', () => {
    expect(component.employee.name).toBe('Test');
  });
  it('should validate form and show error for missing fields', () => {
    component.employee = { name: '', email: '', department: '', phone: '' };
    component.onSubmit();
    expect(component.isSubmitting).toBe(false);
  });
  it('should navigate to employee list on cancel', () => {
    const router = TestBed.inject(Router);
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });
});
