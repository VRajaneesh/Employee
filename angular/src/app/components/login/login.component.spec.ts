// ...existing code...
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

class MockAuthService {
  login() { return of({ token: 'jwt' }); }
  setToken() {}
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockMatSnackBar {
  open() {}
}
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate form and show error for invalid input', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(component.loading).toBe(false);
  });
  it('should call AuthService.login and navigate on success', () => {
    const router = TestBed.inject(Router);
    component.loginForm.setValue({ email: 'test@test.com', password: 'pass' });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });
  it('should show error message on login failure', () => {
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'login').and.returnValue(throwError({ error: { error: 'Login failed' } }));
    component.loginForm.setValue({ email: 'test@test.com', password: 'pass' });
    component.onSubmit();
  expect(component.error).toBe('Login failed. Please check your credentials.');
  });
});
