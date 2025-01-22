import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';  // Yönlendirme işlemi için Router'ı import et

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);  // Eğer kullanıcı giriş yapmışsa dashboard'a yönlendir
    }
  }

  // Login sayfasına yönlendirme fonksiyonu
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Register sayfasına yönlendirme fonksiyonu
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Rezervasyon sayfasına yönlendirme fonksiyonu
  goToReservation(): void {
    this.router.navigate(['/reservation']);
  }
}