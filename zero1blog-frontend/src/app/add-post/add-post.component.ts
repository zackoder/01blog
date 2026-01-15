import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OffsetLimitService } from '../services/offset-limit.service'; // Assuming this service exists
import { environment } from '../../environments/environment.prod';
import { PostsService } from '../services/posts.service';
import { AuthService } from '../services/auth-service.service.spec';
import { checkToken } from '../utils/dateFormater';
import { ToastService, Type } from '../services/toast.service';

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

  userData: any = {
    id: 0,
    avatar: '',
    nickname: '',
  };

  err: string = '';

  selectedFile: File | null = null;
  private baseUrl = environment.apiUrl;
  isLoading: boolean = false;
  imagePreview: string | null = null;
  fileType: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private user: AuthService,
    private toasts: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user.userData$.subscribe({
      next: (data) => {
        console.log('data', data);
        if (data) {
          this.userData = data;
          this.isLoading = false;
        }
      },
    });

    if (this.router.url.startsWith('/edit')) {
      this.getPost();
    }
  }

  getPost() {
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    const pathValues = this.router.url.split('/');
    const id = pathValues[pathValues.length - 1];
    this.http
      .get<any>(`${this.baseUrl}/getPost/${id}?edit=true`, { headers })
      .subscribe({
        next: (res) => {
          this.data = { ...this.data, ...res };
        },
        error: (err) => {
          if (err.status === 400) {
            this.router.navigate(['/']);
            this.toasts.show(err.error);
            return;
          }
          console.log('error', err.status);
        },
      });
  }

  onSubmit(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.err = '';
    const headers = checkToken();

    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
    }

    if (!this.data.content.trim()) {
      this.err = 'you need to write something';
      return;
    }
    const formData = new FormData();
    const post = JSON.stringify(this.data);
    formData.append('content', new Blob([post], { type: 'application/json' }));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }
    if (this.router.url.startsWith('/addPost')) {
      this.addPost(headers, formData);
    }
    if (this.router.url.startsWith('/edit')) {
      this.updatePost(headers, formData);
    }
  }

  addPost(headers: HttpHeaders, formData: FormData) {
    this.http
      .post<[]>(`${this.baseUrl}/addPost`, formData, { headers })
      .subscribe({
        next: (res) => {
          this.data.content = '';
          this.selectedFile = null;
          this.isLoading = false;
          this.router.navigate(['/']);
          this.toasts.show('post created', Type.success);
        },
        error: (err) => {
          this.toasts.show(err.error.content, Type.error);
          this.isLoading = false;
        },
      });
  }

  updatePost(headers: HttpHeaders, formData: FormData) {
    this.http
      .put<[]>(`${this.baseUrl}/updatePost`, formData, { headers })
      .subscribe({
        next: (res) => {
          this.data.content = '';
          this.selectedFile = null;
          this.isLoading = false;
          this.router.navigate(['/']);
          this.toasts.show('post updated', Type.success);
        },
        error: (err) => {
          this.toasts.show(err.error.content, Type.error);
          this.isLoading = false;
        },
      });
  }

  OnSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFile = file;
      this.fileType = file.type;
      this.data.image_path = file;

      console.log('File selected:', file.name);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
      this.fileType = null;
    }
  }

  removeMedia(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileType = null;
    this.data.image_path = null;

    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
