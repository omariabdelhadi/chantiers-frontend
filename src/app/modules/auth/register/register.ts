import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponse } from '../../../core/models/user.model';
import { ConfirmDialog } from '../confirm-dialog';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  allUsers: UserResponse[]      = [];
  filteredUsers: UserResponse[] = [];
  loadingUsers = true;
  showForm = false;

  searchFilter = '';
  roleFilter   = '';

  registerForm: FormGroup;
  submitting = false;
  hidePassword = true;

  displayedColumns = ['nom', 'email', 'role', 'actions'];

  roles = [
    { value: 'ADMIN',         label: 'Administrateur' },
    { value: 'CHEF_CHANTIER', label: 'Chef de chantier' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.registerForm = this.fb.group({
      nom:        ['', [Validators.required, Validators.minLength(2)]],
      email:      ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role:       ['CHEF_CHANTIER', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.loadingUsers = false;
        this.applyFilters();
      },
      error: () => {
        this.loadingUsers = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters(): void {
    const search = this.searchFilter.trim().toLowerCase();
    const role   = this.roleFilter;
    this.filteredUsers = this.allUsers.filter(u => {
      const matchSearch = !search ||
        u.nom.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);
      const matchRole = !role || u.role === role;
      return matchSearch && matchRole;
    });
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchFilter  = '';
    this.roleFilter    = '';
    this.filteredUsers = [...this.allUsers];
    this.cdr.detectChanges();
  }

  canDelete(user: UserResponse): boolean {
    const myId = this.authService.getUserId();
    if (user.id === myId) return false;
    if (this.authService.isSuperAdmin()) return true;
    return user.role === 'CHEF_CHANTIER';
  }

  confirmDelete(user: UserResponse): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { message: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?` },
      width: '420px',
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          const msg = err.error?.message ?? 'Erreur lors de la suppression';
          this.snackBar.open(msg, 'Fermer', { duration: 4000 });
        },
      });
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.registerForm.reset({ role: 'CHEF_CHANTIER' });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.submitting = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.showForm = false;
        this.registerForm.reset({ role: 'CHEF_CHANTIER' });
        this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 400) {
          this.snackBar.open('Cet email est déjà utilisé.', 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
        }
      },
    });
  }

  viewProfile(id: number): void {
    this.router.navigate(['/profile', id]);
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Administrateur' : 'Chef de chantier';
  }
}
