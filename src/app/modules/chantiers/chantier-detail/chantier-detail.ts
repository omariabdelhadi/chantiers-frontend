import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChantierService } from '../../../core/services/chantier.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChantierResponse } from '../../../core/models/chantier.model';

@Component({
  selector: 'app-chantier-detail',
  standalone: false,
  templateUrl: './chantier-detail.html',
  styleUrl: './chantier-detail.scss',
})
export class ChantierDetail implements OnInit {
  chantier?: ChantierResponse;
  loading = true;
  isDownloading = false;
  private chantierId!: number;

  constructor(
    private chantierService: ChantierService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {}

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.chantierId = +this.route.snapshot.paramMap.get('id')!;
    this.loadChantier();
  }

  loadChantier(): void {
    this.chantierService.getById(this.chantierId).subscribe({
      next: (c) => {
        this.chantier = c;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.router.navigate(['/chantiers']),
    });
  }

  reloadChantier(): void {
    this.chantierService.getById(this.chantierId).subscribe({
      next: (c) => {
        this.chantier = c;
        this.cdr.detectChanges();
      },
    });
  }

  downloadPdf(): void {
    this.isDownloading = true;
    this.chantierService.exportPdf(this.chantier!.id).subscribe({
      next: (blob) => {
        try {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'chantier-' + this.chantier!.nom + '.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        } catch {
          this.snackBar.open('Erreur lors du téléchargement', 'Fermer', { duration: 3000 });
        } finally {
          this.isDownloading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du téléchargement', 'Fermer', { duration: 3000 });
        this.isDownloading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'En cours';
      case 'TERMINE':    return 'Terminé';
      case 'EN_ATTENTE': return 'En attente';
      default:           return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'statut-en-cours';
      case 'TERMINE':    return 'statut-termine';
      case 'EN_ATTENTE': return 'statut-en-attente';
      default:           return '';
    }
  }

  back(): void {
    this.router.navigate(['/chantiers']);
  }

  edit(): void {
    this.router.navigate(['/chantiers', this.chantier!.id, 'edit']);
  }
}
