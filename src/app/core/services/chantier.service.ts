import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChantierRequest, ChantierResponse } from '../models/chantier.model';

@Injectable({ providedIn: 'root' })
export class ChantierService {
  private readonly apiUrl = '/api/chantiers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ChantierResponse[]> {
    return this.http.get<ChantierResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<ChantierResponse> {
    return this.http.get<ChantierResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: ChantierRequest): Observable<ChantierResponse> {
    return this.http.post<ChantierResponse>(this.apiUrl, request);
  }

  update(id: number, request: ChantierRequest): Observable<ChantierResponse> {
    return this.http.put<ChantierResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateAvancement(id: number, avancement: number): Observable<ChantierResponse> {
    return this.http.put<ChantierResponse>(`${this.apiUrl}/${id}/avancement`, avancement);
  }

  searchChantiers(nom?: string, statut?: string, chefId?: number): Observable<ChantierResponse[]> {
    let params = new HttpParams();
    if (nom)          params = params.set('nom', nom);
    if (statut)       params = params.set('statut', statut);
    if (chefId != null) params = params.set('chefId', String(chefId));
    return this.http.get<ChantierResponse[]>(`${this.apiUrl}/search`, { params });
  }

  exportPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export-pdf`, { responseType: 'blob' });
  }
}
