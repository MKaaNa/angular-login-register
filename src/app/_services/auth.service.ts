import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any;
  
  private apiUrl = 'http://localhost:8080/api';  // Backend API URL'si

  constructor(private http: HttpClient, private router: Router) {
    this.currentUser = { id: 39 };  // Örneğin, kullanıcı ID'sini burada hardcoded aldık
  }

  // Kullanıcı girişi sağlamak için backend API'si ile iletişim kur
 login(email: string, password: string): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${this.apiUrl}/login`, // Backend API URL
    { email, password }
  );
}

  // Token'ı sessionStorage'da sakla
  storeToken(token: string): void {
    sessionStorage.setItem('token', token);  // Token'ı sessionStorage'da sakla
  }

  getUserId(): number {
    return this.currentUser ? this.currentUser.id: null;  // Kullanıcının ID'sini döndürüyoruz
  }

  // Kullanıcıyı kontrol et
  isAuthenticated(): boolean {
    return sessionStorage.getItem('token') !== null;  // Eğer sessionStorage'da token varsa, giriş yapılmış demektir.
  }

  // Admin olup olmadığını kontrol etme
  isAdmin(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    try {
      const decodedToken: any = jwtDecode(token);  // JWT token'ını decode et
      return decodedToken.role === 'ADMIN';  // Role bilgisini kontrol et
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

removeToken(): void {
  sessionStorage.removeItem('token');  // Token'ı sessionStorage'dan sil
  localStorage.removeItem('role');  // Role bilgisini de sil
}

getUserInfo(email: string): Observable<{ user: { id: string, name: string } }> {
  const token = sessionStorage.getItem('token');

  if (!token) {
    return throwError('Token not found');  // Token yoksa hata fırlat
  }

  // Header'a token'ı ekleyin
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // GET isteği yapın ve email'i query parametresi olarak gönderin
  return this.http.get<{ user: { id: string, name: string } }>(
    `${this.apiUrl}/user/user-info`,  // Backend API URL
    {
      headers: headers,
      params: { email }  // Query parametresi olarak email gönderin
    }
  );
}

  logout(): void {
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');  // Role bilgisini de sil
    this.router.navigate(['/login']);  // Login sayfasına yönlendir
  }
}

function throwError(arg0: string): Observable<{ user: { id: string; name: string; }; }> {
  throw new Error('Function not implemented.');
}