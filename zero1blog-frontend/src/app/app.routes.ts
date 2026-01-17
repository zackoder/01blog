import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AddPostComponent } from './add-post/add-post.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'User Login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'User Sign Up',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'home',
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
  },

  {
    path: 'addPost',
    component: AddPostComponent,
    title: 'Create Post',
  },

  {
    path: 'edit/:index',
    component: AddPostComponent,
    title: 'Edit Post',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
  },
  // {
  //   path: "**"
  //   component:
  // }
];
