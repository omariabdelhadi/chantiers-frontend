import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { ProfileView } from './profile-view/profile-view';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  { path: '', component: Profile },
  { path: ':id', component: ProfileView, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
