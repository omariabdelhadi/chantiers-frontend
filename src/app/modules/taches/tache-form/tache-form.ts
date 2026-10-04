import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { TacheService } from '../../../core/services/tache.service';
import { TacheRequest, StatutTache } from '../../../core/models/tache.model';

@Component({
  selector: 'app-tache-form',
  standalone: false,
  templateUrl: './tache-form.html',
  styleUrl: './tache-form.scss',
})
export class TacheForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  tacheId?: number;
  chantierId?: number;
  loading = false;
  submitting = false;
  errorMessage = '';

  statuts: StatutTache[] = ['A_FAIRE', 'EN_COURS', 'TERMINEE'];
  statutLabels: Record<StatutTache, string> = {
    A_FAIRE:  'À faire',
    EN_COURS: 'En cours',
    TERMINEE: 'Terminée',
  };

  constructor(
    private fb: FormBuilder,
    private tacheService: TacheService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      titre:       ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      statut:      ['A_FAIRE', Validators.required],
      avancement:  [0],
    });
  }

  ngOnInit(): void {
    const id          = this.route.snapshot.paramMap.get('id');
    const chantierId  = this.route.snapshot.paramMap.get('chantierId');

    if (id) {
      this.isEdit  = true;
      this.tacheId = +id;
      this.loading = true;
      this.tacheService.getById(this.tacheId).subscribe({
        next: (t) => {
          this.chantierId = t.chantierId;
          this.form.patchValue({
            titre:       t.titre,
            description: t.description,
            statut:      t.statut,
            avancement:  t.avancement,
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
    } else if (chantierId) {
      this.chantierId = +chantierId;
    }
  }

  get avancementValue(): number {
    return this.form.get('avancement')?.value ?? 0;
  }

  onSubmit(): void {
    if (this.form.invalid || !this.chantierId) return;
    this.submitting   = true;
    this.errorMessage = '';

    const request: TacheRequest = {
      ...this.form.value,
      avancement: +this.form.value.avancement,
      chantierId: this.chantierId,
    };

    const op = this.isEdit
      ? this.tacheService.update(this.tacheId!, request)
      : this.tacheService.create(request);

    op.pipe(
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => this.router.navigate(['/chantiers', this.chantierId]),
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde. Vérifiez les données saisies.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 4000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/chantiers', this.chantierId]);
  }
}
