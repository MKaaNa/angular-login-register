import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../_services/reservation.service';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.css']
})
export class AdminReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';
  selectedReservation: Reservation | null = null;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (res: Reservation[]) => this.reservations = res,
      (error: any) => this.errorMessage = 'Failed to load reservations'
    );
  }

  approveReservation(res: Reservation): void {
    res.status = 'APPROVED';
    this.reservationService.updateReservation(res).subscribe(
      (updated: Reservation) => this.loadReservations(),
      (error: any) => console.error('Error updating reservation:', error)
    );
  }

  rejectReservation(res: Reservation): void {
    res.status = 'REJECTED';
    this.reservationService.updateReservation(res).subscribe(
      (updated: Reservation) => this.loadReservations(),
      (error: any) => console.error('Error updating reservation:', error)
    );
  }

  openEditModal(res: Reservation): void {
    // Mevcut nesnenin kopyasını alarak düzenlenebilir hale getiriyoruz
    this.selectedReservation = { ...res };
  }

  updateReservation(): void {
    if (this.selectedReservation && this.selectedReservation.id) {
      this.reservationService.updateReservation(this.selectedReservation).subscribe(
        (updated: Reservation) => {
          this.loadReservations();
          this.selectedReservation = null;
        },
        (error: any) => console.error('Error updating reservation:', error)
      );
    }
  }

  deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      () => this.loadReservations(),
      (error: any) => console.error('Error deleting reservation:', error)
    );
  }
}