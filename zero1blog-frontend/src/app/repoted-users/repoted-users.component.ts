import { Component, input, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '../utils/dateFormater';

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

  constructor(private http: HttpClient) {}

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
      current ? current.filter((r) => r.id !== reportId) : []
    );
    this.userIndex = -1;
  }

  confirmBan(nickname: string) {
    const jwt = localStorage.getItem('jwtToken');

    this.http
      .post(
        `${this.baseUrl}/user/ban`,
        null,
        {}
      )
      .subscribe({
        next: () => {
          this.reports.update((current) =>
            current
              ? current.filter((r) => r.reportedNickname !== nickname)
              : []
          );
          this.banChecker = false;
          this.userIndex = -1;
          alert(`User ${nickname} has been banned.`);
        },
        error: (err) => console.error('Ban failed', err),
      });
  }

  confirmDelete(nickname: string) {
    const jwt = localStorage.getItem('jwtToken');

    this.http
      .delete(`${this.baseUrl}/admin/user/${nickname}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .subscribe({
        next: () => {
          this.reports.update((current) =>
            current
              ? current.filter((r) => r.reportedNickname !== nickname)
              : []
          );
          this.deleteChecker = false;
          this.userIndex = -1;
        },
        error: (err) => console.error('Delete failed', err),
      });
  }

  formatDate(timestamp: number) {
    return formatDate(timestamp);
  }
}
