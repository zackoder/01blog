import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth-service.service.spec';

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

  constructor(private router: Router, public auth: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
        this.auth.ensureUserData().subscribe({
          next: (res) => {
            this.data = res;
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

  // userCredentials() {
  //   const headers = checkToken();

  //   if (this.currentPath === '/login' || this.currentPath === '/signup') return;
  //   if (!headers.has('Authorization')) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   if (this.isLoading) return;
  //   this.isLoading = true;
  //   this.http.get(`${this.baseUrl}/userCredentials`, { headers }).subscribe({
  //     next: (res) => {
  //       this.data = res;
  //       console.log(this.data);
  //       this.isAdmin = this.data.role === 'admin';
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

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
