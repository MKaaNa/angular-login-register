export class Reservation {
    room: { id: number };
    startDate: string;
    endDate: string;
    guestCount: number;
    user: { id: number };
  
    constructor(roomId: number, startDate: string, endDate: string, guestCount: number, userId: number) {
      this.room = { id: roomId };  // room property'yi atıyoruz
      this.startDate = startDate;
      this.endDate = endDate;
      this.guestCount = guestCount;
      this.user = { id: userId };
    }
  }