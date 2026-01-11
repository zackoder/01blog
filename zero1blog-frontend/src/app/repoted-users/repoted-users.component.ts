import { Component, input, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-repoted-users',
  imports: [],
  templateUrl: './repoted-users.component.html',
  styleUrl: './repoted-users.component.css',
})
export class RepotedUsersComponent {
  public reports = model<Report[]>();
}
