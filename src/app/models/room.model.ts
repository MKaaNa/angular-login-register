// src/app/models/room.model.ts
export interface Room {
  id: number;
  roomType: string;
  price: number;
  guestCount: number;
  startDate: string;   
  endDate: string;  
}