import { Component } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService'i import et
import { Router } from '@angular/router';  // Router'ı import et

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();  // Kullanıcı giriş yapmış mı kontrol et
  }

  logout(): void {
    this.authService.removeToken();  // Token'ı kaldır
    this.router.navigate(['/login']);  // Login sayfasına yönlendir
  }
}