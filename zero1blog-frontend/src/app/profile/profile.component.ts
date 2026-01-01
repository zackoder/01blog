import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth-service.service.spec';
import { PostsComponent } from '../posts/posts.component';
import { ProfileDataComponent } from '../profile-data/profile-data.component';

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
    private auth: AuthService
  ) {}
  fetchProfileData() {
    console.log(this.rout.url.startsWith('/profile'));
    this.auth.userData$.subscribe({
      next: (data) => {
        console.log(data);
        this.data = data;
        console.log(data);
      },
    });

    this.http.get(`${this.baseUrl}/profileData`);
  }
  ngOnInit(): void {
    this.fetchProfileData();
  }
}
