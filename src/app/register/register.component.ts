import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

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

  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient) {
    this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)]],
        username: ['', [Validators.required]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['', [Validators.required]],
        isProfilePublic: [false],
        sendBudgetReports: [false]
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.httpClient.post('http://localhost:8080/api/v1/auth/register', this.registerForm.getRawValue(), {withCredentials: true}).subscribe(
        {
          next: (response) => {
            console.log("Delivered:", response);
            console.log(response);
            alert("Registered successfully");
            this.httpClient.post('http://localhost:8080/api/v1/auth/refresh', {}, {
              withCredentials: true
            }).subscribe({
              next: (response) => {
                console.log('Refresh successfully', response);
              },
              error: (err) => {
                console.error('Refresh failed', err);
              }
            });
            this.router.navigate(['/dashboard']);

          },
          error: (error) => {
            console.log(error);
            alert("Error detected")
          }
        })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onGoogleClick() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    //
  }
}

