// ...existing code...
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
class MockAuthService {
  register() { return of({}); }
}
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate form and show error for invalid input', () => {
    component.registerForm.setValue({ name: '', email: '', password: '' });
    component.onSubmit();
    expect(component.loading).toBe(false);
  });
  it('should call AuthService.register and navigate to login on success', () => {
    const router = TestBed.inject(Router);
    component.registerForm.setValue({ name: 'Test', email: 'test@test.com', password: 'pass' });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
  it('should show error message on registration failure', () => {
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'register').and.returnValue(throwError({ error: { message: 'Registration failed' } }));
    component.registerForm.setValue({ name: 'Test', email: 'test@test.com', password: 'pass' });
    component.onSubmit();
  expect(component.error).toBe('Unable to register. Please check your details or try a different email.');
  });
});
