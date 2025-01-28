import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';  // Correct import

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/user';  // Doğru backend API URL'si

  constructor(private http: HttpClient) {}

  // Kullanıcıları almak için API çağrısı
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);  // Kullanıcıları almak için GET methodu
  }

  // Yeni kullanıcı eklemek için API çağrısı
  addUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);  // Yeni kullanıcı eklemek için POST methodu
  }

  // Kullanıcıyı silmek için API çağrısı
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${userId}`);
  }
  // Kullanıcı rolünü güncellemek için API çağrısı
  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, { role });  // Kullanıcı rolünü güncellemek için PUT methodu
  }

   // Kullanıcıyı güncelle
   updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, user);  // Kullanıcıyı güncelleme işlemi
  }
}