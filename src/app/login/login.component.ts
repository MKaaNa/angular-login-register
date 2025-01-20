import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { HttpClient } from '@angular/common/http';  // HttpClient import
import { Router } from '@angular/router';  // Router'ı import et

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formdata = { email: "", password: "" };
  submit = false;
  loading = false;
  errorMessage = "";
  http: HttpClient;  // Define HttpClient

  // Router'ı constructor'a ekle
  constructor(private auth: AuthService, httpClient: HttpClient, private router: Router) {
    this.http = httpClient; // Initialize HttpClient
  }

  ngOnInit(): void {
    this.auth.canAuthenticate();
  }

onSubmit() {
    this.loading = true;
    this.http.post('http://localhost:8080/api/login', this.formdata)
      .subscribe(
        (response: any) => {
          this.loading = false;
          // JWT token'ı localStorage'a kaydediyoruz
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log('Login successful:', response);
            this.router.navigate(['/dashboard']); // Yönlendirme
          }
        },
        (error) => {
          this.loading = false;
          console.error('Error during login:', error);
          this.errorMessage = error?.error?.message || 'An unknown error occurred. Please try again.';
        }
      );
}


}