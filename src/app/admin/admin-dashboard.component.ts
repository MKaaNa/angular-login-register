import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { UserService } from '../_services/user.service';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  rooms: any[] = [];
  showAddUserModal: boolean = false;
  newUser: any = { id: '', email: '', username: '', password: '', role: '' };
  showAddRoomModal: boolean = false;
  newRoom: any = { roomType: '', price: 0 };

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }

    this.loadRooms();
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.newUser = { id: '', email: '', username: '', password: '', role: '' };
  }

  openAddRoomModal(): void {
    this.showAddRoomModal = true;
  }

  closeModal(): void {
    this.showAddUserModal = false;
    this.showAddRoomModal = false;
  }

  addUser(): void {
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser).subscribe((updatedUser: User) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeModal();
      });
    } else {
      this.userService.addUser(this.newUser).subscribe((newUser: User) => {
        this.users.push(newUser);
        this.newUser = { id: '', email: '', username: '', password: '', role: '' };
        this.closeModal();
      });
    }
  }

  editUser(userId: number): void {
    const userToEdit = this.users.find(user => user.id === userId);
    if (userToEdit) {
      this.newUser = { ...userToEdit };
      this.showAddUserModal = true;
    }
  }

 // Kullanıcıyı silme işlemi
 deleteUser(userId: number) {
  if (userId !== undefined && userId !== null) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
    });
  } else {
    console.error('User ID is undefined');
  }
}

  addRoom(): void {
    this.roomService.addRoom(this.newRoom).subscribe((room) => {
      this.rooms.push(room);
      this.newRoom = { roomType: '', price: 0 };
      this.closeModal();
    });
  }

  editRoom(roomId: number): void {
    const updatedRoom = {
      roomType: 'Deluxe',
      price: 200
    };
    this.roomService.updateRoom(roomId, updatedRoom).subscribe((room) => {
      const index = this.rooms.findIndex(r => r.id === roomId);
      if (index !== -1) {
        this.rooms[index] = room;
      }
    });
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId).subscribe(() => {
      this.rooms = this.rooms.filter(room => room.id !== roomId);
    });
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users);  // Kullanıcıları konsola yazdırarak kontrol edin
    });
  }
   // Logout işlemi
   logout(): void {
    this.authService.logout();  // AuthService üzerinden logout işlemi yapılır
    this.router.navigate(['/login']);  // Login sayfasına yönlendir
  }
}