import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { checkToken } from '../utils/dateFormater';
import { ToastService } from '../services/toast.service';

interface Report {
  reportedPostId: number;
  reported: string;
  content: String;
}

@Component({
  selector: 'app-report',
  imports: [FormsModule, CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  report: Report = {
    reportedPostId: 0,
    reported: '',
    content: '',
  };
  reportReason = '';
  error = '';
  private baseUrl = environment.apiUrl;
  @Input() postId!: number;
  @Input() reported!: string;
  @Output() removeReportComponent = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
  ) {}

  onsubmitReport() {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }
    if (this.report.content.trim() === '') {
      this.error = "report can't be empty";
      return;
    }

    this.error = '';
    this.report.reportedPostId = this.postId;
    this.report.reported = this.reported;
    this.http
      .post(`${this.baseUrl}/report`, this.report, { headers })
      .subscribe({
        next: (res) => {
          this.error = '';
          this.toast.show('reported successfully');
          console.log(res);
        },
        error: (e) => {
          console.log(e);
          this.toast.show('could not report please try again');
        },
      });
  }
  closeReport() {
    this.removeReportComponent.emit(false);
  }
}
