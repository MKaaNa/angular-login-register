import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AdminReservationsComponent } from './admin/admin-reservations.component';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomListComponent } from './Room/room-list.component';
import { ReservationComponent } from './Room/reservation.component';
import { RoomService } from './Room/room.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { UserService } from './_services/user.service';
import { NgxPaginationModule } from 'ngx-pagination'; // Import the module
import { ReservationService } from './_services/reservation.service'; // Servisi import edin
import { CommonModule } from '@angular/common'; // CommonModule'ı import edin
import { UserReservationsComponent } from './_services/user-reservations.component';  // Yeni bileşen


// Yönlendirme ayarları
const routes: Routes = [
  { path: '', component: HomeComponent },         // Ana sayfa rotası
  { path: 'register', component: RegisterComponent }, // Kayıt sayfası
  { path: 'login', component: LoginComponent },     // Giriş sayfası
  { path: 'dashboard', component: DashboardComponent },  // Dashboard sayfası
  { path: 'rooms', component: RoomListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'reservation', component: ReservationComponent },
  { path: 'admin-reservations', component: AdminReservationsComponent },
  { path: 'user-reservations', component: UserReservationsComponent }, // Yeni rota
  { path: '', redirectTo: '/reservation', pathMatch: 'full' },  // Yönlendirme
  
];

@NgModule({
  declarations: [
    AppComponent,
    AdminReservationsComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    RoomListComponent,
    ReservationComponent,
    UserReservationsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),  
    FormsModule,
    NgxPaginationModule,
    HttpClientModule
  ],
  providers: [RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }





