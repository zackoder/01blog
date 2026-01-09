import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { checkToken } from '../utils/dateFormater';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  baseUrl = environment.apiUrl;
  show = false;
  isAdmin = false;
  isLoading = false;
  data: any;
  currentPath: string = '';

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
        this.userCredentials();
      }
    });
  }

  openProfile() {
    this.router.navigate([`/profile/${this.data.nickname}`]);
    this.show = false;
  }

  userCredentials() {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      if (this.router.url === '/login' || this.router.url === '/signup') return;
      this.router.navigate(['/login']);
    }

    if (this.isLoading) return;
    this.isLoading = true;
    this.http.get(`${this.baseUrl}/userCredentials`, { headers }).subscribe({
      next: (res) => {
        this.data = res;
        console.log(this.data);
        this.isAdmin = this.data.role === 'admin';
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  toggle() {
    this.show = !this.show;
  }

  logout() {
    localStorage.clear();
    this.show = false;
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
