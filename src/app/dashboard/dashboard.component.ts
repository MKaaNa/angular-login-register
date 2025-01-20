import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = null;  // user objesini burada tanımlıyoruz

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Token'ı decode edip user bilgilerini alıyoruz
      const decodedToken = this.decodeToken(token);  // Decode token method
      // Token'dan alınan displayName ve name bilgilerini user objesine atıyoruz
      this.user = { 
        name: decodedToken?.name,  // Token'dan gelen name bilgisi
        displayName: decodedToken?.sub,  // Display name, eğer varsa
        localId: decodedToken?.sub  // Firebase ID
      };
    } else {
      console.error('No token found in localStorage');
    }
  }

  // Token'ı decode eden method
  decodeToken(token: string) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const decodedPayload = atob(parts[1]);  // Base64 decode
      return JSON.parse(decodedPayload);
    }
    return null;
  }
}