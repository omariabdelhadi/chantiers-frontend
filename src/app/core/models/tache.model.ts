export type StatutTache = 'A_FAIRE' | 'EN_COURS' | 'TERMINEE';

import type { EmployeResponse } from './employe.model';
export type { EmployeResponse } from './employe.model';

export interface TacheRequest {
  titre: string;
  description: string;
  statut: StatutTache;
  avancement: number;
  chantierId: number;
}

export interface TacheResponse {
  id: number;
  titre: string;
  description: string;
  statut: StatutTache;
  avancement: number;
  chantierId: number;
  chantierNom: string;
  employes: EmployeResponse[];
}
