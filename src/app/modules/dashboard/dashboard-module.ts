import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';

@NgModule({
  declarations: [Dashboard],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    BaseChartDirective,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class DashboardModule {}
