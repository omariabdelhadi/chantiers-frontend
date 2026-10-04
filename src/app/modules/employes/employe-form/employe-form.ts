import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { EmployeService } from '../../../core/services/employe.service';
import { EmployeRequest } from '../../../core/models/employe.model';

@Component({
  selector: 'app-employe-form',
  standalone: false,
  templateUrl: './employe-form.html',
  styleUrl: './employe-form.scss',
})
export class EmployeForm implements OnInit {
  form: FormGroup;
  isEdit = false;
  employeId?: number;
  loading = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom:       ['', [Validators.required, Validators.minLength(2)]],
      prenom:    ['', [Validators.required, Validators.minLength(2)]],
      poste:     ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit    = true;
      this.employeId = +id;
      this.loading   = true;
      this.employeService.getById(this.employeId).subscribe({
        next: (e) => {
          this.form.patchValue(e);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/employes']);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting   = true;
    this.errorMessage = '';

    const request: EmployeRequest = this.form.value;
    const op = this.isEdit
      ? this.employeService.update(this.employeId!, request)
      : this.employeService.create(request);

    op.pipe(
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => this.router.navigate(['/employes']),
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde. Vérifiez les données saisies.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 4000 });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/employes']);
  }
}
