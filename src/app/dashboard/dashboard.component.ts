import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';  // AuthService'i import et

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = {};  // Kullanıcı bilgisi burada saklanabilir

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const userInfo$ = this.authService.getUserInfo(); // Kullanıcı bilgilerini alıyoruz

    if (userInfo$) {  // Eğer getUserInfo null değilse
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
}