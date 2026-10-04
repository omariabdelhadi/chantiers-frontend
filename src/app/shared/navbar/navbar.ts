import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ProfileEventService } from '../../core/services/profile-event.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  photoProfile: string | null = null;
  nom: string | null = null;
  mobileMenuOpen = false;

  constructor(
    public authService: AuthService,
    private profileService: ProfileService,
    private profileEventService: ProfileEventService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.nom = this.authService.getNom();

    if (this.authService.isLoggedIn()) {
      this.profileService.getProfile().subscribe({
        next: (p) => {
          this.photoProfile = p.photoProfile ?? null;
          this.cdr.detectChanges();
        },
      });
    }

    this.profileEventService.profileUpdated$.subscribe(profile => {
      if (!profile) return;
      this.nom = profile.nom;
      this.photoProfile = profile.photoProfile ?? null;
      this.cdr.detectChanges();
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  getRole(): string | null {
    return this.authService.getRole();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  getSuperAdminRole(): string | null {
    return this.authService.getId() === 1 ? 'SUPER_ADMIN' : this.authService.getRole();
  }

  logout(): void {
    this.authService.logout();
  }
}
