import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {

  getRooms(selectedRoomType: string, selectedGuestCount: number, startDate: string, endDate: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/rooms';  // Güncellenmiş API URL'si

  constructor(private http: HttpClient) {}

  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string) {
    let params = new HttpParams()
    .set('roomType', roomType)
    .set('guestCount', guestCount.toString())
    .set('startDate', startDate)
        .set('endDate', endDate);
      return this.http.get<any[]>(this.apiUrl, { params });
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