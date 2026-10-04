import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { TacheService } from '../../../core/services/tache.service';
import { EmployeService } from '../../../core/services/employe.service';
import { TacheResponse } from '../../../core/models/tache.model';
import { EmployeResponse } from '../../../core/models/employe.model';
import { EmployeDialog } from '../employe-dialog/employe-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-tache-list',
  standalone: false,
  templateUrl: './tache-list.html',
  styleUrl: './tache-list.scss',
})
export class TacheList implements OnInit, OnChanges {
  @Input() chantierId!: number;
  @Output() tacheChanged = new EventEmitter<void>();

  dataSource = new MatTableDataSource<TacheResponse>([]);
  displayedColumns = ['titre', 'statut', 'avancement', 'employes', 'actions'];
  loading = false;
  allEmployes: EmployeResponse[] = [];

  constructor(
    private tacheService: TacheService,
    private employeService: EmployeService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
    this.employeService.getAll().subscribe({
      next: (data) => (this.allEmployes = data),
    });
  }

  ngOnChanges(): void {
    if (this.chantierId) this.load();
  }

  load(): void {
    if (!this.chantierId) return;
    this.loading = true;
    this.tacheService.getTachesByChantier(this.chantierId).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors du chargement des tâches', 'Fermer', { duration: 3000 });
      },
    });
  }

  voir(id: number): void {
    this.router.navigate(['/taches', id]);
  }

  ajouterTache(): void {
    this.router.navigate(['/taches/new', this.chantierId]);
  }

  modifierTache(id: number): void {
    this.router.navigate(['/taches', id, 'edit']);
  }

  supprimerTache(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer cette tâche ?' },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.tacheService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Tâche supprimée', 'Fermer', { duration: 3000 });
          this.load();
          this.tacheChanged.emit();
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 }),
      });
    });
  }

  onSliderChange(id: number, avancement: number): void {
    this.tacheService.updateAvancement(id, avancement).subscribe({
      next: () => {
        this.load();
        this.tacheChanged.emit();
      },
      error: () =>
        this.snackBar.open('Erreur mise à jour avancement', 'Fermer', { duration: 3000 }),
    });
  }

  ouvrirAffecter(tache: TacheResponse): void {
    const dialogRef = this.dialog.open(EmployeDialog, {
      width: '480px',
      data: {
        tacheId:    tache.id,
        currentIds: tache.employes.map(e => e.id),
        allEmployes: this.allEmployes,
      },
    });

    dialogRef.afterClosed().subscribe((selectedIds: number[] | null) => {
      if (selectedIds === null || selectedIds === undefined) return;

      const currentSet = new Set(tache.employes.map(e => e.id));
      const newSet     = new Set(selectedIds);

      const toAdd    = [...newSet].filter(id => !currentSet.has(id));
      const toRemove = [...currentSet].filter(id => !newSet.has(id));

      const ops = [
        ...toAdd.map(id => this.employeService.affecterATache(tache.id, id)),
        ...toRemove.map(id => this.employeService.retirerDeTache(tache.id, id)),
      ];

      if (ops.length === 0) return;

      forkJoin(ops).subscribe({
        next: () => {
          this.load();
          this.tacheChanged.emit();
        },
        error: () => this.snackBar.open('Erreur lors de l\'affectation', 'Fermer', { duration: 3000 }),
      });
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':  return 'statut-en-cours';
      case 'TERMINEE':  return 'statut-terminee';
      case 'A_FAIRE':   return 'statut-a-faire';
      default:          return '';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS':  return 'En cours';
      case 'TERMINEE':  return 'Terminée';
      case 'A_FAIRE':   return 'À faire';
      default:          return statut;
    }
  }
}
