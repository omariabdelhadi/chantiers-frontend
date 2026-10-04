import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeList } from './employe-list/employe-list';
import { EmployeForm } from './employe-form/employe-form';
import { EmployeDetail } from './employe-detail/employe-detail';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  { path: '',         component: EmployeList },
  { path: 'new',      component: EmployeForm },
  { path: ':id/edit', component: EmployeForm },
  { path: ':id',      component: EmployeDetail, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployesRoutingModule {}
