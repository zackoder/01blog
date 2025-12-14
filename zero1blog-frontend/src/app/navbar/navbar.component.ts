import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Router, NavigationEnd } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  baseUrl = environment.apiUrl;
  show = false;
  isAdmin = true;
  isLoading = false;
  data: any;
  currentPath!: string;
  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.userCredentials();
        this.currentPath = this.router.url;
        console.log(this.currentPath);
      }
    });
  }
  ngOnDestroy() {
    
  }

  openProfile() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([`/profile/${this.data.nickname}.${this.data.id}`]);
  }

  userCredentials() {
    if (this.isLoading) return;
    this.isLoading = true;
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // if (this.router.url !== '/signup') {
      //   this.router.navigate(['/login']);
      // }
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
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
