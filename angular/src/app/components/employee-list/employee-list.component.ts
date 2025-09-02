/**
 * EmployeeListComponent
 *
 * Displays a Material table of employees with search, sort, edit, and delete functionality.
 *
 * Features:
 * - Fetches employee data from the backend API using EmployeeService
 * - Allows searching and sorting employees
 * - Provides edit and delete actions for each employee
 * - Shows a confirmation dialog before deleting an employee
 * - Navigates to the add/edit employee form
 *
 * Main Methods:
 * - ngOnInit(): Loads employee data on component initialization
 * - applyFilter(): Filters the employee list by search input
 * - addEmployee(): Navigates to the add employee form
 * - editEmployee(emp): Navigates to the edit form for the selected employee
 * - deleteEmployee(emp): Confirms and deletes the selected employee
 */
import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewChecked } from '@angular/core'; // Angular core imports
import { Router } from '@angular/router'; // For navigation
import { EmployeeService } from '../../services/employee.service'; // Service for API calls
import { CommonModule } from '@angular/common'; // Common Angular directives
import { FormsModule } from '@angular/forms'; // For ngModel and forms
import { MatTableModule, MatTableDataSource } from '@angular/material/table'; // Material table
import { MatSort, MatSortModule } from '@angular/material/sort'; // Sorting for table
import { MatFormFieldModule } from '@angular/material/form-field'; // Material form fields
import { MatInputModule } from '@angular/material/input'; // Material input fields
import { MatIconModule } from '@angular/material/icon'; // Material icons
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Material dialogs
import { MatDividerModule } from '@angular/material/divider'; // Material divider
import { MatCardModule } from '@angular/material/card'; // Material card
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // For confirmation messages
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading spinner
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // For pagination
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatDividerModule, MatCardModule, MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule] // Added MatPaginatorModule
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog.component'; // Confirmation dialog

@Component({
  selector: 'app-employee-list', // Component selector
  templateUrl: './employee-list.component.html', // HTML template
  styleUrls: ['./employee-list.component.scss'], // Styles
  standalone: true, // Standalone component
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatDividerModule, MatCardModule, MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule] // Imported modules
})
export class EmployeeListComponent implements OnInit, AfterViewChecked {
  // List of employees fetched from API
  public employees: any[] = [];
  public isLoading: boolean = false;
  // Columns to display in the Material table
  public displayedColumns: string[] = ['id', 'name', 'email', 'department', 'phone', 'actions'];
  // Data source for Material table
  public dataSource = new MatTableDataSource<any>([]);
  // Value for search/filter input
  public filterValue: string = '';
  // Reference to MatSort for sorting table
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator; // Add paginator

  // Constructor injects required services
  constructor(
    private employeeService: EmployeeService, // Service for API calls
    private cdr: ChangeDetectorRef, // For manual change detection
    private router: Router, // For navigation
    private dialog: MatDialog, // For dialogs
  public snackBar: MatSnackBar // For confirmation messages
  ) {
    console.log('EmployeeListComponent constructor called'); // Debug log
    if (employeeService) {
      console.log('EmployeeService injected successfully'); // Debug log
    } else {
      console.error('EmployeeService injection failed'); // Debug log
    }
  }

  // Called when component initializes
  ngOnInit() {
    this.isLoading = true;
    // Restore: Fetch real employee data from API
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.dataSource.data = this.employees;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackBar.open('Error loading employees', 'Close', { duration: 3000 });
      }
    });
  }


  ngAfterViewChecked() {
    // Assign MatSort and MatPaginator after table is rendered
    if (this.sort && this.dataSource.sort !== this.sort) {
      this.dataSource.sort = this.sort;
      console.log('MatSort assigned in ngAfterViewChecked:', this.sort);
    }
    if (this.paginator && this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
      console.log('MatPaginator assigned in ngAfterViewChecked:', this.paginator);
    }
    if (!this.sort) {
      console.warn('MatSort is still undefined in ngAfterViewChecked!');
    }
  }

  // Filter table data by search input
  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  // Navigate to add employee form
  addEmployee() {
    this.router.navigate(['/add']);
  }

  // Navigate to edit employee form
  editEmployee(emp: any) {
    this.router.navigate(['/employee', emp.id]); // Pass employee id in route
  }

  // Delete employee after confirmation using Material dialog
  deleteEmployee(emp: any) {
    const dialogRef = this.dialog.open(DeleteConfirmDialog, {
      data: { filename: emp.name },
      width: '400px',
      disableClose: true,
      autoFocus: true
      // Removed position property for default centering
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(emp.id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter((e: any) => e.id !== emp.id); // Remove from table
            this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 }); // Show confirmation
          },
          error: (err) => {
            alert('Error deleting employee'); // Show error
          }
        });
      }
    });
  }
}
