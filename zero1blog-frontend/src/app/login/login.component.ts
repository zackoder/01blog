import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

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
    private toast: ToastService,
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
          if (response.token) {
            localStorage.setItem('jwtToken', response.token);
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          if (error.error.banned) {
            const duration = this.calculateDuration(
              error.error.duration / 1000,
            );
            this.toast.show(`${error.error.error} for ${duration}`);
          }

          console.log('Login failed:', error);
          this.errorMessage = 'please try again';
          this.isLoading = false;
        },
      });
  }

  calculateDuration(duration: number): string {
    let now = new Date().getTime();
    let oneMin = 60;
    let oneHour = oneMin * 60;
    let oneDay = oneHour * 24;
    let oneMon = oneDay * 30;

    if (duration >= oneMon) return Math.floor(duration / oneMon) + 'Mo';

    if (duration >= oneDay) return Math.floor(duration / oneDay) + 'D';
    if (duration >= oneHour) return Math.floor(duration / oneHour) + 'H';
    if (duration >= oneMin) return Math.floor(duration / oneMin) + 'Min';
    return 'error';
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
