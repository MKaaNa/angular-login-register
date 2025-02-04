import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';  // Doğru şekilde default import

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
        this.authService.storeToken(response.token);  
        sessionStorage.setItem('email', this.email);  

        try {
          // Token'ı decode et ve payload'dan bilgileri al
          const decodedToken: any = jwtDecode(response.token);
          console.log('Decoded Token: ', decodedToken);
          const role = decodedToken.role;      // JWT'nin payload'ından role bilgisi
          const userId = decodedToken.id || decodedToken.sub;        // JWT'nin payload'ından kullanıcı ID'si (ID alanınız farklıysa güncelleyin)
          
          
          // Debug logları
          console.log('Decoded Role:', role);
          console.log('Decoded User ID:', userId);

          // AuthService içindeki currentUser bilgisini güncelle
          this.authService.setCurrentUser({
            id: Number(userId),
            email: this.email,
            role: role
          });

          // Kullanıcı rolüne göre yönlendirme yap
          if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);  // Admin paneline yönlendir
          } else {
            this.router.navigate(['/dashboard']);          // Kullanıcı paneline yönlendir
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