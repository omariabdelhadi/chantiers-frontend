import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeService } from '../../../core/services/employe.service';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeResponse } from '../../../core/models/employe.model';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-employe-list',
  standalone: false,
  templateUrl: './employe-list.html',
  styleUrl: './employe-list.scss',
})
export class EmployeList implements OnInit {
  displayedColumns: string[] = [];
  loading = false;

  allEmployes: EmployeResponse[] = [];
  filteredEmployes: EmployeResponse[] = [];
  postes: string[] = [];

  searchFilter = '';
  posteFilter  = '';

  constructor(
    private employeService: EmployeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.authService.getRole() === 'ADMIN'
      ? ['nom', 'prenom', 'poste', 'telephone', 'actions']
      : ['nom', 'prenom', 'poste', 'telephone'];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.employeService.getAll().subscribe({
      next: (data) => {
        this.allEmployes = data;
        this.postes = [...new Set(data.map(e => e.poste).filter(Boolean))].sort();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors du chargement des employés', 'Fermer', { duration: 3000 });
      },
    });
  }

  applyFilters(): void {
    const term = this.searchFilter.trim().toLowerCase();
    this.filteredEmployes = this.allEmployes.filter(e => {
      const matchSearch = !term ||
        e.nom.toLowerCase().includes(term) ||
        e.prenom.toLowerCase().includes(term);
      const matchPoste = !this.posteFilter || e.poste === this.posteFilter;
      return matchSearch && matchPoste;
    });
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchFilter = '';
    this.posteFilter  = '';
    this.applyFilters();
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  voir(id: number): void {
    this.router.navigate(['/employes', id]);
  }

  modifier(id: number): void {
    this.router.navigate(['/employes', id, 'edit']);
  }

  supprimer(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer cet employé ?' },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.employeService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Employé supprimé', 'Fermer', { duration: 3000 });
          this.load();
          this.cdr.detectChanges();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          this.cdr.detectChanges();
        },
      });
    });
  }
}
