import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


// Yönlendirme ayarları
const routes: Routes = [
  { path: '', component: HomeComponent },         // Ana sayfa rotası
  { path: 'register', component: RegisterComponent }, // Kayıt sayfası
  { path: 'login', component: LoginComponent },     // Giriş sayfası
  { path: 'dashboard', component: DashboardComponent },  // Dashboard sayfası
  { path: 'rooms', component: RoomListComponent },
   { path: 'home', component: HomeComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: '', redirectTo: '/reservation', pathMatch: 'full' },  // Yönlendirme
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    RoomListComponent,
    ReservationComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),  // Yönlendirmeleri burada tanımlıyoruz
    FormsModule,
    HttpClientModule
  ],
  providers: [RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }





