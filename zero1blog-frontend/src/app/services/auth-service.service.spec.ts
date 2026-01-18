import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, finalize, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';

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

  constructor(private http: HttpClient) {}

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
        catchError(() => {
          this.clearUser();
          return of(null);
        }),
      );
  }

  clearUser() {
    this.userDataSource.next(null);
    localStorage.removeItem('token');
  }
}
// export class AuthService {
//   private baseUrl = environment.apiUrl;

//   private userDataSource = new BehaviorSubject<UserCredentials | null>(null);
//   public userData$: Observable<UserCredentials | null> =
//     this.userDataSource.asObservable();

//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   public isLoading$ = this.loadingSubject.asObservable();

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//   ) {}

//   fetchUserCredentials(): Observable<UserCredentials> {
//     const headers = checkToken();

//     if (!headers.has('Authorization')) {
//       this.router.navigate(['/login']);
//     }

//     this.loadingSubject.next(true);

//     return this.http
//       .get<UserCredentials>(`${this.baseUrl}/userCredentials`, { headers })
//       .pipe(
//         tap((res) => {
//           this.userDataSource.next(res);
//         }),
//         finalize(() => this.loadingSubject.next(false)),
//       );
//   }

//   subscribe() {
//     this.fetchUserCredentials().subscribe();
//   }

//   clearUser() {
//     this.userDataSource.next(null);
//   }

//   get userDataValue(): UserCredentials | null {
//     return this.userDataSource.value;
//   }
// }
