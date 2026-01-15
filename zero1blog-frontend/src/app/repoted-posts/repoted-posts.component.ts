import { Component, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  checkToken,
  formatDate as formatDateUtil,
} from '../utils/dateFormater';
import { Post } from '../services/posts.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-repoted-posts',
  standalone: true,
  imports: [CommentsComponent],
  templateUrl: './repoted-posts.component.html',
  styleUrl: './repoted-posts.component.css',
})
export class RepotedPostsComponent {
  baseUrl = environment.apiUrl;
  post: Post | null = null;
  isLoading = false;
  deleteChecker = false;
  showComments = false;
  targetedPostId = -1;
  reportIndex = -1;
  dropdown = false;

  public reports = model<Report[]>();
  constructor(private http: HttpClient, private rout: Router) {}
  getPost(index: number, i: number) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }

    this.post = null;
    if (index === this.reportIndex) {
      this.reportIndex = -1;
      console.log('this.reportIndex', this.reportIndex);
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;
    this.reportIndex = index;

    this.http
      .get<Post>(`${this.baseUrl}/getPost/${i}?edit=false`, { headers })
      .subscribe({
        next: (res) => {
          this.post = res;
          this.targetedPostId = this.post.id;
          this.isLoading = false;
        },
        error: (err) => {
          console.log('error', err.status);
          this.isLoading = false;
        },
      });
  }

  delete(postId: number) {
    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
      this.rout.navigate(['/login']);
      return;
    }

    this.http
      .delete<any>(`${this.baseUrl}/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .subscribe({
        next: (res) => {
          if (res.message === 'post deleted') {
            this.reports.update((currentReports) => {
              const filtered = currentReports?.filter(
                (report) => report.postId !== postId
              );
              return filtered || [];
            });
          }
        },
        error: (err) => console.error(err),
      });
  }
  goToProfile(nickname: string, id: number) {
    const profile = `/profile/${nickname}`;
    this.rout.navigate([profile]);
  }

  reaction(postId: number, reaction: string) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    if (!reaction || (reaction !== 'like' && reaction !== 'dislike')) return;

    this.http
      .post<any>(
        `${this.baseUrl}/reaction`,
        { target: 'post', targetId: postId, reactionType: reaction },
        { headers }
      )
      .subscribe({
        next: (res) => {
          if (!this.post) {
            return;
          }
          this.post.dislikes = res.dislikes;
          this.post.likes = res.likes;
          this.post.reacted = res.reacted;
        },
        error: (e) => console.error(e),
      });
  }
  formatDate(ceaiation: number) {
    return formatDateUtil(ceaiation);
  }

  toggle(id: number) {
    if (id == this.targetedPostId) this.targetedPostId = -1;
    else this.targetedPostId = id;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }
  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }
  dismissReport(report_id: number) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    console.log('report id', report_id);
    this.http
      .post(`${this.baseUrl}/hide/${report_id}`, null, { headers })
      .subscribe({
        next: (res) => {
          console.log('------------');
        },
        error: (err) => {
          console.log('error', err);
        },
      });
  }
}
