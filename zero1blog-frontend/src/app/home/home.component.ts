import { Component, OnInit } from '@angular/core';
import { PostsComponent } from '../posts/posts.component';
import { Router } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-home',
  imports: [PostsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}
}
