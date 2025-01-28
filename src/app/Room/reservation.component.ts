import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
previousPage() {
throw new Error('Method not implemented.');
}
nextPage() {
throw new Error('Method not implemented.');
}
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
  filterByDateRange: boolean = false;
paginatedRooms: any;
currentPage: any;
totalPages: any;

  constructor(private roomService: RoomService, private http: HttpClient) { }

  ngOnInit(): void {}

  
  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): void {
  this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
    .subscribe(
      (rooms: any[]) => {
        this.rooms = rooms;
        if (rooms.length === 0) {
          this.showNoRoomsPopup = true;
        } else {
          this.showNoRoomsPopup = false;
        }
      },
      (error: any) => {
        console.error('Error fetching available rooms', error);
        this.showNoRoomsPopup = true;
      }
    );
}

  // Tarih aralığına göre filtreleme
  getAvailableRoomsWithDateRange(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(
        (rooms: any[]) => {
          let filteredRooms = rooms.filter((room: any) => {
            let availableDates = room.availableDates;
            return availableDates.some((date: string) => {
              return date >= startDate && date <= endDate;
            });
          });

          this.rooms = filteredRooms.map(room => ({ ...room, startDate, endDate }));

          if (filteredRooms.length === 0) {
            this.showNoRoomsPopup = true;
          } else {
            this.showNoRoomsPopup = false;
          }
        },
        (error: any) => {
          console.error('Error fetching available rooms with date range', error);
          this.showNoRoomsPopup = true;
        }
      );
  }

  // Oda detaylarını göster
  showRoomDetails(room: any): void {
    this.selectedRoomDetails = room;

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

    if (this.selectedRoomDetails?.images?.length > 0) {
      this.imageIndex = 0;
    } else {
      this.imageIndex = -1;
      console.warn('No images available for this room');
    }

    this.showRoomDetailsPopup = true;
  }

// Sıralama fonksiyonu
  sortByColumn(column: string): void {
    this.rooms.sort((a, b) => {
      if (column === 'price') {
        return b.price - a.price;  // Fiyat olarak büyükten küçüğe sıralama
      } else if (column === 'startDate' || column === 'endDate') {
        return new Date(b[column]).getTime() - new Date(a[column]).getTime();  // Tarihlere göre sıralama
      } else if (column === 'guestCount') {
        return b.guestCount - a.guestCount;  // Misafir sayısına göre sıralama
      }
      return 0;
    });
  }


  // Resim değiştirme işlevi
  changeImage(direction: number): void {
    if (this.selectedRoomDetails?.images?.length > 0) {
      this.imageIndex = (this.imageIndex + direction + this.selectedRoomDetails.images.length) % this.selectedRoomDetails.images.length;
    }
  }

  // Oda detaylarını popup kapatma
  closeRoomDetailsPopup(): void {
    this.showRoomDetailsPopup = false;
    this.selectedRoomDetails = null;
  }

  // Popup'ı kapatma
  closePopup(): void {
    this.showNoRoomsPopup = false;
  }
}