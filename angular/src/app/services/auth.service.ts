import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, data);
    }

    // Store JWT token in localStorage
    setToken(token: string) {
      localStorage.setItem('jwt_token', token);
    }

    getToken(): string | null {
      return localStorage.getItem('jwt_token');
    }

    clearToken() {
      localStorage.removeItem('jwt_token');
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
