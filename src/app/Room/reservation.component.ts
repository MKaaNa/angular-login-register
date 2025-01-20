import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';  // RoomService import edilmiş olmalı

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

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    // Component yüklendiğinde yapılacak işlemler
  }

  getAvailableRooms(): void {
    // Oda arama fonksiyonu çağrılıyor
    this.roomService
      .getAvailableRooms(this.selectedRoomType, this.selectedGuestCount, this.startDate, this.endDate)
      .subscribe(
        (data) => {
          this.rooms = data;  // Oda listesi güncelleniyor
        },
        (error) => {
          console.error('Error fetching rooms', error);
        }
      );
  }
}