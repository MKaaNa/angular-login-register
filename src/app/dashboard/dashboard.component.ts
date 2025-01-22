import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service'; // AuthService import et
import { Router } from '@angular/router'; // Router import et
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = {};  // Kullanıcı bilgisi burada saklanabilir

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);  // Giriş yapılmamışsa home sayfasına yönlendir
    }

    const userInfo$ = this.authService.getUserInfo(); // Kullanıcı bilgilerini alıyoruz

    if (userInfo$) {
      userInfo$.subscribe(
        (userData) => {
          this.user = userData;  // Kullanıcı bilgilerini al
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    } else {
      console.warn('No user info available!');
    }
  }

  // Logout işlevi
  logout(): void {
    this.authService.logout();  // Çıkış yap
    this.router.navigate(['/home']);  // Home sayfasına yönlendir
  }

  // Make Reservation işlevi
  makeReservation(): void {
    this.router.navigate(['/reservation']);  // Rezervasyon sayfasına yönlendir
  }
}