// services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';

interface UserCredentials {
  id: number;
  nickname: string;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  private userDataSource = new BehaviorSubject<UserCredentials | null>(null);
  public userData$: Observable<UserCredentials | null> =
    this.userDataSource.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUserCredentials().subscribe();
  }

  fetchUserCredentials(): Observable<UserCredentials> {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.userDataSource.next(null);
      return new Observable();
    }

    this.loadingSubject.next(true);

    return this.http
      .get<UserCredentials>(`${this.baseUrl}/userCredentials`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((res) => {
          this.userDataSource.next(res);
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  logout() {
    localStorage.clear();
    this.userDataSource.next(null);
  }
}
