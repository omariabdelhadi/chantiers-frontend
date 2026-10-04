import { Component, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PhotoResponse } from '../../../core/models/photo.model';

export interface LightboxData {
  photos: PhotoResponse[];
  index: number;
}

@Component({
  selector: 'app-lightbox-dialog',
  standalone: false,
  templateUrl: './lightbox-dialog.html',
  styleUrl: './lightbox-dialog.scss',
})
export class LightboxDialog {
  current: number;

  constructor(
    public dialogRef: MatDialogRef<LightboxDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LightboxData,
    private cdr: ChangeDetectorRef,
  ) {
    this.current = data.index;
  }

  get photo(): PhotoResponse {
    return this.data.photos[this.current];
  }

  prev(): void {
    if (this.current > 0) {
      this.current--;
      this.cdr.detectChanges();
    }
  }

  next(): void {
    if (this.current < this.data.photos.length - 1) {
      this.current++;
      this.cdr.detectChanges();
    }
  }

  @HostListener('keydown.ArrowLeft') onLeft(): void { this.prev(); }
  @HostListener('keydown.ArrowRight') onRight(): void { this.next(); }
}
