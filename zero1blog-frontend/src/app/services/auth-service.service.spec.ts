import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';
import { Router } from '@angular/router';

interface UserCredentials {
  id: number;
  nickname: string;
  avatar: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userDataSource = new BehaviorSubject<UserCredentials | null>(null);

  get currentUser(): UserCredentials | null {
    return this.userDataSource.value;
  }

  constructor(
    private http: HttpClient,
    private rout: Router,
  ) {}

  ensureUserData(): Observable<UserCredentials | null> {
    if (this.userDataSource.value) {
      return of(this.userDataSource.value);
    }

    const headers = checkToken();
    if (!headers.has('Authorization')) {
      return of(null);
    }

    return this.http
      .get<UserCredentials>(`${environment.apiUrl}/userCredentials`, {
        headers,
      })
      .pipe(
        tap((user) => this.userDataSource.next(user)),
        catchError((err) => {
          this.clearUser();

          if (err.status === 404 && !this.rout.url.match('/signup')) {
            this.rout.navigate(['/login']);
            return of(null);
          }
          return of(err);
        }),
      );
  }

  clearUser() {
    this.userDataSource.next(null);
    localStorage.removeItem('token');
  }
}
