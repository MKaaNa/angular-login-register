import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService'i import et
import { Router } from '@angular/router';  // Yönlendirme için Router'ı import et

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  // Kullanıcıyı login et
  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.authService.storeToken(response.token);  // Token'ı sakla
        this.router.navigate(['/dashboard']);  // Dashboard'a yönlendir
      },
      (error) => {
        console.error('Error logging in:', error);
      }
    );
  }
}