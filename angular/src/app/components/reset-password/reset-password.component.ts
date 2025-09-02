
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string = '';
  error: string = '';
  success: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  passwordsMatch(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const password = this.resetForm.value.password;
    this.authService.resetPassword(this.token, password).subscribe({
      next: (res) => {
        this.success = 'Password reset successful!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Reset failed.';
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
