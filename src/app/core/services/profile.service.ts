import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ChangePasswordRequest, ProfileRequest, ProfileResponse } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly apiUrl = '/api/profile';

  private photoProfileSubject = new BehaviorSubject<string | null>(null);
  photoProfile$ = this.photoProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.apiUrl).pipe(
      tap(p => this.photoProfileSubject.next(p.photoProfile ?? null))
    );
  }

  getProfileById(id: number): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${id}`);
  }

  updateProfile(request: ProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.apiUrl, request);
  }

  uploadPhoto(file: File): Observable<ProfileResponse> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<ProfileResponse>(`${this.apiUrl}/photo`, fd).pipe(
      tap(p => this.photoProfileSubject.next(p.photoProfile ?? null))
    );
  }

  deletePhoto(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/photo`).pipe(
      tap(() => this.photoProfileSubject.next(null))
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/password`, request);
  }
}
