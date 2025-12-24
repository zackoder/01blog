import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OffsetLimitService } from '../services/offset-limit.service'; // Assuming this service exists
import { environment } from '../../environments/environment.prod';
import { PostsService } from '../services/posts.service';

@Component({
  selector: 'app-add-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent {
  content: string = '';
  selectedFile: File | null = null;
  private baseUrl = environment.apiUrl;

  // OffsetService = new OffsetLimitService();

  // posts = new PostsService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private OffsetService: OffsetLimitService,
    private posts: PostsService
  ) {}

  OnSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input);
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile.name);
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      console.warn('JWT Token not found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();

    formData.append('content', JSON.stringify({ content: this.content }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.http
      .post<[]>(`${this.baseUrl}/addPost`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          console.log('Post created successfully:', res);
          const priv_offset = this.OffsetService.getOffset();
          this.OffsetService.setOffset(priv_offset + 1);
          this.posts.addOnePost(res);
          console.log(this.posts.getPosts());

          // this.posts.setPosts();
          this.content = '';
          this.selectedFile = null;
        },
        error: (err) => console.error('Error during post creation:', err),
      });
  }
}
