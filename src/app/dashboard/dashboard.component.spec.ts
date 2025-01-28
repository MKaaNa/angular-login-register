import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService'i import et

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
makeReservation() {
throw new Error('Method not implemented.');
}
logout() {
throw new Error('Method not implemented.');
}
  user: any = {};  // Kullanıcı bilgisi burada saklanabilir
  isAuthenticated: boolean = false;  // Kullanıcının giriş yapıp yapmadığını kontrol ederiz

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated(); // Giriş yapılıp yapılmadığını kontrol et
    if (this.isAuthenticated) {
      const userInfo$ = this.authService.getUserInfo(this.user.email); // Kullanıcı bilgilerini alıyoruz
      userInfo$?.subscribe(
        (userData) => {
          this.user = userData;  // Kullanıcı bilgilerini al
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }
}