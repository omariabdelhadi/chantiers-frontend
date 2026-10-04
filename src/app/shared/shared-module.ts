import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';

@NgModule({
  declarations: [ConfirmDialog],
  imports: [MatDialogModule, MatButtonModule],
  exports: [ConfirmDialog, MatDialogModule],
})
export class SharedModule {}
