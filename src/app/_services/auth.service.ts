import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: { id: number; email: string; role: string } | null = null;

  setCurrentUser(user: { id: number; email: string; role: string }): void {
    this.currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  private apiUrl = 'http://localhost:8080/api';  // Backend API URL'si

  constructor(private http: HttpClient, private router: Router) { }

  // Login işlemi (backend'den token ve opsiyonel olarak kullanıcı bilgilerini döndürebilir)
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password });
  }

  // Token'ı sessionStorage'da sakla
  storeToken(token: string): void {
    sessionStorage.setItem('token', token);
  }
  // Kullanıcının ID'sini döndürür (giriş yapılmamışsa null döner)
  getUserId(): number {
    if (this.currentUser !== null) {
      return this.currentUser.id;
    }
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser!.id;
    }
    // Kullanıcı bilgisi bulunamazsa, uygun bir varsayılan değer döndürün veya hata fırlatın
    return 0; // veya throw new Error('User not logged in');
  }


  isAuthenticated(): boolean {
    return sessionStorage.getItem('token') !== null;
  }

  isAdmin(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role === 'ADMIN';
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  removeToken(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}