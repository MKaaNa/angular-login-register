import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService'i import et
import { Router } from '@angular/router';  // Yönlendirme için Router'ı import et
import { jwtDecode } from 'jwt-decode';  // jwt-decode'i doğru şekilde import et

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Login fonksiyonu
  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Backend'den dönen token'ı sakla
        this.authService.storeToken(response.token);  // Token'ı sakla
        sessionStorage.setItem('email', this.email);  // Email'i sessionStorage'a kaydet
  
        try {
          // Token'ı decode et ve role bilgisini al
          const decodedToken: any = jwtDecode(response.token);
          const role = decodedToken.role;  // JWT'nin payload'ından role bilgisini al
          //Debug
          console.log('Decoded Role:',role);

          // Kullanıcı rolüne göre yönlendirme yap
          if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);  // Admin paneline yönlendir
          } else {
            this.router.navigate(['/dashboard']);  // Kullanıcı paneline yönlendir
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          this.errorMessage = 'An error occurred while decoding the token';
        }
      },
      (error) => {
        console.error('Error logging in:', error);
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
}