import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:8080/api/invoice';

  constructor(private http: HttpClient) {}

  getInvoicePdf(reservationId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${reservationId}`, { responseType: 'blob' });
  }
}