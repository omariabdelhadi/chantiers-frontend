import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../../core/services/profile.service';
import { ProfileEventService } from '../../../core/services/profile-event.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileResponse } from '../../../core/models/profile.model';

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const nouveau = group.get('nouveauMotDePasse')?.value;
  const confirmer = group.get('confirmerMotDePasse')?.value;
  return nouveau && confirmer && nouveau !== confirmer ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  profile: ProfileResponse | null = null;
  loading = true;

  showEditForm = false;
  savingProfile = false;
  editForm: FormGroup;

  passwordForm: FormGroup;
  savingPassword = false;
  hideOld = true;
  hideNew = true;
  hideConfirm = true;

  constructor(
    private profileService: ProfileService,
    private profileEventService: ProfileEventService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.editForm = this.fb.group({
      nom: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
      ]],
      telephone: ['', [
        Validators.pattern('^[0-9]{8,15}$'),
      ]],
      ville: ['', [
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-ZÀ-ÿ\\s]+$'),
      ]],
    });

    this.passwordForm = this.fb.group({
      ancienMotDePasse:   ['', Validators.required],
      nouveauMotDePasse:  ['', [Validators.required, Validators.minLength(6)]],
      confirmerMotDePasse:['', Validators.required],
    }, { validators: passwordMatch });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // --- Photo ---

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    input.value = '';
    this.profileService.uploadPhoto(file).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.profileEventService.notify(updated);
        this.cdr.detectChanges();
        this.snackBar.open('Photo mise à jour avec succès', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du téléchargement de la photo', 'Fermer', { duration: 3000 });
      },
    });
  }

  onDeletePhoto(): void {
    this.profileService.deletePhoto().subscribe({
      next: () => {
        const updated: ProfileResponse = { ...this.profile!, photoProfile: null };
        this.profile = updated;
        this.profileEventService.notify(updated);
        this.cdr.detectChanges();
        this.snackBar.open('Photo supprimée', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression de la photo', 'Fermer', { duration: 3000 });
      },
    });
  }

  // --- Edit profile ---

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm && this.profile) {
      this.editForm.patchValue({
        nom:       this.profile.nom,
        telephone: this.profile.telephone ?? '',
        ville:     this.profile.ville ?? '',
      });
    }
  }

  onSaveProfile(): void {
    if (this.editForm.invalid) return;
    this.savingProfile = true;
    this.profileService.updateProfile(this.editForm.value).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.savingProfile = false;
        this.showEditForm = false;
        this.authService.updateNom(updated.nom);
        this.profileEventService.notify(updated);
        this.cdr.detectChanges();
        this.snackBar.open('Profil mis à jour', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.savingProfile = false;
        this.cdr.detectChanges();
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      },
    });
  }

  // --- Change password ---

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;
    this.savingPassword = true;
    const { ancienMotDePasse, nouveauMotDePasse } = this.passwordForm.value;
    this.profileService.changePassword({ ancienMotDePasse, nouveauMotDePasse }).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordForm.reset();
        this.cdr.detectChanges();
        this.snackBar.open('Mot de passe modifié avec succès', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        this.savingPassword = false;
        this.cdr.detectChanges();
        const msg = err.error?.message ?? 'Erreur lors du changement de mot de passe';
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
      },
    });
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrateur' : 'Chef de chantier';
  }
}
