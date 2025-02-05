import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Invoice DTO'su için basit bir model oluşturduysanız; örneğin:
export interface Invoice {
  reservationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  payReservation(reservationId: number): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${reservationId}/pay`, {});
  }
}