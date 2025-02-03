export interface Reservation {
    id?: number;  // Yeni rezervasyon oluştururken id olmayabilir
    user: {
      id: number;
      email?: string;  // Rezervasyon oluşturma sırasında email gönderilmez, backend doldurur
    };
    room: {
      id: number;
      roomType?: string; // Backend tarafından doldurulacak
      price?: number;    // Backend tarafından doldurulacak
    };
    startDate: string;   // ISO formatında (örn: "2025-02-03")
    endDate: string;     // ISO formatında
    guestCount: number;
    totalPrice: number;
    status: string;      // "PENDING", "APPROVED", "REJECTED", "PAID" vb.
    adminNote?: string;
  }