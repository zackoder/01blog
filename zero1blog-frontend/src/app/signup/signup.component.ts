import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  data = {
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  };

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  errorMsg = {
    errNickname: '',
    errFirstName: '',
    errLastName: '',
    errEmail: '',
    errPassword: '',
    errConfirmPassword: '',
    errBio: '',
  };

  passwordValidation = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  };

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
  }

  onSignUp() {
    this.clearErrors();

    if (!this.validData()) {
      return;
    }

    this.isLoading = true;

    const formData = new FormData();

    const data = JSON.stringify(this.data);

    formData.append(
      'signupDto',
      new Blob([data], { type: 'application/json' })
    );

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    interface SignupResponse {
      success: boolean;
      message?: string;
      data?: any;
    }

    this.http
      .post<SignupResponse>('http://localhost:8080/api/register', formData)
      .subscribe({
        next: (response) => {
          if (!response.success) {
            if (response.message?.includes('Nickname')) {
              this.errorMsg.errNickname = response.message;
            } else if (response.message?.includes('Email')) {
              this.errorMsg.errEmail = response.message;
            }
          } else {
            this.router.navigate(['/login']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Signup failed:', error);
          this.isLoading = false;
        },
      });
  }

  clearErrors() {
    this.errorMsg = {
      errNickname: '',
      errFirstName: '',
      errLastName: '',
      errEmail: '',
      errPassword: '',
      errConfirmPassword: '',
      errBio: '',
    };
  }

  validData(): boolean {
    let valid = true;
    if (!this.data.email.trim()) {
      this.errorMsg.errEmail = 'You need to enter your email or nickname';
      valid = false;
    }
    if (!this.data.password) {
      this.errorMsg.errPassword = 'Enter your password';
      valid = false;
    }
    if (this.data.password !== this.data.confirmPassword) {
      this.errorMsg.errConfirmPassword = 'Passwords do not match';
      valid = false;
    }
    if (!this.isPasswordValid()) {
      this.errorMsg.errPassword =
        'Password must meet all the required criteria';
      valid = false;
    }
    return valid;
  }

  onPasswordChange(value: string) {
    this.data.password = value;
    this.validatePassword(value);
  }

  validatePassword(password: string) {
    this.passwordValidation.hasLowerCase = /[a-z]/.test(password);
    this.passwordValidation.hasUpperCase = /[A-Z]/.test(password);
    this.passwordValidation.hasNumber = /[0-9]/.test(password);
    this.passwordValidation.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
      password
    );
    this.passwordValidation.hasMinLength = password.length >= 8;
  }

  isPasswordValid(): boolean {
    return (
      this.passwordValidation.hasLowerCase &&
      this.passwordValidation.hasUpperCase &&
      this.passwordValidation.hasNumber &&
      this.passwordValidation.hasSpecialChar &&
      this.passwordValidation.hasMinLength
    );
  }

  login() {
    this.router.navigate(['/login']);
  }
}
