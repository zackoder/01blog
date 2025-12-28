import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OffsetLimitService } from '../services/offset-limit.service'; // Assuming this service exists
import { environment } from '../../environments/environment.prod';
import { PostsService } from '../services/posts.service';
import { AuthService } from '../services/auth-service.service.spec';
import { checkToken } from '../utils/dateFormater';

@Component({
  selector: 'app-add-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent implements OnInit {
  data: any = {
    content: '',
  };

  err: string = '';

  selectedFile: File | null = null;
  private baseUrl = environment.apiUrl;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private user: AuthService
  ) {}

  ngOnInit(): void {
    this.user.userData$.subscribe({
      next: (data) => {
        console.log('data', data);
        this.data.nickname = data?.nickname;
      },
    });

    if (this.router.url.startsWith('/edit')) {
      this.getPost();
    }
  }

  getPost() {
    const token = checkToken();

    if (!token) {
      this.router.navigate(['/login']);
    }

    const pathValues = this.router.url.split('/');
    const id = pathValues[pathValues.length - 1];
    this.http
      .get<any>(`${this.baseUrl}/getPost/${id}?edit=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.data = { ...this.data, ...res };
        },
        error: (err) => {
          if (err.status === 400) {
            this.router.navigate(['/']);
            return;
          }
          console.log('error', err.status);
        },
      });
  }

  OnSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile.name);
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.err = '';
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.warn('JWT Token not found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    formData.append('content', JSON.stringify(this.data));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    if (this.router.url.startsWith('/addPost')) {
      this.addPost(token, formData);
    }
    if (this.router.url.startsWith('/edit')) {
      this.updatePost(token, formData);
    }
  }

  addPost(token: string, formData: FormData) {
    this.http
      .post<[]>(`${this.baseUrl}/addPost`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.data.content = '';
          this.selectedFile = null;
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.err = err.error.error;
          this.isLoading = false;
        },
      });
  }

  updatePost(token: string, formData: FormData) {
    this.http
      .put<[]>(`${this.baseUrl}/updatePost`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.data.content = '';
          this.selectedFile = null;
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.err = err.error.error;
          this.isLoading = false;
        },
      });
  }
}
