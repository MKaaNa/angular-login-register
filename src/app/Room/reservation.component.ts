import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';  
import { Router } from '@angular/router';  
import { ReservationService } from '../_services/reservation.service';
import { Reservation } from '../models/reservation.model';

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
  filterByDateRange: boolean = false;
  paginatedRooms: any;
  currentPage: any;
  totalPages: any;

  selectedRoomId: number = 0;  // Seçilen odanın ID'si

  constructor(
    private roomService: RoomService, 
    private http: HttpClient,
    private reservationService: ReservationService,
    private authService: AuthService,  
    private router: Router  
  ) { }

  ngOnInit(): void {}

  // Kullanıcının admin olup olmadığını kontrol et
  isAdmin(): boolean {
    return this.authService.isAdmin();  
  }

  // Admin dashboard'a yönlendirme
  goToAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  // Oda listesini almak için API çağrısı
  getAvailableRooms(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(
        (rooms: any[]) => {
          this.rooms = rooms;
          this.showNoRoomsPopup = rooms.length === 0;
        },
        (error: any) => {
          console.error('Error fetching available rooms', error);
          this.showNoRoomsPopup = true;
        }
      );
  }

  // Tarih aralığına göre oda filtreleme
  getAvailableRoomsWithDateRange(roomType: string, guestCount: number, startDate: string, endDate: string): void {
    this.roomService.getAvailableRooms(roomType, guestCount, startDate, endDate)
      .subscribe(
        (rooms: any[]) => {
          let filteredRooms = rooms.filter((room: any) => {
            let availableDates = room.availableDates;
            return availableDates.some((date: string) => date >= startDate && date <= endDate);
          });

          this.rooms = filteredRooms.map(room => ({ ...room, startDate, endDate }));
          this.showNoRoomsPopup = filteredRooms.length === 0;
        },
        (error: any) => {
          console.error('Error fetching available rooms with date range', error);
          this.showNoRoomsPopup = true;
        }
      );
  }

  // Oda detaylarını gösterme
  showRoomDetails(room: any): void {
    this.selectedRoomDetails = room;
    this.selectedRoomId = room.id;  // Seçilen odanın ID'si kaydediliyor
    console.log(this.selectedRoomId);
    
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

  // Rezervasyon oluşturma
  createReservation(): void {
    const reservation: Reservation = {
        room: { id: this.selectedRoomId },  // Seçilen odanın ID'si "room" nesnesi içinde gönderiliyor
        startDate: this.startDate,
        endDate: this.endDate,
        guestCount: this.selectedGuestCount,
        user: { id: this.authService.getUserId() }
    };

    this.reservationService.createReservation(reservation).subscribe(
        (response: any) => {
            console.log('Reservation created successfully:', response);
            // Başarılı rezervasyon sonrası yönlendirme veya mesaj gösterilebilir.
        },
        (error) => {
            console.error('Error creating reservation:', error);
            // Hata durumunda kullanıcıya mesaj gösterilebilir.
        }
    );
  }

  // Kolonlara göre sıralama fonksiyonu
  sortByColumn(column: string): void {
    this.rooms.sort((a, b) => {
      if (column === 'price') {
        return b.price - a.price;
      } else if (column === 'startDate' || column === 'endDate') {
        return new Date(b[column]).getTime() - new Date(a[column]).getTime();
      } else if (column === 'guestCount') {
        return b.guestCount - a.guestCount;
      }
      return 0;
    });
  }

  // Resim değiştirme işlemi
  changeImage(direction: number): void {
    if (this.selectedRoomDetails?.images?.length > 0) {
      this.imageIndex = (this.imageIndex + direction + this.selectedRoomDetails.images.length) % this.selectedRoomDetails.images.length;
    }
  }

  // Oda detayları popup'ını kapatma
  closeRoomDetailsPopup(): void {
    this.showRoomDetailsPopup = false;
    this.selectedRoomDetails = null;
  }

  // Popup'ı kapatma
  closePopup(): void {
    this.showNoRoomsPopup = false;
  }
}