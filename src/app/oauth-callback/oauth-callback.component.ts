import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.css']
})
export class OauthCallbackComponent implements OnInit {
  linkRequired = false;
  linkForm: FormGroup;
  linkErrorMessage: string | null = null;

  private provider = '';
  private providerId = '';
  private userId = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.linkForm = this.fb.group({
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const codeVerifier = sessionStorage.getItem('code_verifier');

    if (!code || !codeVerifier) {
      alert('Brakuje kodu weryfikacyjnego');
      this.router.navigate(['/']);
      return;
    }

    this.http.post('http://localhost:8080/api/v1/oauth2/code/google', {
      code,
      codeVerifier
    }, { withCredentials: true }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        if (err.status === 409 && err.error?.provider && err.error?.providerId && err.error?.userId) {
          this.provider = err.error.provider;
          this.providerId = err.error.providerId;
          this.userId = err.error.userId;
          this.linkRequired = true;
        } else {
          console.error('Login error', err);
          alert('Błąd logowania');
          this.router.navigate(['/']);
        }
      }
    });
  }

  onLinkSubmit(): void {
    if (this.linkForm.invalid) return;

    const payload = {
      shouldLink: true,
      provider: this.provider,
      providerId: this.providerId,
      userId: this.userId,
      password: this.linkForm.value.password
    };

    this.http.post('http://localhost:8080/api/v1/oauth2/link', payload, { withCredentials: true }).subscribe({
      next: () => {
        this.linkRequired = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('Linking failed', err);
        this.linkErrorMessage = err?.error?.detail || 'Nie udało się połączyć kont';
      }
    });
  }
}
