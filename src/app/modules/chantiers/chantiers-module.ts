import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedModule } from '../../shared/shared-module';
import { ChantiersRoutingModule } from './chantiers-routing-module';
import { ChantierList } from './chantier-list/chantier-list';
import { ChantierForm } from './chantier-form/chantier-form';
import { ChantierDetail } from './chantier-detail/chantier-detail';
import { TacheList } from '../taches/tache-list/tache-list';
import { EmployeDialog } from '../taches/employe-dialog/employe-dialog';
import { PhotoGallery } from './photo-gallery/photo-gallery';
import { LightboxDialog } from './photo-gallery/lightbox-dialog';
import { RapportList } from './rapport-list/rapport-list';
import { RapportDialog } from './rapport-dialog/rapport-dialog';

@NgModule({
  declarations: [ChantierList, ChantierForm, ChantierDetail, TacheList, EmployeDialog, PhotoGallery, LightboxDialog, RapportList, RapportDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    SharedModule,
    ChantiersRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSliderModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
})
export class ChantiersModule {}
