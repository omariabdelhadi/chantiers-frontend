import { ChantierResponse } from './chantier.model';

export interface StatsResponse {
  totalChantiers: number;
  totalChefs: number;
  totalAdmins: number;
  totalTaches: number;
  totalEmployes: number;
  chantiersEnCours: number;
  chantiersTermines: number;
  chantiersEnAttente: number;
  avancementMoyen: number;
  dernierChantiers: ChantierResponse[];
  chantiersUrgents: ChantierResponse[];
  chantiersEnRetard: ChantierResponse[];
}
