import { Component, model } from '@angular/core';
import { Report } from '../dashboard/dashboard.component';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { checkToken } from '../utils/dateFormater';
import { Post } from '../services/posts.service';

@Component({
  selector: 'app-repoted-posts',
  standalone: true,
  imports: [],
  templateUrl: './repoted-posts.component.html',
  styleUrl: './repoted-posts.component.css',
})
export class RepotedPostsComponent /*  implements OnInit */ {
  baseUrl = environment.apiUrl;
  data: Post | null = null;
  public reports = model<Report[]>();
  constructor(private http: HttpClient, private rout: Router) {}
  getPost(i: number) {
    console.log('--------------------------------', i);
    const headers = checkToken();
    if (!headers.has('Authorization')) {
      this.rout.navigate(['/login']);
      return;
    }
    this.http
      .get<any>(`${this.baseUrl}/getPost/${i}?edit=false`, { headers })
      .subscribe({
        next: (res) => {
          this.data = { ...this.data, ...res };
        },
        error: (err) => {
          console.log('error', err.status);
        },
      });
  }
  // ngOnInit(): void {
  //   // This should now work without the NG0203 error
  //   console.log('Reports from Signal:', this.reports());

  //   // If you want to iterate:
  //   this.reports().forEach((element) => {
  //     console.log('Single report:', element);
  //   });
  // }
}
