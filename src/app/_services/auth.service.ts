import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // API ile iletişim
import { Observable } from 'rxjs';  // Observable import
import { Router } from '@angular/router';  // Router'ı import et

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api';  // Backend API URL'si

  constructor(private http: HttpClient, private router: Router) {}

  // Kullanıcı giriş durumu kontrol fonksiyonu (sessionStorage üzerinden token kontrolü)
  isAuthenticated(): boolean {
    return sessionStorage.getItem('token') !== null;  // Eğer sessionStorage'da token varsa, giriş yapılmış demektir.
  }

  // Kullanıcı girişi sağlamak için backend API'si ile iletişim kur
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/login`,  // Backend API URL
      { email, password }
    );
  }

  // Kayıt için backend API'sine veri gönder
  register(name: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,  // Backend API URL
      { name, email, password }
    );
  }

  // Token'ı sessionStorage'da sakla
  storeToken(token: string): void {
    sessionStorage.setItem('token', token);  // Token'ı sessionStorage'da sakla
  }

  // Token'ı sessionStorage'dan sil
  removeToken(): void {
    sessionStorage.removeItem('token');  // Token'ı sessionStorage'dan sil
  }

  // Kullanıcı bilgilerini almak için backend API'sine istek at
  getUserInfo(): Observable<{ user: { id: string, name: string } }> | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      return this.http.post<{ user: { id: string, name: string } }>(
        `${this.apiUrl}/user-info`,  // Backend API URL
        { token }
      );
    }
    return null;  // Eğer token yoksa, null döndür
  }

  // Kullanıcıyı kontrol et, erişim izni yoksa login sayfasına yönlendir
  canAccess(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    }
  }

// Kullanıcı çıkışını yap
  logout(): void {
    sessionStorage.removeItem('token');  // Token'ı silerek kullanıcıyı çıkartıyoruz
    this.router.navigate(['/home']);  // Kullanıcıyı anasayfaya yönlendiriyoruz
  }
}