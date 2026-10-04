import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeRequest, EmployeResponse } from '../models/employe.model';

@Injectable({ providedIn: 'root' })
export class EmployeService {
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeResponse[]> {
    return this.http.get<EmployeResponse[]>(`${this.apiUrl}/employes`);
  }

  getById(id: number): Observable<EmployeResponse> {
    return this.http.get<EmployeResponse>(`${this.apiUrl}/employes/${id}`);
  }

  create(request: EmployeRequest): Observable<EmployeResponse> {
    return this.http.post<EmployeResponse>(`${this.apiUrl}/employes`, request);
  }

  update(id: number, request: EmployeRequest): Observable<EmployeResponse> {
    return this.http.put<EmployeResponse>(`${this.apiUrl}/employes/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employes/${id}`);
  }

  affecterATache(tacheId: number, employeId: number): Observable<EmployeResponse> {
    return this.http.post<EmployeResponse>(`${this.apiUrl}/taches/${tacheId}/employes/${employeId}`, null);
  }

  retirerDeTache(tacheId: number, employeId: number): Observable<EmployeResponse> {
    return this.http.delete<EmployeResponse>(`${this.apiUrl}/taches/${tacheId}/employes/${employeId}`);
  }

  uploadPhoto(id: number, file: File): Observable<EmployeResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<EmployeResponse>(`${this.apiUrl}/employes/${id}/photo`, formData);
  }

  deletePhoto(id: number): Observable<EmployeResponse> {
    return this.http.delete<EmployeResponse>(`${this.apiUrl}/employes/${id}/photo`);
  }
}
