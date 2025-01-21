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
  roomsChecked: boolean = false;  // Odalar arandı mı?
  errorMessage: string = '';  // Hata mesajı

  constructor(private roomService: RoomService, private http: HttpClient) {}

  ngOnInit(): void {
    // Component yüklendiğinde yapılacak işlemler
  }

  // Odaları alırken API'yi çağırıyoruz
  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    this.roomsChecked = true;  // Odalar arandı

    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(
        rooms => {
          this.rooms = rooms;
          if (rooms.length === 0) {
            this.errorMessage = 'No rooms available for the selected criteria.';
          } else {
            this.errorMessage = ''; // Odalar bulunduysa hata mesajını temizle
          }
        },
        error => {
          console.error('Error fetching available rooms', error);
          this.errorMessage = 'An error occurred while fetching the rooms.';
        }
      );
  }

  // Oda hakkında daha fazla bilgi göster
  showRoomDetails(roomId: number): void {
    // Burada oda hakkında detayları gösterecek işlemleri yazabilirsiniz
    console.log('Room details for room ID:', roomId);
  }
}