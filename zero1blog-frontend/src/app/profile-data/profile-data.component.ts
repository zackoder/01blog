import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';

interface ProfileData {
  nickname: string;
  firstName: string;
  lastName: string;
  bio: string;
  isFollower: boolean;
  isOwner: boolean;
}

@Component({
  selector: 'app-profile-data',
  imports: [],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.css',
})
export class ProfileDataComponent implements OnInit {
  isLoading: boolean = false;
  userData: ProfileData = {
    nickname: '',
    lastName: '',
    firstName: '',
    bio: '',
    isFollower: false,
    isOwner: false,
  };
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    if (this.isLoading) return;
    this.isLoading = true;

    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }
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
    
  }
}
