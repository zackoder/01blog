import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth-service.service.spec';
import { ToastService } from '../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { checkToken, formatDate } from '../utils/dateFormater';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  baseUrl = environment.apiUrl;
  show = false;
  isAdmin = false;
  isLoading = false;
  data: any;
  currentPath: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  selectedIndex: number = -1;
  notifications: any[] = [];
  showNotifications = false;

  constructor(
    private router: Router,
    public auth: AuthService,
    private toast: ToastService,
    private http: HttpClient,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
        this.isLoading = true;
        this.auth.ensureUserData().subscribe({
          next: (res: any) => {
            this.isAdmin = res?.role === 'admin';
            this.data = res;
            this.isLoading = false;
          },
          error: (err: any) => {
            this.toast.show(err.error.error);
            this.isLoading = false;
          },
        });
      }
    });
  }

  ngOnInit(): void {}

  openProfile() {
    this.router.navigate([`/profile/${this.data.nickname}`]);
    this.show = false;
  }

  toggle() {
    this.show = !this.show;
  }

  logout() {
    this.show = false;
    localStorage.clear();
    this.auth.clearUser();
    this.router.navigate(['/login']);
  }

  goHome() {
    this.show = false;
    this.router.navigate(['/']);
  }
  navigateToAddPost() {
    this.show = false;
    this.router.navigate(['/addPost']);
  }

  goToDashboard() {
    this.show = false;
    this.router.navigate(['/dashboard']);
  }

  onSearch() {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.searchQuery.trim() !== '') {
      this.http
        .get<any[]>(`${this.baseUrl}/search?query=${this.searchQuery}`, {
          headers,
        })
        .subscribe({
          next: (res) => {
            this.searchResults = res;
            this.showSearchResults = true;
            this.selectedIndex = -1;
          },
          error: (err) => {
            console.log('search err', err);
          },
        });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.showSearchResults && this.searchResults.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex =
          (this.selectedIndex + 1) % this.searchResults.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex =
          (this.selectedIndex - 1 + this.searchResults.length) %
          this.searchResults.length;
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (this.selectedIndex >= 0) {
          this.navigateToProfile(
            this.searchResults[this.selectedIndex].nickname,
          );
        } else {
          this.onSearch();
        }
      } else if (event.key === 'Escape') {
        this.showSearchResults = false;
      }
    } else if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  navigateToProfile(nickname: string) {
    this.router.navigate([`/profile/${nickname}`]);
    this.showSearchResults = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  checkNotifications() {
    if (!this.showNotifications) return;
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>(`${this.baseUrl}/notifications`, { headers }).subscribe({
      next: (res) => {
        this.notifications = res;
      },
      error: (err) => {
        console.log('notification error', err);
      },
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  formatDate(createdAt: number): string {
    return formatDate(createdAt);
  }
}
