import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService import et
import { Router } from '@angular/router';  // Router import et

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = {};  // Kullanıcı bilgilerini burada saklayacağız
  email: string = ''; // Email özelliğini burada tanımlıyoruz

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  
    // Admin ise admin paneline yönlendir
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin-dashboard']);
    }
  
    const email = sessionStorage.getItem('email');
    if (email) {
      this.authService.getUserInfo(email).subscribe(
        (userData) => {
          this.user = userData;
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    } else {
      console.warn('No email found in sessionStorage');
    }
  }

  // Kullanıcı çıkışı
  logout(): void {
    this.authService.logout();  // Token'ı sil
    this.router.navigate(['/home']);  // Home sayfasına yönlendir
  }

  // Rezervasyon yapma işlevi
  makeReservation(): void {
    this.router.navigate(['/reservation']);  // Rezervasyon sayfasına yönlendir
  }
}