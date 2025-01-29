import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { UserService } from '../_services/user.service';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
currentAdminEmail: any;
room: any;
selectTab(arg0: string) {
throw new Error('Method not implemented.');
}
  users: any[] = [];
  rooms: any[] = [];
  p: number=1;
  pRoom: number=1;
  currentTab: string = 'userManagement'; 
  showAddUserModal: boolean = false;
  showEditUserModal: boolean = false;
  newUser: any = { id: '', email: '', name: '', password: 'password', user_role: '' };
  showAddRoomModal: boolean = false;
  newRoom: any = { roomType: '', price: 0 };
activeTab: any;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}


  // Modals
  showEditRoomModal: boolean = false; // Add the property for edit room modal


  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
    this.loadRooms();
    this.loadUsers();
  }

  // Sekme değiştirme fonksiyonu
  changeTab(tab: string): void {
    this.currentTab = tab;
  }


// Kullanıcı ekleme ve düzenleme için modal açma
openAddUserModal(): void {
  this.newUser = { id: 0, email: '', username: '', password: 'password', userRole: '' };
  this.showAddUserModal = true; // Modal'ı açıyoruz
}


  // Kullanıcı düzenleme için modal açma
  openEditUserModal(user: User): void {
    this.showEditUserModal = true;
    this.newUser = { ...user };  // Seçilen kullanıcıyı modalda göstermek için
  }

  openAddRoomModal(): void {
    this.showAddRoomModal = true;
    this.newRoom = { roomType: '', price: 0 };  // Yeni oda eklerken formu sıfırla
  }


  // Kullanıcı ekleme
  addUser() {
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser).subscribe((updatedUser: User) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;  // Kullanıcıyı güncelliyoruz
        }
        this.closeModal();  // Modalı kapatıyoruz
      });
    } else {
      this.userService.addUser(this.newUser).subscribe((newUser: User) => {
        this.users.push(newUser);  // Yeni kullanıcıyı listeye ekliyoruz
        this.newUser = { id: '', email: '', username: '', password: '', role: '' };  // Formu sıfırlıyoruz
        this.closeModal();  // Modalı kapatıyoruz
      });
    }
  }

  // Kullanıcıyı düzenleme işlemi
  editUser(user: User): void {
    console.log('Editing user:', user); // Kullanıcıyı düzenlemek için konsola yazdırıyoruz
    this.newUser = { ...user };  // Seçilen kullanıcıyı modalda göstermek için
    this.showEditUserModal = true;  // Edit modalını açıyoruz
  }

  // Kullanıcıyı silme işlemi
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);  // Silinen kullanıcıyı listeden çıkarıyoruz
    });
  }

  // Oda ekleme
  addRoom(): void {
    this.roomService.addRoom(this.newRoom).subscribe((room) => {
      this.rooms.push(room);
      this.newRoom = { roomType: '', price: 0 };
      this.closeModal();
    });
  }

  editRoom(): void {
    console.log('Editing room with data:', this.newRoom);  // Odanın bilgilerini kontrol et
  
    if (this.newRoom.id) {
      this.roomService.updateRoom(this.newRoom.id, this.newRoom).subscribe(
        (updatedRoom) => {
          const index = this.rooms.findIndex(room => room.id === updatedRoom.id);
          if (index !== -1) {
            this.rooms[index] = updatedRoom;  // Odayı güncelliyoruz
          }
          console.log('Room updated successfully:', updatedRoom);
          this.closeModal();  // Modalı kapatıyoruz
        },
        (error) => {
          console.error('Error updating room:', error);
        }
      );
    } else {
      console.error('Room ID is missing or invalid:', this.newRoom.id);  // Hata mesajı ver
    }
  }


// Open edit room modal with room details
openEditRoomModal(room: Room): void {
  console.log('Room data before modal:', this.room);  // Odayı modal açılmadan önce konsola yazdırıyoruz
  this.showEditRoomModal = true;
  this.newRoom = { ...room };  // Seçilen odayı modalda göstermek için
  console.log('Room data after modal:', this.newRoom);  // Odanın bilgilerini kontrol et
}

// Modal'ı kapatma
closeModal(): void {
  this.showAddUserModal = false;
  this.showEditUserModal = false;
  this.showAddRoomModal = false;
  this.showEditRoomModal = false;
}



  deleteRoom(roomId: number): void {
    console.log('Deleting Room with ID: ', roomId); // Silinen odanın ID'sini konsola yazdırıyoruz
    if (roomId === undefined || roomId === null) {
      console.error('Room ID is undefined or null');
      return;  // Eğer roomId undefined veya null ise, işlemi sonlandırıyoruz
    }
  
    this.roomService.deleteRoom(roomId).subscribe(
      () => {
        // Silme işlemi başarılıysa, odalar listesinde gerekli güncellemeleri yap
        this.rooms = this.rooms.filter(room => room.id !== roomId);
      },
      (error) => {
        console.error('Error deleting room:', error);
      }
    );
  }

// Kullanıcı bilgilerini güncellemek için
updateUser(): void {
  if (this.newUser.id) {
    this.userService.updateUser(this.newUser).subscribe(
      (updatedUser) => {
        // Güncellenen user'ı listede de güncelle
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeModal();
      },
      error => {
        console.error('Update failed:', error);
      }
    );
  }
}

saveUser(): void {
  if (this.newUser.id) {
    // Kullanıcıyı güncelleme
    this.userService.updateUser(this.newUser).subscribe((updatedUser: User) => {
      const index = this.users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.users[index] = updatedUser;
      }
      this.closeModal();
    });
  } else {
    // Yeni kullanıcı ekleme
    this.userService.addUser(this.newUser).subscribe((newUser: User) => {
      this.users.push(newUser);
      this.newUser = { id: '', email: '', name: '', password: '', userRole: '' };  // Yeni kullanıcıyı sıfırla
      this.closeModal();
    });
  }
}

  // Kullanıcıları yükleme
  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  // Odaları yükleme
  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      console.log('Rooms:', this.rooms);
    });
  }

  // Logout işlemi
  logout(): void {
    this.authService.logout();  // AuthService üzerinden logout işlemi yapılır
    this.router.navigate(['/login']);  // Login sayfasına yönlendir
  }
}
//