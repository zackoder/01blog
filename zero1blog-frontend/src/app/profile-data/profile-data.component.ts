import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

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
  baseUrl: string = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}
  getProfileData() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.http.get(`${this.baseUrl}/profileData?id=`, { headers: { authorization: `Bearer ${token}` } });
  }
}
