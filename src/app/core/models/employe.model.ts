export interface EmployeRequest {
  nom: string;
  prenom: string;
  poste: string;
  telephone: string;
}

export interface EmployeResponse {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  telephone?: string;
  photo?: string;
}
