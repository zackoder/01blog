import { Component, model } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredentials } from '../services/auth-service.service.spec';

@Component({
  selector: 'app-all-users',
  imports: [],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css',
})
export class AllUsersComponent {
  public allUsers = model<UserCredentials[]>();

  constructor(private rout: Router) {}

  goToProfile(nickname: string) {
    const profile = `/profile/${nickname}`;
    this.rout.navigate([profile]);
  }
}
