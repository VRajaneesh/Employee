import { TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

class MockAuthService {
  requestPasswordReset(email: string) {
    if (email === 'success@example.com') {
      return of({ message: 'Email sent' });
    } else {
      return throwError(() => new Error('Error sending email'));
    }
  }
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    const fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message on valid email', () => {
    component.forgotForm.setValue({ email: 'success@example.com' });
    component.onSubmit();
    expect(component.message).toBe('Check your email for reset instructions.');
  });

  it('should show error message on invalid email', () => {
    component.forgotForm.setValue({ email: 'fail@example.com' });
    component.onSubmit();
    expect(component.message).toBe('Error sending reset email.');
  });
});
