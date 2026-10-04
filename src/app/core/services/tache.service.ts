import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TacheRequest, TacheResponse } from '../models/tache.model';

@Injectable({ providedIn: 'root' })
export class TacheService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getTachesByChantier(chantierId: number): Observable<TacheResponse[]> {
    return this.http.get<TacheResponse[]>(`${this.apiUrl}/chantiers/${chantierId}/taches`);
  }

  getById(id: number): Observable<TacheResponse> {
    return this.http.get<TacheResponse>(`${this.apiUrl}/taches/${id}`);
  }

  create(request: TacheRequest): Observable<TacheResponse> {
    return this.http.post<TacheResponse>(`${this.apiUrl}/taches`, request);
  }

  update(id: number, request: TacheRequest): Observable<TacheResponse> {
    return this.http.put<TacheResponse>(`${this.apiUrl}/taches/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/taches/${id}`);
  }

  updateAvancement(id: number, avancement: number): Observable<TacheResponse> {
    return this.http.put<TacheResponse>(
      `${this.apiUrl}/taches/${id}/avancement`,
      null,
      { params: { avancement: avancement.toString() } }
    );
  }
}
