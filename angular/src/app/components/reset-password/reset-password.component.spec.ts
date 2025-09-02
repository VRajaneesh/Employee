import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ResetPasswordComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ token: 'sometoken' }) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if passwords do not match', () => {
    component.resetForm.setValue({ password: 'abc123', confirmPassword: 'xyz789' });
  expect(component.resetForm.errors?.['mismatch']).toBeTrue();
  });

  it('should call resetPassword on submit with valid form and token', () => {
    component.token = 'sometoken';
    component.resetForm.setValue({ password: 'abc123', confirmPassword: 'abc123' });
    authServiceSpy.resetPassword.and.returnValue(of({ message: 'Password reset successful!' }));
    component.onSubmit();
    expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('sometoken', 'abc123');
    expect(component.success).toBe('Password reset successful!');
  });

  it('should show error if resetPassword fails', () => {
    component.token = 'sometoken';
    component.resetForm.setValue({ password: 'abc123', confirmPassword: 'abc123' });
    authServiceSpy.resetPassword.and.returnValue(throwError(() => ({ error: { error: 'Reset failed.' } })));
    component.onSubmit();
    expect(component.error).toBe('Reset failed.');
    expect(component.loading).toBeFalse();
  });

  it('should not submit if form is invalid or token missing', () => {
    component.token = '';
    component.resetForm.setValue({ password: '', confirmPassword: '' });
    component.onSubmit();
    expect(authServiceSpy.resetPassword).not.toHaveBeenCalled();
  });
});
