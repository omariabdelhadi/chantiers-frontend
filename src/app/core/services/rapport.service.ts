import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RapportRequest, RapportResponse } from '../models/rapport.model';

@Injectable({ providedIn: 'root' })
export class RapportService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getByChantier(chantierId: number): Observable<RapportResponse[]> {
    return this.http.get<RapportResponse[]>(`${this.apiUrl}/chantiers/${chantierId}/rapports`);
  }

  create(chantierId: number, request: RapportRequest): Observable<RapportResponse> {
    return this.http.post<RapportResponse>(`${this.apiUrl}/chantiers/${chantierId}/rapports`, request);
  }

  update(id: number, request: RapportRequest): Observable<RapportResponse> {
    return this.http.put<RapportResponse>(`${this.apiUrl}/rapports/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rapports/${id}`);
  }
}
