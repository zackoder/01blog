import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { checkToken, formatDate } from '../utils/dateFormater';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  comment: string = '';
  error: string = '';
  isLoading = false;
  comments: any[] = [];
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('getting comments');
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    this.http
      .get<any[]>(`${this.baseUrl}/getComments?id=${this.postId}`, { headers })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.comments = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSubmit() {
    console.log(this.postId);
    console.log(this.comment);

    if (this.isLoading) {
      return;
    }

    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    if (!this.comment.trim()) {
      this.error = 'you need to enter something';
      return;
    }
    this.isLoading = true;
    this.error = '';
    this.http
      .post(
        `${this.baseUrl}/addComment`,
        {
          postId: this.postId,
          comment: this.comment,
        },
        { headers }
      )
      .subscribe({
        next: (res) => {
          console.log('res', res);
          this.isLoading = false;
          this.comment = '';
        },
        error: (e) => {
          console.log('error', e);
          this.isLoading = false;
        },
      });
  }

  dateFormatter(creationDate: number): string {
    return formatDate(creationDate);
  }
}
