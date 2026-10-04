import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../core/services/profile.service';
import { ProfileResponse } from '../../../core/models/profile.model';

@Component({
  selector: 'app-profile-view',
  standalone: false,
  templateUrl: './profile-view.html',
  styleUrl: './profile-view.scss',
})
export class ProfileView implements OnInit {
  profile: ProfileResponse | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profileService.getProfileById(id).subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/register']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/register']);
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrateur' : 'Chef de chantier';
  }
}
