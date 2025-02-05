export interface ReservationHistory {
  action: string;     
  date: string;       
  note?: string;      
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
  history?: ReservationHistory[];  
}
