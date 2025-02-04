export interface ReservationHistory {
  action: string;     // Örneğin, "Created", "Approved", "Cancelled", vb.
  date: string;       // ISO formatında tarih
  note?: string;      // Opsiyonel açıklama
}

export interface Reservation {
  id?: number;
  user: {
    id: number;
    email?: string;
  };
  room: {
    id: number;
    roomType?: string;
    price?: number;
  };
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  adminNote?: string;
  history?: ReservationHistory[];  // Rezervasyon işlemleri geçmişi
}
