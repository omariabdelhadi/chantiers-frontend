export interface AuthRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  role: 'ADMIN' | 'CHEF_CHANTIER';
}

export interface AuthResponse {
  id: number;
  token: string;
  email: string;
  role: string;
  nom: string;
}

export interface UserResponse {
  id: number;
  nom: string;
  email: string;
  role: string;
}
