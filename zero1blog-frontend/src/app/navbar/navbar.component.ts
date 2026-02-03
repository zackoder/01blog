import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth-service.service.spec';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [],
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

  constructor(
    private router: Router,
    public auth: AuthService,
    private toast: ToastService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
        this.auth.ensureUserData().subscribe({
          next: (res) => {
            this.isAdmin = res?.role === 'admin';
            this.data = res;
          },
          error: (err) => {
            this.toast.show(err.error.error);
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
}
