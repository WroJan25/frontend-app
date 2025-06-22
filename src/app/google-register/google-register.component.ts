import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-google-register',
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './google-register.component.html',
  standalone: true,
  styleUrl: './google-register.component.css'
})
export class GoogleRegisterComponent {
  googleRegistrationForm: FormGroup;
  submitted = false;
  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient) {
    this.googleRegistrationForm = this.fb.group({
      username: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      sendBudgetReports: [false],
      isProfilePublic: [false]
    })
  }
  onSubmit() {
    this.submitted = true;
    if (this.googleRegistrationForm.invalid) {
      return;
    }else
    {
      this.httpClient.post('http://localhost:8080/api/v1/auth/register', this.googleRegistrationForm.getRawValue(),{withCredentials: true}).subscribe(
        {
          next: (response) => {
            console.log("Delivered:", response);
            alert("Logged In");
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
        }
      )

    }

  }
//jak dostanę 1003 error przy rejestracji to muszę go obsłużyć łączeniem kont
}
