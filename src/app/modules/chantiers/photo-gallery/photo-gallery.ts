import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PhotoService } from '../../../core/services/photo.service';
import { AuthService } from '../../../core/services/auth.service';
import { PhotoResponse } from '../../../core/models/photo.model';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { LightboxDialog } from './lightbox-dialog';

@Component({
  selector: 'app-photo-gallery',
  standalone: false,
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.scss',
})
export class PhotoGallery implements OnInit {
  @Input() chantierId!: number;

  photos: PhotoResponse[] = [];
  loading = false;
  uploading = false;

  constructor(
    private photoService: PhotoService,
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
    this.photoService.getByChantier(this.chantierId).subscribe({
      next: (photos) => {
        this.photos = photos;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors du chargement des photos', 'Fermer', { duration: 3000 });
      },
    });
  }

  onFileSelected(event: Event, fileInput: HTMLInputElement): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.uploading = true;
    this.photoService.upload(this.chantierId, file).subscribe({
      next: () => {
        this.uploading = false;
        this.snackBar.open('Photo ajoutée avec succès', 'Fermer', { duration: 3000 });
        fileInput.value = '';
        this.load();
      },
      error: () => {
        this.uploading = false;
        this.cdr.detectChanges();
        this.snackBar.open("Erreur lors de l'upload", 'Fermer', { duration: 3000 });
      },
    });
  }

  deletePhoto(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer cette photo ?' },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.photoService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Photo supprimée', 'Fermer', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        },
      });
    });
  }

  openLightbox(index: number): void {
    this.dialog.open(LightboxDialog, {
      data: { photos: this.photos, index },
      panelClass: 'lightbox-panel',
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100vw',
      height: '100vh',
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  canUpload(): boolean {
    const role = this.authService.getRole();
    return role === 'ADMIN' || role === 'CHEF_CHANTIER';
  }
}
