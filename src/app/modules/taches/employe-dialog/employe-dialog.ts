import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeResponse } from '../../../core/models/employe.model';

export interface EmployeDialogData {
  tacheId: number;
  currentIds: number[];
  allEmployes: EmployeResponse[];
}

@Component({
  selector: 'app-employe-dialog',
  standalone: false,
  templateUrl: './employe-dialog.html',
  styleUrl: './employe-dialog.scss',
})
export class EmployeDialog {
  selectedIds: Set<number>;

  constructor(
    public dialogRef: MatDialogRef<EmployeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeDialogData,
  ) {
    this.selectedIds = new Set(data.currentIds);
  }

  toggle(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  confirm(): void {
    this.dialogRef.close(Array.from(this.selectedIds));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
