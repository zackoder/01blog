import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { checkToken } from '../utils/dateFormater';

@Component({
  selector: 'app-report',
  imports: [FormsModule, CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  reportReason = '';
  error = '';
  @Input() postId!: number;
  @Output() removeReportComponent = new EventEmitter<boolean>();
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}
  onsubmitReport() {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }
    if (this.reportReason.trim() === '') {
      this.error = "report can't be empty";
      return;
    }

    this.error = '';

    this.http
      .post(
        `${this.baseUrl}/report`,
        {
          target: 'post',
          targetId: this.postId,
          content: this.reportReason,
          createdAt: 0,
        },
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.error = '';
          console.log(res);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
  closeReport() {
    this.removeReportComponent.emit(false);
  }
}
