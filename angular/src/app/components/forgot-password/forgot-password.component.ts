import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  message: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
    this.loading = true;
    this.message = null;
    const { email } = this.forgotForm.value;
    this.auth.requestPasswordReset(email).subscribe({
      next: (res: any) => {
        this.message = 'Check your email for reset instructions.';
        this.snackBar.open(this.message, 'Close', { duration: 3000 });
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.message = 'Error sending reset email.';
        this.snackBar.open(this.message, 'Close', { duration: 3000 });
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
