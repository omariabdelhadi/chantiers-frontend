import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TacheForm } from './tache-form/tache-form';
import { TacheDetail } from './tache-detail/tache-detail';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: 'new/:chantierId', component: TacheForm },
  { path: ':id/edit',        component: TacheForm },
  { path: ':id',             component: TacheDetail, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TachesRoutingModule {}
