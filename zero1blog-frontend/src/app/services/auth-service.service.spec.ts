// services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {
    this.fetchUserCredentials().subscribe();
  }

  fetchUserCredentials(): Observable<UserCredentials> {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    this.loadingSubject.next(true);

    return this.http
      .get<UserCredentials>(`${this.baseUrl}/userCredentials`, { headers })
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
