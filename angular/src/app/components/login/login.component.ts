import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = null;
      const { email, password } = this.loginForm.value;
      this.auth.login({ email, password }).subscribe({
        next: (res) => {
          if (res && res.token) {
            this.auth.setToken(res.token);
            this.snackBar.open('Login successful', 'Close', { duration: 2000 });
            this.router.navigate(['/employees']);
          } else {
            this.error = 'Invalid response from server';
          }
          this.loading = false;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          this.error = 'Login failed. Please check your credentials.';
          this.snackBar.open(this.error, 'Close', { duration: 2500 });
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', 'true'); // Set a flag for demo
        if (res && res.user && res.user.name) {
          localStorage.setItem('user_name', res.user.name);
          this.snackBar.open(`Welcome, ${res.user.name}! Login successful.`, 'Close', { duration: 2500 });
        } else {
          this.snackBar.open('Welcome! Login successful.', 'Close', { duration: 2500 });
        }
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.error = 'Login failed. Please check your credentials.';
        this.snackBar.open(this.error, 'Close', { duration: 2500 });
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}
