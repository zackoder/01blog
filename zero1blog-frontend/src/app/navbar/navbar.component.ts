import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  baseUrl = environment.apiUrl;
  show = false;
  isAdmin = true;
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
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return;
    }
    this.router.navigate([`/profile/${this.data.nickname}.${this.data.id}`]);
    this.show = false;
  }

  userCredentials() {
    if (this.isLoading) return;
    this.isLoading = true;
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // this.router.navigate(['/']);
      this.isLoading = false;
      return;
    }

    this.http
      .get(`${this.baseUrl}/userCredentials`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.data = res;
          console.log(this.data);
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
}
