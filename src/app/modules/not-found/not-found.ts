import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}
