import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private httpClient: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    if (this.loginForm.valid) {

      this.httpClient.post('http://localhost:8080/api/v1/auth/login', this.loginForm.getRawValue(), {withCredentials: true}).subscribe(
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
        })

      alert("Logged In");
      console.log(this.loginForm.value);
    }
  }


}
