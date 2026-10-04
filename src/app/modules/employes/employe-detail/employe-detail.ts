import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeService } from '../../../core/services/employe.service';
import { EmployeResponse } from '../../../core/models/employe.model';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-employe-detail',
  standalone: false,
  templateUrl: './employe-detail.html',
  styleUrl: './employe-detail.scss',
})
export class EmployeDetail implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  employe: EmployeResponse | null = null;
  loading = false;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeService: EmployeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.employeService.getById(id).subscribe({
      next: (data) => {
        this.employe = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Employé introuvable', 'Fermer', { duration: 3000 });
        this.router.navigate(['/employes']);
      },
    });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.employe) return;

    this.uploading = true;
    this.employeService.uploadPhoto(this.employe.id, file).subscribe({
      next: (updated) => {
        this.employe = updated;
        this.uploading = false;
        this.snackBar.open('Photo mise à jour', 'Fermer', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: () => {
        this.uploading = false;
        this.snackBar.open('Erreur lors du téléchargement', 'Fermer', { duration: 3000 });
        this.cdr.detectChanges();
      },
    });
    input.value = '';
  }

  confirmDeletePhoto(): void {
    if (!this.employe) return;
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: 'Supprimer la photo de cet employé ?' },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed || !this.employe) return;
      const id = this.employe.id;
      this.employeService.deletePhoto(id).subscribe({
        next: (updated) => {
          this.employe = updated;
          this.snackBar.open('Photo supprimée', 'Fermer', { duration: 3000 });
          this.cdr.detectChanges();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          this.cdr.detectChanges();
        },
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/employes']);
  }
}
