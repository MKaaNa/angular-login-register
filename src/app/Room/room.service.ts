import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://localhost:8080/rooms';  // Güncellenmiş API URL'si

  constructor(private http: HttpClient) {}

  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): Observable<any[]> {
    const url = `${this.apiUrl}?roomType=${roomType}&guestCount=${guestCount}&startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any[]>(url);
  }

  getRoomById(roomId: number): Observable<any> {
    const url = `${this.apiUrl}/${roomId}`;
    return this.http.get<any>(url);
  }

  searchRooms(minPrice: number, maxPrice: number, roomType: string): Observable<any[]> {
    const url = `${this.apiUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}&roomType=${roomType}`;
    return this.http.get<any[]>(url);
  }
}