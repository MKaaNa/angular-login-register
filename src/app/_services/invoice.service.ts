import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/api/reservations/invoice';

  constructor(private http: HttpClient) {}

  getInvoiceTxt(reservationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${reservationId}`, { responseType: 'blob' });
  }
}