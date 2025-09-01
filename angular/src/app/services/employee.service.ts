/**
 * EmployeeService
 *
 * This service provides CRUD operations for employees by communicating with the Flask backend API.
 * Methods:
 * - getEmployees(): Fetch all employees
 * - addEmployee(employee): Add a new employee
 * - deleteEmployee(id): Delete an employee by ID
 * - getEmployeeById(id): Get details of a single employee
 * - updateEmployee(id, employee): Update employee details
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:5000/employees';

  constructor(private http: HttpClient) {}

    // Helper to get JWT token from localStorage
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwt_token');
      return new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      });
    }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
  addEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee, { headers: this.getAuthHeaders() });
  }

  deleteEmployee(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getEmployeeById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateEmployee(id: any, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee, { headers: this.getAuthHeaders() });
  }
}
