import { Component, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { checkStatus, checkToken } from '../utils/dateFormater';

interface Report {
  id: number;
  post_id: number;
  user_id: number;
  created_at: number;
  content: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  reports = signal<Report[]>([]);
  baseUrl = environment.apiUrl;
  type = 'post';
  constructor(private http: HttpClient, private rout: Router) {}
  ngOnInit(): void {
    this.reportsList(this.type);
  }
  reportsList(type: string): void {
    if (this.type !== type) {
      this.type = type;
      this.reports.set([]);
    }
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    this.http
      .get<Report[]>(`${this.baseUrl}/reports/${type}`, { headers })
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.reports.update((current) => [...current, ...res]);
        },
        error: (err) => {
          checkStatus(err, this.rout);
          console.log(err.status);
        },
      });
  }
}
