import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChantierList } from './chantier-list/chantier-list';
import { ChantierForm } from './chantier-form/chantier-form';
import { ChantierDetail } from './chantier-detail/chantier-detail';

const routes: Routes = [
  { path: '', component: ChantierList },
  { path: 'new', component: ChantierForm },
  { path: ':id/edit', component: ChantierForm },
  { path: ':id', component: ChantierDetail },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChantiersRoutingModule {}
