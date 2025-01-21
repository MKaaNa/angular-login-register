import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  selectedRoomType: string = '';  // Oda tipi
  selectedGuestCount: number = 1;  // Konuk sayısı
  startDate: string = '';  // Başlangıç tarihi
  endDate: string = '';    // Bitiş tarihi
  rooms: any[] = [];  // Odaların listesi

  constructor(private roomService: RoomService, private http: HttpClient) {}

  ngOnInit(): void {
    // Component yüklendiğinde yapılacak işlemler
  }

  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    
    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(rooms => {
        this.rooms = rooms;
      }, error => {
        console.error('Error fetching available rooms', error);
      });
  }
}