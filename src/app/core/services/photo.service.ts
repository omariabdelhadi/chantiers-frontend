import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoResponse } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getByChantier(chantierId: number): Observable<PhotoResponse[]> {
    return this.http.get<PhotoResponse[]>(`${this.apiUrl}/chantiers/${chantierId}/photos`);
  }

  upload(chantierId: number, file: File): Observable<PhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PhotoResponse>(`${this.apiUrl}/chantiers/${chantierId}/photos`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/photos/${id}`);
  }
}
