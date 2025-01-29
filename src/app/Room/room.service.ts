import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://localhost:8080';  // API URL'si

  constructor(private http: HttpClient) {}

  // Oda ekleme işlemi
  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, room);
  }

  // Oda silme işlemi
  deleteRoom(roomId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rooms/${roomId}`);
  }
  
  updateRoom(roomId: number, updatedRoom: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/rooms/${roomId}`, updatedRoom);  // Odayı güncelleme işlemi
  }

  // Tüm odaları almak için API çağrısı
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  // Oda ID'sine göre odanın detaylarını almak için API çağrısı
  getRoomById(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${roomId}`);
  }

  // Oda tiplerine göre açıklamalar ve resimler
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

  // Oda arama fonksiyonu (Fiyat aralığı, oda tipi ve tarih aralığı ile odaları arama)
  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): Observable<any[]> {
    let params = new HttpParams()
      .set('roomType', roomType)
      .set('guestCount', guestCount.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any[]>(`${this.apiUrl}/rooms`, { params });
  }

  // Fiyat aralığına göre odaları aramak için API çağrısı
  searchRooms(minPrice: number, maxPrice: number, roomType: string): Observable<any[]> {
    let params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString())
      .set('roomType', roomType);
    return this.http.get<any[]>(`${this.apiUrl}/rooms/search`, { params });
  }


}