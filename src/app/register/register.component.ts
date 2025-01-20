import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms'; // NgForm tipini import ettik

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formdata = {
    name: '',
    email: '',
    password: ''
  };
  submit = false;
  errorMessage = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  // form parametresine NgForm tipi ekledik
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.http.post('http://localhost:8080/api/register', this.formdata, { responseType: 'text' })
        .subscribe(response => {
          console.log('User registered successfully:', response);
          this.router.navigate(['/login']); // Kayıt başarılıysa login sayfasına yönlendir
        }, error => {
          this.loading = false;
          this.errorMessage = 'Registration failed. Please try again.';
          console.error('There was an error!', error);
        });
    }
  }
}