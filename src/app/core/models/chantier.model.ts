export type Statut = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';

export interface ChantierRequest {
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: Statut;
  chefId: number;
}

export interface ChantierResponse {
  id: number;
  nom: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  statut: Statut;
  avancement: number;
  chefId: number;
  chefNom: string;
  chefTelephone: string | null;
  chefVille: string | null;
  nombreTaches: number;
}
