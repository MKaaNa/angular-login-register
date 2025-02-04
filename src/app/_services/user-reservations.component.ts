import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { ReservationService } from '../_services/reservation.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.css']
})
export class UserReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserReservations();
  }

  loadUserReservations(): void {
    // Giriş yapan kullanıcının ID'sini alıyoruz (örneğin, sessionStorage veya AuthService üzerinden)
    const userId = Number(this.authService.getUserId());
    console.log("User ID from AuthService:", userId, "Type:", typeof userId);

    this.reservationService.getAllReservations().subscribe(
      (allReservations: Reservation[]) => {
        console.log("All Reservations:", allReservations);

        // Her rezervasyonun user.id'sini ve durumunu loglayalım:
        allReservations.forEach(r => {
          if (r.user) {
            console.log(`Reservation ID ${r.id}: User ID: ${r.user.id} (Type: ${typeof r.user.id}), Status: ${r.status}`);
          } else {
            console.log(`Reservation ID ${r.id}: User is undefined`);
          }
        });

        // Filtreleme: Yalnızca giriş yapan kullanıcının rezervasyonlarını alıyoruz.
        let userReservations = allReservations.filter((r: Reservation) => 
          r.user && Number(r.user.id) === userId
        );

        // Sıralama: En yeni rezervasyon en üstte olacak şekilde sıralıyoruz.
        // Eğer rezervasyon modelinizde bir 'created' veya 'createdAt' alanı varsa,
        // onu kullanabilirsiniz. Yoksa, id'ye göre sıralama yapıyoruz.
        userReservations.sort((a, b) => {
          const idA = a.id || 0;
          const idB = b.id || 0;
          return idB - idA;
        });
        
        this.reservations = userReservations;
        console.log("Sorted Reservations (User's):", this.reservations);
      },
      (error: any) => {
        this.errorMessage = 'Failed to load reservations';
        console.error(error);
      }
    );
  }
}
