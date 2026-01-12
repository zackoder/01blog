import { Component, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { checkToken } from '../utils/dateFormater';
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
  public reports = model<Report[]>();
  constructor(private http: HttpClient, private rout: Router) {}
  getPost(i: number) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    if (this.isLoading) return;
    this.isLoading = true;
    this.http
      .get<Post>(`${this.baseUrl}/getPost/${i}?edit=false`, { headers })
      .subscribe({
        next: (res) => {
          this.post = res;
          console.log(this.post);
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

  reaction(postId: number, reaction: string, index: number) {
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
}
