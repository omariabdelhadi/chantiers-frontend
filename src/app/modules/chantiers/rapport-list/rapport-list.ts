import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RapportService } from '../../../core/services/rapport.service';
import { AuthService } from '../../../core/services/auth.service';
import { RapportResponse } from '../../../core/models/rapport.model';
import { RapportDialog } from '../rapport-dialog/rapport-dialog';
import type { RapportDialogData } from '../rapport-dialog/rapport-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-rapport-list',
  standalone: false,
  templateUrl: './rapport-list.html',
  styleUrl: './rapport-list.scss',
})
export class RapportList implements OnInit {
  @Input() chantierId!: number;

  rapports: RapportResponse[] = [];
  loading = false;

  constructor(
    private rapportService: RapportService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.rapportService.getByChantier(this.chantierId).subscribe({
      next: (rapports) => {
        this.rapports = rapports;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors du chargement des rapports', 'Fermer', { duration: 3000 });
      },
    });
  }

  ouvrirAjouter(): void {
    const dialogRef = this.dialog.open(RapportDialog, { width: '520px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.rapportService.create(this.chantierId, result).subscribe({
        next: () => {
          this.snackBar.open('Rapport créé avec succès', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la création du rapport', 'Fermer', { duration: 3000 });
        },
      });
    });
  }

  modifierRapport(rapport: RapportResponse): void {
    const data: RapportDialogData = { titre: rapport.titre, contenu: rapport.contenu };
    const dialogRef = this.dialog.open(RapportDialog, { width: '520px', data });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.rapportService.update(rapport.id, result).subscribe({
        next: () => {
          this.snackBar.open('Rapport modifié avec succès', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la modification du rapport', 'Fermer', { duration: 3000 });
        },
      });
    });
  }

  deleteRapport(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer ce rapport ?' },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.rapportService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Rapport supprimé', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        },
      });
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  canCreate(): boolean {
    const role = this.authService.getRole();
    return role === 'ADMIN' || role === 'CHEF_CHANTIER';
  }
}
