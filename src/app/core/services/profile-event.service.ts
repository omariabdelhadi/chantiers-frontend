import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileResponse } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileEventService {
  profileUpdated$ = new BehaviorSubject<ProfileResponse | null>(null);

  notify(profile: ProfileResponse): void {
    this.profileUpdated$.next(profile);
  }
}
