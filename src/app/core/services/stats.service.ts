import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsResponse } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly apiUrl = '/api/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(this.apiUrl);
  }
}
