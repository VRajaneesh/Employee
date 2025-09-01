import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MatToolbarModule, MatButtonModule]
})
export class HeaderComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    localStorage.removeItem('auth_token');
    this.auth.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
