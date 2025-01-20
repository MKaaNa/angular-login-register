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

  formdata = { email: "", password: "" };  // Form verilerini saklamak için kullanılan obje
  submit = false;  // Formun gönderilip gönderilmediğini takip eder
  loading = false;  // Yükleniyor durumu
  errorMessage = "";  // Hata mesajı
  http: HttpClient;  // HttpClient'i tanımladık

  // Constructor'da HttpClient ve Router'ı inject ediyoruz
  constructor(private auth: AuthService, private httpClient: HttpClient, private router: Router) {
    this.http = httpClient; // HttpClient'i başlatıyoruz
  }

  ngOnInit(): void {
    this.auth.canAuthenticate();  // Kullanıcının giriş yapıp yapmadığını kontrol etme
  }

  // OnSubmit fonksiyonu: Login işlemi
  onSubmit() {
    this.loading = true;  // Yükleniyor durumunu başlat
    this.http.post('http://localhost:8080/api/login', this.formdata)  // Login isteğini gönderiyoruz
      .subscribe(
        (response: any) => {
          this.loading = false;  // Yükleniyor durumunu sonlandır
          // JWT token'ı localStorage'a kaydediyoruz
          if (response.token) {
            localStorage.setItem('token', response.token);  // Token'ı localStorage'a kaydediyoruz
            console.log('Login successful:', response);  // Başarılı giriş mesajı
            this.router.navigate(['/dashboard']);  // Kullanıcıyı dashboard'a yönlendiriyoruz
          }
        },
        (error) => {
          this.loading = false;  // Yükleniyor durumunu sonlandır
          console.error('Error during login:', error);  // Hata mesajını konsola yazdırıyoruz
          this.errorMessage = error?.error?.message || 'An unknown error occurred. Please try again.';  // Hata mesajını kullanıcıya gösteriyoruz
        }
      );
  }
}