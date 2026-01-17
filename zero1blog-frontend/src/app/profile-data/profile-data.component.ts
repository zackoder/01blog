import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { checkToken } from '../utils/dateFormater';
import { ReportComponent } from '../report/report.component';
import { AuthService } from '../services/auth-service.service.spec';
import { ToastService, Type } from '../services/toast.service';

interface ProfileData {
  id: number;
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
  standalone: true,
  imports: [ReportComponent],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.css',
})
export class ProfileDataComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  isLoadingFollow: boolean = false;
  reportForm: boolean = false;
  isAdmin: boolean = false;
  banChecker: boolean = false;
  deleteChecker: boolean = false;

  userData: ProfileData = {
    id: 0,
    nickname: '',
    lastName: '',
    firstName: '',
    bio: '',
    avatar: '',
    isFollower: false,
    isOwner: false,
  };

  baseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toasts: ToastService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getProfileData();
      }
    });
  }

  ngOnInit(): void {
    this.authService.userData$.subscribe((user) => {
      if (user) {
        this.isAdmin = user.role === 'admin';
      }
    });
    this.getProfileData();
  }

  ngOnDestroy(): void {
    this.isAdmin = false;
  }

  getProfileData() {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
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
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  confirmBan() {
    const headers = checkToken();
    const pathValues = this.router.url.split('/');
    const nickname = pathValues[pathValues.length - 1];
    const ban = {
      nickname,
      reason: '',
    };
    this.http.post(`${this.baseUrl}/banUser`, ban, { headers }).subscribe({
      next: () => {
        this.toasts.show('User has been banned', Type.success);
        this.banChecker = false;
      },
      error: (err) => {
        this.toasts.show(err.error || 'Failed to ban user', Type.error);
        this.banChecker = false;
      },
    });
  }

  confirmDelete() {
    const headers = checkToken();

    const pathValues = this.router.url.split('/');
    const nickname = pathValues[pathValues.length - 1];
    this.http
      .delete(`${this.baseUrl}/deleteUser/${nickname}`, { headers })
      .subscribe({
        next: () => {
          this.toasts.show('Account deleted successfully', Type.success);
          this.router.navigate(['/']);
        },
        error: () => {
          this.toasts.show('Failed to delete user', Type.error);
          this.deleteChecker = false;
        },
      });
  }

  follow() {
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.isLoadingFollow) return;
    this.isLoadingFollow = true;

    this.http
      .get<any>(
        `${this.baseUrl}/follow?followedNickname=${this.userData.nickname}`,
        { headers },
      )
      .subscribe({
        next: (res) => {
          this.userData.isFollower = res.message === 'followed';
          this.isLoadingFollow = false;
        },
        error: () => {
          this.isLoadingFollow = false;
        },
      });
  }
}
