/**
 * EmployeeFormComponent
 *
 * Provides a form to add or edit employee details with validation.
 * Uses EmployeeService for API calls and MatSnackBar for feedback.
 */
// ...existing code...
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatCardModule, MatDividerModule, MatIconModule]
})
export class EmployeeFormComponent {
  // ...existing properties...
  cancel() {
    this.router.navigate(['/employees']);
  }
  employee = { name: '', email: '', department: '', phone: '' };
  employeeId: string | null = null;
  isSubmitting = false;

  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar, private route: ActivatedRoute, private cdr: ChangeDetectorRef, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.employeeService.getEmployeeById(this.employeeId).subscribe({
          next: (data) => {
            this.employee = data;
            this.cdr.detectChanges();
          },
          error: () => {
            this.snackBar.open('Failed to load employee data', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onSubmit() {
    if (!this.employee.name || !this.employee.email || !this.employee.department || !this.employee.phone) {
      this.snackBar.open('All fields are required', 'Close', { duration: 3000 });
      return;
    }
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(this.employee.email)) {
      this.snackBar.open('Invalid email format', 'Close', { duration: 3000 });
      return;
    }
    this.isSubmitting = true;
    if (this.employeeId) {
      // Update existing employee
      this.employeeService.updateEmployee(this.employeeId, this.employee).subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.snackBar.open('Unable to update employee. Please check your details and try again.', 'Close', { duration: 3000 });
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Add new employee
      this.employeeService.addEmployee(this.employee).subscribe({
        next: () => {
          this.snackBar.open('Employee added successfully!', 'Close', { duration: 3000 });
          this.employee = { name: '', email: '', department: '', phone: '' };
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.snackBar.open('Unable to add employee. Please check your details and try again.', 'Close', { duration: 3000 });
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
