import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OffsetLimitService } from '../services/offset-limit.service';
import { ReportComponent } from '../report/report.component';
import { environment } from '../../environments/environment.prod';
import { Post, PostsService } from '../services/posts.service';
import { CommentsComponent } from '../comments/comments.component';
import {
  checkToken,
  formatDate as formatDateUtil,
} from '../utils/dateFormater';
import { ToastService, Type } from '../services/toast.service';
import { AuthService } from '../services/auth-service.service.spec';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-posts',
  imports: [ReportComponent, CommentsComponent, CommonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit, OnDestroy {
  private baseUrl = environment.apiUrl;
  nothingToFetch = false;
  isLoading = false;
  prevScrollPosition = window.pageYOffset;
  targetedPost = -1;
  reportForm = false;
  deleteChecker = false;
  showTargetedPostId = -1;
  currentPath = '';
  isAdmin: boolean = false;
  @Input() target: string = '';
  @Input() profileData: string | null = null;
  private routerSubscription: Subscription | null = null;

  constructor(
    private http: HttpClient,
    public router: Router,
    private offsetService: OffsetLimitService,
    public postsService: PostsService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.ensureUserData().subscribe({
      next: (res) => {
        this.isAdmin = res?.role === 'admin';
      },
      error: (err) => {
        console.log(err);
        this.toast.show(err.error.error);
      },
    });
    this.currentPath = this.router.url;
    this.routerSubscription = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.handleRouteChange();
      });
    this.fetchPosts(0);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
    this.postsService.deleteAll();
    this.offsetService.setOffset(0);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const newvScrollPosition = window.pageYOffset;
    if (newvScrollPosition < this.prevScrollPosition) return;
    this.prevScrollPosition = newvScrollPosition;

    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    if (this.prevScrollPosition + viewportHeight >= documentHeight - 200) {
      this.fetchPosts(this.offsetService.getOffset());
    }
  }

  handleRouteChange() {
    this.nothingToFetch = false;
    this.postsService.deleteAll();
    this.offsetService.setOffset(0);
    this.currentPath = this.router.url;
    this.fetchPosts(0);
  }

  fetchPosts(offset = 0) {
    if (this.isLoading) return;
    if (offset === 0) this.nothingToFetch = false;
    if (this.nothingToFetch) return;

    this.isLoading = true;
    let target = this.router.url;

    if (target === '/') target += 'getPosts';
    if (target.startsWith('/profile'))
      target = target.replace('/profile', '/userData');

    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      this.toast.show('you need to regester', Type.info);
      return;
    }

    this.http
      .get<Post[]>(`${this.baseUrl}${target}?offset=${offset}`, { headers })
      .subscribe({
        next: (data: Post[]) => {
          if (!Array.isArray(data) || data.length === 0) {
            this.nothingToFetch = true;
            this.isLoading = false;
            return;
          }
          this.postsService.setPosts(data);
          this.isLoading = false;
          this.targetedPost = -1;
          this.offsetService.setOffset(this.postsService.posts().length);
        },
        error: (err) => {
          if (err.status === 401) this.router.navigate(['/login']);
          this.isLoading = false;
        },
      });
  }

  reaction(postId: number, reaction: string, index: number) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
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
          const targetedPost = this.postsService.posts()[index];
          targetedPost.dislikes = res.dislikes;
          targetedPost.likes = res.likes;
          targetedPost.reacted = res.reacted;
        },
        error: (e) => console.log(e),
      });
  }

  formatDate(ceaiation: number) {
    return formatDateUtil(ceaiation);
  }

  toggle(index: number) {
    if (index == this.targetedPost) this.targetedPost = -1;
    else this.targetedPost = index;
  }

  closeReport(event: boolean) {
    this.reportForm = event;
  }

  delete(index: number) {
    const jwt = localStorage.getItem('jwtToken');
    if (!jwt) {
      this.router.navigate(['/login']);
      return;
    }
    const postId = this.postsService.posts()[index].id;

    this.http
      .delete<any>(`${this.baseUrl}/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .subscribe({
        next: (res) => {
          if (res.message === 'post deleted') {
            this.postsService.deletePost(index);
            this.offsetService.setOffset(this.postsService.posts().length);
            this.deleteChecker = false;
            this.targetedPost = -1;
            this.toast.show(res.message, Type.success);
          }
        },
        error: (err) => console.log(err),
      });
  }

  goToProfile(nickname: string, id: number) {
    const profile = `/profile/${nickname}`;
    this.router.navigate([profile]);
  }

  editPost(i: number) {
    this.router.navigate([`/edit/${i}`]);
  }

  dismissPost(post_id: number) {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
    }
    console.log('report id', post_id);
    this.http
      .post(`${this.baseUrl}/hide/${post_id}`, null, { headers })
      .subscribe({
        next: (res: any) => {
          this.toast.show(`post ${res.message}`);
        },
        error: (err) => {
          console.log('error', err);
        },
      });
  }
}
