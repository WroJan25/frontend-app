import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-panel-demo',
  imports: [],
  templateUrl: './user-panel-demo.component.html',
  standalone: true,
  styleUrl: './user-panel-demo.component.css'
})
export class UserPanelDemoComponent implements OnInit {
  userData: String = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<{ email: String }>('http://localhost:8080/api/v1/me', {withCredentials: true}).subscribe({
      next: (response) => {
        this.userData = response.email
      },
      error: (err) => {
        console.error('Error fetching user data', err);
      }
    });

  }


}
