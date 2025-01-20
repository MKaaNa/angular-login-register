import { Component } from '@angular/core';
import { RoomService } from './room.service';

@Component({
  selector: 'app-room-search',
  templateUrl: './room-search.component.html',
  styleUrls: ['./room-search.component.css']
})
export class RoomSearchComponent {
  minPrice: number;
  maxPrice: number;
  roomType: string;
  rooms: any[] = [];

  constructor(private roomService: RoomService) { }

  onSearch(): void {
    this.roomService.searchRooms(this.minPrice, this.maxPrice, this.roomType)
      .subscribe(rooms => {
        this.rooms = rooms;
      }, error => {
        console.error('Error fetching rooms', error);
      });
  }
}