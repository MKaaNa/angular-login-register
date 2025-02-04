import { Component, OnInit } from '@angular/core';
import { RoomService } from '../Room/room.service';
import { UserService } from '../_services/user.service';
import { ReservationService } from '../_services/reservation.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  rooms: any[] = [];
  p: number = 1;
  pRoom: number = 1;
  reservations: Reservation[] = [];
  errorMessage: string = '';
  selectedReservation: Reservation | null = null;
  currentTab: string = 'userManagement';
  showAddUserModal: boolean = false;
  showEditUserModal: boolean = false;
  newUser: any = { id: '', email: '', name: '', password: 'password', userRole: '' };
  showAddRoomModal: boolean = false;
  showEditRoomModal: boolean = false;
  newRoom: any = { roomType: '', price: 0 };

  // Pending rezervasyon sayısını tutan değişken
  pendingReservationsCount: number = 0;

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService,
    private userService: UserService,
    private authService: AuthService,
    public router: Router, // Template'den erişilebilmesi için public
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
    this.loadRooms();
    this.loadUsers();
    this.checkPendingReservations();
  }

  // Sekme değiştirme fonksiyonu
  changeTab(tab: string): void {
    this.currentTab = tab;
  }

  // Pending rezervasyonları kontrol eden metod
  checkPendingReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (reservations: Reservation[]) => {
        this.pendingReservationsCount = reservations.filter(
          (r: Reservation) => r.status === 'PENDING'
        ).length;
      },
      (error: any) => {
        console.error('Error fetching pending reservations:', error);
      }
    );
  }

  // Admin rezervasyon yönetim paneline yönlendirme
  goToAdminReservations(): void {
    this.router.navigate(['/admin-reservations']);
  }

  // Kullanıcıları yükleme
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Error loading users:', error);
      }
    );
  }

  // Odaları yükleme
  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (rooms: any[]) => {
        this.rooms = rooms;
      },
      (error: any) => {
        console.error('Error loading rooms:', error);
      }
    );
  }

  // Oda ekleme modalında, oda tipi seçildiğinde otomatik fiyat belirleme
  updateDefaultPrice(): void {
    if (this.newRoom.roomType) {
      switch (this.newRoom.roomType.toLowerCase()) {
        case 'single':
          this.newRoom.price = 350;
          break;
        case 'double':
          this.newRoom.price = 450;
          break;
        case 'suite':
          this.newRoom.price = 800;
          break;
        default:
          this.newRoom.price = 0;
      }
    }
  }

  // Kullanıcı ekleme için modal açma
  openAddUserModal(): void {
    this.newUser = { id: 0, email: '', username: '', password: 'password', userRole: '' };
    this.showAddUserModal = true;
  }

  // Kullanıcı düzenleme için modal açma
  openEditUserModal(user: any): void {
    this.showEditUserModal = true;
    this.newUser = { ...user };
  }

  // Oda ekleme için modal açma
  openAddRoomModal(): void {
    this.showAddRoomModal = true;
    this.newRoom = { roomType: '', price: 0 };
  }

  // Oda düzenleme için modal açma
  openEditRoomModal(room: any): void {
    console.log('Room data before modal:', room);
    this.showEditRoomModal = true;
    this.newRoom = { ...room };
    console.log('Room data after modal:', this.newRoom);
  }

  // Rezervasyon onaylama
  approveReservation(res: Reservation): void {
    res.status = 'APPROVED';
    this.reservationService.updateReservation(res).subscribe(
      (updated: Reservation) => this.loadReservations(),
      (error: any) => console.error('Error updating reservation:', error)
    );
  }

  // Rezervasyon reddetme
  rejectReservation(res: Reservation): void {
    res.status = 'REJECTED';
    this.reservationService.updateReservation(res).subscribe(
      (updated: Reservation) => this.loadReservations(),
      (error: any) => console.error('Error updating reservation:', error)
    );
  }

  // Rezervasyonları yükleme
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      (reservations: Reservation[]) => {
        this.reservations = reservations;
      },
      (error: any) => {
        console.error('Error loading reservations:', error);
      }
    );
  }

  // Rezervasyon düzenleme için modal açma
  openEditModal(res: Reservation): void {
    this.selectedReservation = { ...res };
  }

  // Rezervasyon güncelleme
  updateReservation(): void {
    if (this.selectedReservation && this.selectedReservation.id) {
      this.reservationService.updateReservation(this.selectedReservation).subscribe(
        (updated: Reservation) => {
          this.loadReservations();
          this.selectedReservation = null;
        },
        (error: any) => console.error('Error updating reservation:', error)
      );
    }
  }

  // "Go to Reservation" butonunun tıklama işlemi
  goToReservation(): void {
    this.router.navigate(['/reservation']);
  }

  // Kullanıcı ekleme
  addUser(): void {
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser).subscribe((updatedUser: any) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeModal();
      });
    } else {
      this.userService.addUser(this.newUser).subscribe((newUser: any) => {
        this.users.push(newUser);
        this.newUser = { id: '', email: '', username: '', password: '', userRole: '' };
        this.closeModal();
      });
    }
  }

  // Kullanıcı düzenleme işlemi
  editUser(user: any): void {
    console.log('Editing user:', user);
    this.newUser = { ...user };
    this.showEditUserModal = true;
  }

  // Kullanıcıyı silme işlemi
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
    });
  }

  // Oda ekleme
  addRoom(): void {
    console.log('Adding room:', this.newRoom);
    this.roomService.addRoom(this.newRoom).subscribe((room: any) => {
      this.rooms.push(room);
      this.newRoom = { roomType: '', guestCount: 0, price: 0, startDate: '', endDate: '' };
      this.closeModal();
      console.log('Room added successfully:', room);
    }, (error: any) => {
      console.error('Error adding room:', error);
    });
  }

  // Oda düzenleme
  editRoom(): void {
    console.log('Editing room with data:', this.newRoom);
    if (this.newRoom.id) {
      this.roomService.updateRoom(this.newRoom.id, this.newRoom).subscribe(
        (updatedRoom: any) => {
          const index = this.rooms.findIndex(room => room.id === updatedRoom.id);
          if (index !== -1) {
            this.rooms[index] = updatedRoom;
          }
          console.log('Room updated successfully:', updatedRoom);
          this.closeModal();
        },
        (error: any) => {
          console.error('Error updating room:', error);
        }
      );
    } else {
      console.error('Room ID is missing or invalid:', this.newRoom.id);
    }
  }

  // Odayı silme
  deleteRoom(roomId: number): void {
    console.log('Deleting Room with ID: ', roomId);
    if (roomId === undefined || roomId === null) {
      console.error('Room ID is undefined or null');
      return;
    }
    this.roomService.deleteRoom(roomId).subscribe(
      () => {
        this.rooms = this.rooms.filter(room => room.id !== roomId);
      },
      (error: any) => {
        console.error('Error deleting room:', error);
      }
    );
  }

  // Kullanıcı bilgilerini güncellemek için
  updateUser(): void {
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser).subscribe(
        (updatedUser: any) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.closeModal();
        },
        (error: any) => {
          console.error('Update failed:', error);
        }
      );
    }
  }

  // Kullanıcıyı kaydetmek için
  saveUser(): void {
    if (this.newUser.id) {
      this.userService.updateUser(this.newUser).subscribe((updatedUser: any) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.closeModal();
      });
    } else {
      this.userService.addUser(this.newUser).subscribe((newUser: any) => {
        this.users.push(newUser);
        this.newUser = { id: '', email: '', name: '', password: '', userRole: '' };
        this.closeModal();
      });
    }
  }

  // Toplam fiyat hesaplama metodu (örnek)
  updateTotalPrice(): void {
    if (this.newRoom.roomType && this.newRoom.startDate && this.newRoom.endDate) {
      let dailyPrice = 0;
      switch (this.newRoom.roomType.toLowerCase()) {
        case 'single':
          dailyPrice = 350;
          break;
        case 'double':
          dailyPrice = 450;
          break;
        case 'suite':
          dailyPrice = 800;
          break;
        default:
          dailyPrice = 0;
      }
      
      const start = new Date(this.newRoom.startDate);
      const end = new Date(this.newRoom.endDate);
      
      let diffTime = end.getTime() - start.getTime();
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        diffDays = 1;
      }
      
      this.newRoom.price = dailyPrice * diffDays;
    }
  }

  // closeModal metodunu ekliyoruz
  closeModal(): void {
    this.showAddUserModal = false;
    this.showEditUserModal = false;
    this.showAddRoomModal = false;
    this.showEditRoomModal = false;
  }

  // logout metodunu ekliyoruz
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}