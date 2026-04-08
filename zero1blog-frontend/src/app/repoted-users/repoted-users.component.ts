import { Component, input, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { checkToken, formatDate } from '../utils/dateFormater';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-repoted-users',
  imports: [],
  templateUrl: './repoted-users.component.html',
  styleUrl: './repoted-users.component.css',
})
export class RepotedUsersComponent {
  public reports = model<Report[]>();
  baseUrl = environment.apiUrl;

  userIndex: number = -1;
  banChecker: boolean = false;
  deleteChecker: boolean = false;
  targetUser: string = '';

  constructor(
    private http: HttpClient,
    private rout: Router,
    private toast: ToastService,
  ) {}

  viewUserDetails(index: number, reportId: number) {
    if (this.userIndex === index) {
      this.userIndex = -1;
    } else {
      this.userIndex = index;
      this.banChecker = false;
      this.deleteChecker = false;
    }
  }

  dismissReport(reportId: number) {
    this.reports.update((current) =>
      current ? current.filter((r) => r.id !== reportId) : [],
    );
    this.userIndex = -1;
  }

  confirmBan(nickname: string) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }

    this.http
      .post(`${this.baseUrl}/banUser`, { nickname, reason: '' }, { headers })
      .subscribe({
        next: () => {
          this.reports.update((current) =>
            current
              ? current.filter((r) => r.reportedNickname !== nickname)
              : [],
          );
          this.banChecker = false;
          this.userIndex = -1;
        },
        error: (err) => {
          this.toast.show(err.error.error);
          console.log('Ban failed', err);
        },
      });
  }

  confirmDelete(nickname: string) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      return;
    }

    this.http
      .delete(`${this.baseUrl}/deleteUser/${nickname}`, { headers })
      .subscribe({
        next: () => {
          this.reports.update((current) =>
            current
              ? current.filter((r) => r.reportedNickname !== nickname)
              : [],
          );
          this.deleteChecker = false;
          this.userIndex = -1;
        },
        error: (err) => {
          this.toast.show(err.error.error);
          console.log('Delete failed', err);
        },
      });
  }

  formatDate(timestamp: number) {
    return formatDate(timestamp);
  }
  goToProfile(nickname: string) {
    console.log('working');

    const profile = `/profile/${nickname}`;
    this.rout.navigate([profile]);
  }
}
