import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';  // RoomService'i import et

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  rooms: any[] = []; // Odalar listesi
  errorMessage: string = ''; // Hata mesajı

  // Fiyat aralığı ve oda türüne göre filtreleme için parametreler
  minPrice: number = 0;
  maxPrice: number = 1000;
  roomType: string = '';

  constructor(private roomService: RoomService) { }

  ngOnInit(): void {
    this.loadRooms(); // Sayfa yüklendiğinde tüm odaları getir
  }

  loadRooms() {
    this.roomService.searchRooms(this.minPrice, this.maxPrice, this.roomType).subscribe(
      (data) => {
        this.rooms = data; // Odaları al
      },
      (error) => {
        this.errorMessage = 'Failed to load rooms!'; // Hata mesajı
      }
    );
  }

  // Filtreleme işlemi
  onSearch() {
    this.loadRooms(); // Filtrelemeye göre odaları yükle
  }
}