import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
	{ path: 'employees/:id', component: EmployeeFormComponent, canActivate: [authGuard] },
	{ path: 'employee/:id', component: EmployeeFormComponent, canActivate: [authGuard] },
	{ path: 'add', component: EmployeeFormComponent, canActivate: [authGuard] },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
];
