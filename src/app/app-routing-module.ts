import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundGuard } from './core/guards/not-found.guard';
import { NotFound } from './modules/not-found/not-found';

const routes: Routes = [
  { path: '', redirectTo: 'chantiers', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth-module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard-module').then(m => m.DashboardModule),
  },
  {
    path: 'chantiers',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/chantiers/chantiers-module').then(m => m.ChantiersModule),
  },
  {
    path: 'taches',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/taches/taches-module').then(m => m.TachesModule),
  },
  {
    path: 'employes',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/employes/employes-module').then(m => m.EmployesModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/profile/profile-module').then(m => m.ProfileModule),
  },
  { path: 'not-found', component: NotFound, canActivate: [NotFoundGuard] },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
