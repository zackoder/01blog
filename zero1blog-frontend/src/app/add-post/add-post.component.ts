import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';
import { AuthService } from '../services/auth-service.service.spec';
import { checkToken } from '../utils/dateFormater';
import { ToastService, Type } from '../services/toast.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent implements OnInit {
  data: any = {
    content: '',
    image_path: null,
    id: null,
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
    private toasts: ToastService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user.ensureUserData().subscribe({
      next: (res) => {
        this.userData = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toasts.show(err.error.error);
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
      return;
    }

    const pathValues = this.router.url.split('/');
    const id = pathValues[pathValues.length - 1];

    this.http
      .get<any>(`${this.baseUrl}/getPost/${id}?edit=true`, { headers })
      .subscribe({
        next: (res) => {
          this.data = { ...this.data, ...res };

          if (this.data.image_path) {
            const path = this.data.image_path.toLowerCase();
            if (path.match(/\.(mp4|webm|ogg|mov)$/)) {
              this.fileType = 'video/mp4';
            } else {
              this.fileType = 'image/jpeg';
            }
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.router.navigate(['/']);
            this.toasts.show(err.error);
          }
        },
      });
  }

  onSubmit(): void {
    if (this.isLoading) return;

    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.data.content.trim()) {
      this.err = 'You need to write something';
      return;
    }

    this.isLoading = true;
    this.err = '';

    const formData = new FormData();
    const postPayload = {
      id: this.data.id,
      content: this.data.content,
      image_path: this.data.image_path,
    };

    formData.append(
      'content',
      new Blob([JSON.stringify(postPayload)], { type: 'application/json' }),
    );

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    if (this.router.url.startsWith('/addPost')) {
      this.addPost(headers, formData);
    } else if (this.router.url.startsWith('/edit')) {
      this.updatePost(headers, formData);
    }
  }

  addPost(headers: HttpHeaders, formData: FormData) {
    this.http.post(`${this.baseUrl}/addPost`, formData, { headers }).subscribe({
      next: () => this.handleSuccess('Post created'),
      error: (err) => this.handleError(err),
    });
  }

  updatePost(headers: HttpHeaders, formData: FormData) {
    this.http
      .put(`${this.baseUrl}/updatePost`, formData, { headers })
      .subscribe({
        next: () => this.handleSuccess('Post updated'),
        error: (err) => this.handleError(err),
      });
  }

  private handleSuccess(message: string) {
    this.isLoading = false;
    this.router.navigate(['/']);
    this.toasts.show(message, Type.success);
  }

  private handleError(err: any) {
    this.isLoading = false;
    const errorMsg = err.error?.content || 'An error occurred';
    this.toasts.show(errorMsg, Type.error);
  }

  OnSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      const file = input.files[0];
      this.selectedFile = file;
      this.fileType = file.type;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
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
