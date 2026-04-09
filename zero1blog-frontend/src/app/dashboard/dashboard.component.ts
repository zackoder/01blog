import { Component, OnInit, Signal, signal } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { checkStatus, checkToken } from '../utils/dateFormater';
import { RepotedPostsComponent } from '../repoted-posts/repoted-posts.component';
import { RepotedUsersComponent } from '../repoted-users/repoted-users.component';
import { UserCredentials } from '../services/auth-service.service.spec';
import { AllUsersComponent } from '../all-users/all-users.component';

export interface Report {
  id: number;
  postId: number;
  reporterNickname: string;
  reportedNickname: string;
  reportedAt: number;
  content: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RepotedPostsComponent, RepotedUsersComponent, AllUsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  reports = signal<Report[]>([]);
  baseUrl = environment.apiUrl;
  type = 'post';
  isLoading = false;
  allUsers = signal<UserCredentials[]>([]);
  constructor(
    private http: HttpClient,
    private rout: Router,
  ) {}
  ngOnInit(): void {
    this.reportsList(this.type);
  }
  reportsList(type: string): void {
    if (this.type !== type) {
      this.type = type;
      this.reports.set([]);
      this.allUsers.set([]);
    }
    if (type === this.type && this.reports().length !== 0) {
      return;
    }
    if (this.isLoading) return;
    this.isLoading = true;
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    this.http
      .get<Report[]>(`${this.baseUrl}/reports/${type}`, { headers })
      .subscribe({
        next: (res) => {
          this.reports.update((current) => [...current, ...res]);
          this.isLoading = false;
          console.log(this.reports());
        },
        error: (err) => {
          checkStatus(err, this.rout);
          this.isLoading = false;
          console.log(err.status);
        },
      });
  }
  getAllUsers() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.type = 'allUser';
    this.reports.set([]);
    this.http
      .get<
        UserCredentials[]
      >(`${this.baseUrl}/allUsers`, { headers: checkToken() })
      .subscribe({
        next: (res: UserCredentials[]) => {
          this.allUsers.set(res);
          this.isLoading = false;
        },
        error: (err) => {
          checkStatus(err, this.rout);
          this.isLoading = false;
          console.log(err.status);
        },
      });
  }
}
