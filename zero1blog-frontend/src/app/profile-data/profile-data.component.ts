import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';

interface ProfileData {
  nickname: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  isFollower: boolean;
  isOwner: boolean;
}

@Component({
  selector: 'app-profile-data',
  imports: [],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.css',
})
export class ProfileDataComponent {
  isLoading: boolean = false;

  userData: ProfileData = {
    nickname: '',
    lastName: '',
    firstName: '',
    bio: '',
    avatar: '',
    isFollower: false,
    isOwner: false,
  };

  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getProfileData();
      }
    });
  }

  getProfileData() {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }
    if (!this.router.url.startsWith('/profile')) {
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;
    const pathValues = this.router.url.split('/');
    const nickname = pathValues[pathValues.length - 1];

    this.http
      .get<ProfileData>(`${this.baseUrl}/profileData?nickname=${nickname}`, {
        headers,
      })
      .subscribe({
        next: (data) => {
          this.userData = data;
          console.log('profile data', data);
          this.isLoading = false;
        },
        error: (err) => {
          console.log('error while getting data', err);
          this.isLoading = false;
        },
      });
  }

  follow() {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    const params = this.router.url.split('/');
    const followedNickname = params[params.length - 1];

    this.http
      .get<any>(`${this.baseUrl}/follow?followedNickname=${followedNickname}`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          this.userData.isFollower = res.message === 'followed';
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
