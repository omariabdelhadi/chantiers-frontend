import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface RapportDialogData {
  titre: string;
  contenu: string;
}

@Component({
  selector: 'app-rapport-dialog',
  standalone: false,
  templateUrl: './rapport-dialog.html',
})
export class RapportDialog {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<RapportDialog>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RapportDialogData | null,
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      titre: [data?.titre ?? '', [Validators.required, Validators.minLength(2)]],
      contenu: [data?.contenu ?? '', [Validators.required, Validators.minLength(5)]],
    });
  }

  confirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
