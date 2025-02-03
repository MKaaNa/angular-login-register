import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ReservationService } from '../_services/reservation.service';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = {};
  reservationUpdates: string[] = [];

  constructor(
    private authService: AuthService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId(); // Kullanıcı ID'sini al
    if (userId) {
      this.checkUserReservations(userId);
    }
  }

  checkUserReservations(userId: number): void {
    this.reservationService.getAllReservations().subscribe(
      (reservations: Reservation[]) => {
        reservations.forEach((res: Reservation) => {
          if (res.user && res.user.id === userId && res.status !== 'PENDING') {
            this.reservationUpdates.push(`Reservation ${res.id} is now ${res.status}`);
          }
        });
      },
      (error: any) => {
        console.error('Error fetching user reservations:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  makeReservation(): void {
    this.router.navigate(['/reservation']);
  }
}