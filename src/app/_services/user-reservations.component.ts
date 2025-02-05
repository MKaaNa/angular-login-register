import { Component, OnInit } from '@angular/core';
import { Reservation } from '../models/reservation.model';
import { ReservationService } from '../_services/reservation.service';
import { AuthService } from '../_services/auth.service';
import { PaymentService } from '../_services/payment.service';
import { InvoiceService } from '../_services/invoice.service';
import { Router } from '@angular/router';
import { Invoice } from '../models/invoice.model';

@Component({
  selector: 'app-user-reservations',
  templateUrl: './user-reservations.component.html',
  styleUrls: ['./user-reservations.component.css']
})
export class UserReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  errorMessage: string = '';

  // Ödeme modalı değişkenleri
  showPaymentModal: boolean = false;
  selectedReservationId: number | null = null;
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  paymentError: string = '';
  paymentSuccessMessage: string = '';

  constructor(
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserReservations();
  }

  loadUserReservations(): void {
    const userId = Number(this.authService.getUserId());
    this.reservationService.getAllReservations().subscribe(
      (allReservations: Reservation[]) => {
        let userReservations = allReservations.filter((r: Reservation) =>
          r.user && Number(r.user.id) === userId
        );
        userReservations.sort((a, b) => (b.id || 0) - (a.id || 0));
        this.reservations = userReservations;
      },
      (error: any) => {
        this.errorMessage = 'Failed to load reservations';
        console.error(error);
      }
    );
  }

  openPaymentModal(reservationId: number): void {
    this.selectedReservationId = reservationId;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.paymentError = '';
    this.paymentSuccessMessage = '';
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedReservationId = null;
  }

  submitPayment(): void {
    if (!this.cardNumber || !this.cardExpiry || !this.cardCvv) {
      this.paymentError = 'Lütfen tüm kart bilgilerini doldurun.';
      return;
    }
    if (this.selectedReservationId == null) {
      this.paymentError = 'Rezervasyon bilgisi eksik.';
      return;
    }
    this.paymentService.payReservation(this.selectedReservationId).subscribe(
      (invoice: Invoice) => {
        this.paymentSuccessMessage = 'Ödemeniz başarıyla tamamlandı.';
        this.loadUserReservations();
        setTimeout(() => {
          this.closePaymentModal();
          this.router.navigate(['/invoice', invoice.reservationId]);
        }, 2000);
      },
      (error) => {
        console.error('Payment failed:', error);
        this.paymentError = 'Ödeme işlemi başarısız. Lütfen tekrar deneyin.';
      }
    );
  }

  payReservation(reservationId: number): void {
    this.openPaymentModal(reservationId);
  }

  viewInvoice(reservationId: number): void {
    this.invoiceService.getInvoiceTxt(reservationId).subscribe(
      (txtBlob) => {
        const blobUrl = URL.createObjectURL(txtBlob);
        window.open(blobUrl, '_blank');
      },
      (error) => {
        console.error('Failed to fetch invoice TXT:', error);
        this.errorMessage = 'Fatura görüntülenemedi. Lütfen tekrar deneyin.';
      }
    );
  }
}