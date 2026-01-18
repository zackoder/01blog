import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service.spec';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  data = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onLogin() {
    this.errorMessage = '';

    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;

    this.http
      .post<{
        token: string;
        success: boolean;
        message: string;
      }>('http://localhost:8080/api/login', this.data)
      .subscribe({
        next: (response) => {
          if (response.success && response.token) {
            localStorage.setItem('jwtToken', response.token);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'please try again';
          this.isLoading = false;
        },
      });
  }

  onPasswordChange(value: string) {
    this.data.password = value;
  }

  isFormValid(): boolean {
    return this.data.email.trim() !== '' && this.data.password.trim() !== '';
  }

  regester() {
    this.router.navigate(['/signup']);
  }
}
