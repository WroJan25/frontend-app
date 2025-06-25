import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {generateCodeChallenge, generateCodeVerifier} from '../util/pcke-builder';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient) {
    this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
        confirmPassword: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        birthDate: ['', [Validators.required]],
        isProfilePublic: [false],
        sendBudgetReports: [false]
      },
      {
        validators: this.passwordsMatchValidator,
        updateOn: 'submit'
      }
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : {'PasswordMismatch': true};
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    this.registerForm.markAllAsTouched();
    this.registerForm.updateValueAndValidity();
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.valid) {
      this.httpClient.post('http://localhost:8080/api/v1/auth/register', this.registerForm.getRawValue(), {withCredentials: true}).subscribe(
        {
          next: (response) => {
            alert("Registered successfully");
            this.httpClient.post('http://localhost:8080/api/v1/auth/refresh', {}, {
              withCredentials: true
            }).subscribe({
              error: (err) => {
                console.error('Refresh failed', err);
              }
            });
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error?.error?.detail || 'An error occurred during registration';
          }
        })
    } else {

    }
  }

  async onGoogleClick() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    sessionStorage.setItem('code_verifier', codeVerifier);
    const clientId = '85127282828-lnf1sukpijkgrolkrc9ahjc8m0tarvrs.apps.googleusercontent.com';
    const redirectUri = 'http://localhost:4200/oauth2/callback';
    const scope = 'openid email profile';
    const responseType = 'code';
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;
  }
}
