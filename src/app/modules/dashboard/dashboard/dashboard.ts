import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Chart, ArcElement, DoughnutController,
  BarElement, BarController, CategoryScale, LinearScale,
  Legend, Tooltip,
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import { StatsService } from '../../../core/services/stats.service';
import { AuthService } from '../../../core/services/auth.service';
import { StatsResponse } from '../../../core/models/stats.model';
import { ChantierResponse } from '../../../core/models/chantier.model';

Chart.register(
  ArcElement, DoughnutController,
  BarElement, BarController,
  CategoryScale, LinearScale,
  Legend, Tooltip,
);

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats?: StatsResponse;
  loading = true;

  displayedColumns = ['nom', 'chef', 'statut', 'avancement'];

  readonly doughnutType = 'doughnut' as const;
  readonly barType = 'bar' as const;

  doughnutData: ChartData<'doughnut'> = {
    labels: ['En cours', 'Terminés', 'En attente'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#2196F3', '#4CAF50', '#FF9800'],
    }],
  };

  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  barData: ChartData<'bar'> = {
    labels: ['Avancement moyen'],
    datasets: [{
      data: [0],
      backgroundColor: '#673AB7',
      label: 'Avancement moyen (%)',
    }],
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: { y: { min: 0, max: 100 } },
    plugins: { legend: { display: false } },
  };

  constructor(
    private statsService: StatsService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.doughnutData = {
          labels: ['En cours', 'Terminés', 'En attente'],
          datasets: [{
            data: [data.chantiersEnCours, data.chantiersTermines, data.chantiersEnAttente],
            backgroundColor: ['#2196F3', '#4CAF50', '#FF9800'],
          }],
        };
        this.barData = {
          labels: ['Avancement moyen'],
          datasets: [{
            data: [Math.round(data.avancementMoyen * 10) / 10],
            backgroundColor: '#673AB7',
            label: 'Avancement moyen (%)',
          }],
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToChantier(row: ChantierResponse): void {
    this.router.navigate(['/chantiers', row.id]);
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'En cours';
      case 'TERMINE':    return 'Terminé';
      case 'EN_ATTENTE': return 'En attente';
      default:           return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS':   return 'statut-en-cours';
      case 'TERMINE':    return 'statut-termine';
      case 'EN_ATTENTE': return 'statut-en-attente';
      default:           return '';
    }
  }
}
