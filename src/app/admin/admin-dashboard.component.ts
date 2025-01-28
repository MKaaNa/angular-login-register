// In admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';  // Correct path
import { UserService } from '../_services/user.service';  // Correct path
import { Room } from '../models/room.model';  // Correct path
import { User } from '../models/user.model';  // Correct path


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
     users: any[] = [];
  authService: any;
  router: any;
     
openAddUserModal() {
throw new Error('Method not implemented.');
}
editUser(arg0: any) {
throw new Error('Method not implemented.');
}
deleteUser(arg0: any) {
throw new Error('Method not implemented.');
}
openAddRoomModal() {
throw new Error('Method not implemented.');
}
editRoom(arg0: any) {
throw new Error('Method not implemented.');
}
closeModal() {
throw new Error('Method not implemented.');
}
  rooms: Room[] = [];
  newRoom: Room = { id: 0, roomType: '', price: 0 };
  newUser: User = { id: 0, email: '', role: '' };

  constructor(
    private roomService: RoomService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Admin değilse login sayfasına yönlendir
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
    
    this.loadRooms();
    this.loadUsers();
  }
    

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
  }
    loadUsers() {
    this.userService.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  addRoom(): void {
    this.roomService.addRoom(this.newRoom).subscribe((response: Room) => {
      this.rooms.push(response);
    });
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId).subscribe(() => {
      this.rooms = this.rooms.filter((room) => room.id !== roomId);
    });
  }

  addUser(): void {
    this.userService.addUser(this.newUser).subscribe((response: User) => {
      // Handle user creation
    });
  }
}