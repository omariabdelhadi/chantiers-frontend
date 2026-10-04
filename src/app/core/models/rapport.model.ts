export interface RapportRequest {
  titre: string;
  contenu: string;
}

export interface RapportResponse {
  id: number;
  titre: string;
  contenu: string;
  dateCreation: string;
  chantierNom: string;
  auteurNom: string;
}
