import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth-service.service.spec';
import { PostsComponent } from '../posts/posts.component';
import { ProfileDataComponent } from '../profile-data/profile-data.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [PostsComponent, ProfileDataComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  baseUrl = environment.apiUrl;
  data: any = {};
  constructor(
    private rout: Router,
    private http: HttpClient,
    private auth: AuthService,
    private toast: ToastService
  ) {}
  fetchProfileData() {
    if (!this.rout.url.startsWith('/profile')) return;
    this.auth.ensureUserData().subscribe({
      next: (res) => {
        this.data = res;
      },
      error: (err) => {
        this.toast.show(err.error.error);
      },
    });

    this.http.get(`${this.baseUrl}/profileData`);
  }
  ngOnInit(): void {
    this.fetchProfileData();
  }
}
