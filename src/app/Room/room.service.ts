import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class RoomService {

  private apiUrl = 'http://localhost:8080/rooms';  // API URL'si

  constructor(private http: HttpClient) {}

  // Oda tipleri için açıklamalar ve resimler
  getRoomDetails(roomType: 'single' | 'double' | 'suite'): any {
    const roomDetails = {
    single: {
      imageUrl: 'si1.jpg', 
      description: 'A cozy single room with a single bed and a minimalist design.',
      bathroom: 'si2.jpg',
      kitchen: 'si3.jpg',
    },
    double: {
      imageUrl: 'd1.jpg',
      description: 'A stylish double room with a large double bed.',
      bathroom: 'd2.jpg',
      kitchen: 'd3.jpg',
    },
    suite: {
      imageUrl: 's1.jpg',
      description: 'A luxurious suite with a king-sized bed and a lavish setup.',
      bathroom: 's2.jpg',
      kitchen: 's3.jpg',
    }
  };
    return roomDetails[roomType] || {};  // Geçerli oda tipi verilmezse boş döner
  }

  // Oda arama fonksiyonu (API çağrısı)
  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string) {
    let params = new HttpParams()
    .set('roomType', roomType)
    .set('guestCount', guestCount.toString())
    .set('startDate', startDate)
    .set('endDate', endDate);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Oda ID'sine göre odanın detaylarını almak için API çağrısı
  getRoomById(roomId: number): Observable<any> {
    const url = `${this.apiUrl}/${roomId}`;
    return this.http.get<any>(url);
  }

  // Fiyat aralığına göre odaları aramak için API çağrısı
  searchRooms(minPrice: number, maxPrice: number, roomType: string): Observable<any[]> {
    const url = `${this.apiUrl}?minPrice=${minPrice}&maxPrice=${maxPrice}&roomType=${roomType}`;
    return this.http.get<any[]>(url);
  }
}