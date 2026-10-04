import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TacheService } from '../../../core/services/tache.service';
import { TacheResponse } from '../../../core/models/tache.model';

@Component({
  selector: 'app-tache-detail',
  standalone: false,
  templateUrl: './tache-detail.html',
  styleUrl: './tache-detail.scss',
})
export class TacheDetail implements OnInit {
  tache: TacheResponse | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tacheService: TacheService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.cdr.detectChanges();
    this.tacheService.getById(id).subscribe({
      next: (tache) => {
        this.tache = tache;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'statut-en-cours';
      case 'TERMINEE': return 'statut-terminee';
      case 'A_FAIRE':  return 'statut-a-faire';
      default:         return '';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'A_FAIRE':  return 'À faire';
      default:         return statut;
    }
  }

  goBack(): void {
    if (this.tache) {
      this.router.navigate(['/chantiers', this.tache.chantierId]);
    } else {
      this.router.navigate(['/chantiers']);
    }
  }
}
