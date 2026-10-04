import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { ChantierService } from '../../../core/services/chantier.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChantierRequest, Statut } from '../../../core/models/chantier.model';
import { UserResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-chantier-form',
  standalone: false,
  templateUrl: './chantier-form.html',
  styleUrl: './chantier-form.scss',
})
export class ChantierForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  chantierId?: number;
  loading = false;
  submitting = false;
  errorMessage = '';

  users: UserResponse[] = [];
  usersLoading = true;

  statuts: Statut[] = ['EN_ATTENTE', 'EN_COURS', 'TERMINE'];
  statutLabels: Record<Statut, string> = {
    EN_ATTENTE: 'En attente',
    EN_COURS:   'En cours',
    TERMINE:    'Terminé',
  };

  constructor(
    private fb: FormBuilder,
    private chantierService: ChantierService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom:         ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      dateDebut:   [null],
      dateFin:     [null],
      statut:      ['EN_ATTENTE', Validators.required],
      chefId:      [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit    = true;
      this.chantierId = +id;
      this.loading   = true;
      this.chantierService.getById(this.chantierId).subscribe({
        next: (c) => {
          this.form.patchValue({
            nom:         c.nom,
            description: c.description,
            dateDebut:   c.dateDebut,
            dateFin:     c.dateFin,
            statut:      c.statut,
            chefId:      c.chefId,
          });
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/chantiers']);
        },
      });
    }
  }

  private loadUsers(): void {
    this.usersLoading = true;
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.usersLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.usersLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Impossible de charger la liste des utilisateurs', 'Fermer', { duration: 3000 });
      },
    });
  }

  getRoleLabel(role: string): string {
    return role === 'ADMIN' ? 'Admin' : 'Chef de chantier';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting   = true;
    this.errorMessage = '';

    const request: ChantierRequest = { ...this.form.value };

    const op = this.isEdit
      ? this.chantierService.update(this.chantierId!, request)
      : this.chantierService.create(request);

    op.pipe(
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => this.router.navigate(['/chantiers']),
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde. Vérifiez les données saisies.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 4000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/chantiers']);
  }
}
