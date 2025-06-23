import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-oauth-callback',
  template: `<p>Logowanie przez Google</p>`,
  standalone: true
})
export class OauthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const codeVerifier = sessionStorage.getItem('code_verifier');

    if (!code || !codeVerifier) {
      alert('Verification code is missing');
      this.router.navigate(['/']);
      return;
    }

    this.http.post('http://localhost:8080/api/v1/oauth2/code/google', {
      code,
      codeVerifier
    }, { withCredentials: true }).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        console.error('Google login error', err);
        alert('Login failed. Please try again.');
        this.router.navigate(['/']);
      }
    });
  }
}
