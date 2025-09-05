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
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog.component'; // Confirmation dialog
@Component({
  selector: 'app-employee-list', // Component selector
  templateUrl: './employee-list.component.html', // HTML template
  styleUrls: ['./employee-list.component.scss'], // Styles
  standalone: true, // Standalone component
  imports: [CommonModule, FormsModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatDialogModule, MatDividerModule, MatCardModule, MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule], // Imported modules
})
export class EmployeeListComponent implements OnInit {
  public totalEmployees = 0;
  public pageSize = 5;
  public currentPage = 1;
  public sortField: string = 'id';
  public sortDirection: string = 'asc';
  // List of employees fetched from API
  public employees: any[] = [];
  public isLoading: boolean = false;
  // Columns to display in the Material table
  public displayedColumns: string[] = ['id', 'name', 'email', 'department', 'phone', 'actions'];
  // Data source for Material table (plain array for server-side sorting)
  public dataSource: any[] = [];
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
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.loadEmployees(this.currentPage, this.pageSize, this.sortField, this.sortDirection);
  }

  loadEmployees(page?: number, perPage?: number, sortField?: string, sortDirection?: string, search?: string): void {
    const pg = page ?? this.currentPage;
    const pp = perPage ?? this.pageSize;
    const sf = sortField ?? this.sortField;
    const sd = sortDirection ?? this.sortDirection;
    const searchTerm = search ?? this.filterValue;
    this.employeeService.getEmployees(pg, pp, sf, sd, searchTerm).subscribe({
      next: (data) => {
        this.dataSource = data.employees;
        this.totalEmployees = data.total;
        this.currentPage = data.page;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.snackBar.open('Error loading employees', 'Close', { duration: 3000 });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.loadEmployees(this.currentPage, this.pageSize, this.sortField, this.sortDirection);
      });
    }
  }
  // Sort event handled via (matSortChange) in template
  onSort(event: any) {
    this.sortField = event.active;
    this.sortDirection = event.direction || 'asc';
    this.loadEmployees(this.currentPage, this.pageSize, this.sortField, this.sortDirection);
  }

  // Filter table data by search input
  applyFilter() {
    this.loadEmployees(this.currentPage, this.pageSize, this.sortField, this.sortDirection, this.filterValue);
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
            this.dataSource = this.dataSource.filter((e: any) => e.id !== emp.id); // Remove from table
            this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 }); // Show confirmation
            this.cdr.markForCheck();
          },
          error: (err) => {
            alert('Error deleting employee'); // Show error
          }
        });
      }
    });
  }
}
