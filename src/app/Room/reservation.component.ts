import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  selectedRoomType: string = '';  
  selectedGuestCount: number = 1;  
  startDate: string = '';  
  endDate: string = '';    
  rooms: any[] = [];  
  roomsChecked: boolean = false;  
  showNoRoomsPopup: boolean = false;  
  selectedRoomDetails: any = null;  
  showRoomDetailsPopup: boolean = false;
  imageIndex: number = 0;  
  errorMessage: string = '';  

  constructor(private roomService: RoomService, private http: HttpClient) { }

  ngOnInit(): void {}

  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(
        rooms => {
          this.rooms = rooms;
          if (rooms.length === 0) {
            this.showNoRoomsPopup = true;
          } else {
            this.showNoRoomsPopup = false;
          }
        },
        error => {
          console.error('Error fetching available rooms', error);
          this.showNoRoomsPopup = true;
        }
      );
  }

  showRoomDetails(room: any): void {
    // Burada odanın detaylarını seçiyoruz
    this.selectedRoomDetails = room;

    // RoomType'a göre resim ve açıklamaları belirliyoruz
    if (this.selectedRoomDetails.roomType === 'single') {
      this.selectedRoomDetails.images = ['si1.jpg', 'si2.jpg', 'si3.jpg'];
      this.selectedRoomDetails.description = 'Tek kişilik, misafirlerimiz için kompakt ve sade bir oda.';
    } else if (this.selectedRoomDetails.roomType === 'double') {
      this.selectedRoomDetails.images = ['d1.jpg', 'd2.jpg', 'd3.jpg'];
      this.selectedRoomDetails.description = 'İki veya daha fazla sayıda misafirlerimize önermiş olduğumuz lüks ve şık olan bir oda.';
    } else if (this.selectedRoomDetails.roomType === 'suite') {
      this.selectedRoomDetails.images = ['s1.jpg', 's2.jpg', 's3.jpg'];
      this.selectedRoomDetails.description = 'Çiftlerimize özel kral dairesi lükslüğünü aratmayan ve komfordan ödün vermeyen bir oda.';
    }

    // Eğer selectedRoomDetails'te images varsa, resimlerin olduğuna emin olalım
    if (this.selectedRoomDetails?.images?.length > 0) {
      this.imageIndex = 0;  // İlk resmi göster
    } else {
      this.imageIndex = -1;  // Eğer resim yoksa
      console.warn('No images available for this room');
    }

    this.showRoomDetailsPopup = true;
  }

  changeImage(direction: number): void {
    if (this.selectedRoomDetails?.images?.length > 0) {
      this.imageIndex = (this.imageIndex + direction + this.selectedRoomDetails.images.length) % this.selectedRoomDetails.images.length;
    }
  }

  closeRoomDetailsPopup(): void {
    this.showRoomDetailsPopup = false;
    this.selectedRoomDetails = null;
  }

  closePopup(): void {
    this.showNoRoomsPopup = false;
  }
}