import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChantierService } from '../../../core/services/chantier.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChantierResponse } from '../../../core/models/chantier.model';
import { UserResponse } from '../../../core/models/user.model';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-chantier-list',
  standalone: false,
  templateUrl: './chantier-list.html',
  styleUrl: './chantier-list.scss',
})
export class ChantierList implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<ChantierResponse>([]);
  displayedColumns = ['nom', 'chef', 'statut', 'avancement', 'nombreTaches', 'actions'];
  loading = false;

  nomCtrl           = new FormControl('');
  statutFilter      = '';
  chefIdFilter: number | null = null;
  avancementFilter  = '';
  chefs: UserResponse[] = [];

  allChantiers: ChantierResponse[] = [];
  private rawData: ChantierResponse[] = [];
  private nomSub?: Subscription;

  constructor(
    private chantierService: ChantierService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.nomSub = this.nomCtrl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.search());
    this.load();
    if (this.isAdmin()) this.loadChefs();
  }

  ngOnDestroy(): void {
    this.nomSub?.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.chantierService.getAll().subscribe({
      next: (data) => {
        this.allChantiers = data;
        this.rawData = data;
        this.dataSource.data = this.filterByAvancement(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors du chargement des chantiers', 'Fermer', { duration: 3000 });
      },
    });
  }

  loadChefs(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.chefs = users;
        this.cdr.detectChanges();
      },
    });
  }

  search(): void {
    const nom    = this.nomCtrl.value?.trim() ?? '';
    const statut = this.statutFilter;
    const chefId = this.chefIdFilter;

    if (!nom && !statut && chefId == null) {
      this.load();
      return;
    }

    this.loading = true;
    this.chantierService.searchChantiers(
      nom    || undefined,
      statut || undefined,
      chefId ?? undefined,
    ).subscribe({
      next: (data) => {
        this.rawData = data;
        this.dataSource.data = this.filterByAvancement(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors de la recherche', 'Fermer', { duration: 3000 });
      },
    });
  }

  onAvancementChange(): void {
    this.dataSource.data = this.filterByAvancement(this.rawData);
    this.cdr.detectChanges();
  }

  reset(): void {
    this.nomCtrl.setValue('', { emitEvent: false });
    this.statutFilter     = '';
    this.chefIdFilter     = null;
    this.avancementFilter = '';
    this.load();
  }

  private filterByAvancement(data: ChantierResponse[]): ChantierResponse[] {
    if (!this.avancementFilter) return data;
    const [min, max] = this.avancementFilter.split('-').map(Number);
    return data.filter(c => c.avancement >= min && c.avancement <= max);
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  voir(id: number): void {
    this.router.navigate(['/chantiers', id]);
  }

  modifier(id: number): void {
    this.router.navigate(['/chantiers', id, 'edit']);
  }

  supprimer(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Êtes-vous sûr de vouloir supprimer ce chantier ? Cette action supprimera également toutes les tâches, photos et rapports associés.',
      },
      width: '480px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.chantierService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Chantier supprimé avec succès', 'Fermer', { duration: 3000 });
          this.search();
          this.cdr.detectChanges();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          this.cdr.detectChanges();
        },
      });
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'statut-en-cours';
      case 'TERMINE':    return 'statut-termine';
      case 'EN_ATTENTE': return 'statut-en-attente';
      default:           return '';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'En cours';
      case 'TERMINE':    return 'Terminé';
      case 'EN_ATTENTE': return 'En attente';
      default:           return statut;
    }
  }
}
