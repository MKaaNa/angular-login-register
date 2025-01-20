import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';  // Router'ı import etmeliyiz
import { Observable } from 'rxjs';  // Observable import

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  // Kullanıcıyı kontrol et
  isAuthenticated(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  // Kullanıcı girişi sağlamak için backend API'si ile iletişim kur
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/api/login',  // Backend API URL'inizi kullanın
      { email, password }
    );
  }

  // Kayıt için backend API'sine veri gönder
  register(name: string, email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      'http://localhost:8080/api/register',  // Backend API URL'inizi kullanın
      { name, email, password }
    );
  }

  // Token'ı sakla
  storeToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  // Token'ı sil
  removeToken(): void {
    sessionStorage.removeItem('token');
  }

  // Kullanıcıyı kontrol et, erişim izni yoksa login sayfasına yönlendir
  canAccess(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  // Kullanıcı girişi varsa otomatik olarak dashboard'a yönlendir
  canAuthenticate(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Kullanıcı bilgilerini almak için backend API'sine istek at
  getUserInfo(): Observable<{ user: { id: string, name: string } }> | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      return this.http.post<{ user: { id: string, name: string } }>(
        'http://localhost:8080/api/user-info',  // Backend API URL'inizi kullanın
        { token }
      );
    }
    return null;  // Token yoksa null döndür
  }
}