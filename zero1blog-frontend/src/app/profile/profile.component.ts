import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth-service.service.spec';
import { PostsComponent } from '../posts/posts.component';
import { ProfileDataComponent } from '../profile-data/profile-data.component';
import { ToastService } from '../services/toast.service';
import { checkToken } from '../utils/dateFormater';

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
    private toast: ToastService,
  ) {}
  fetchProfileData() {
    if (!this.rout.url.startsWith('/profile')) return;
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
    }

    // const nickname =

    // this.http.get(`${this.baseUrl}/profileData`);
  }
  ngOnInit(): void {
    this.fetchProfileData();
  }
}
