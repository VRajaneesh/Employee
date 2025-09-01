import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('employee-directory-ui');
  constructor(private router: Router) {}

  get showHeader(): boolean {
    const url = this.router.url;
    return !(url.startsWith('/login') || url.startsWith('/register'));
  }
}
