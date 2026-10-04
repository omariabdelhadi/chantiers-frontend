export interface ProfileRequest {
  nom: string;
  telephone: string | null;
  ville: string | null;
}

export interface ProfileResponse {
  id: number;
  nom: string;
  email: string;
  role: string;
  telephone: string | null;
  ville: string | null;
  photoProfile: string | null;
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}
